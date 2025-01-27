<?php

namespace Tests\Feature;

use App\Models\Image;
use App\Models\Location;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Permission\Models\Role;
use Stripe\Checkout\Session;
use Mockery;
use Inertia\Testing\AssertableInertia as Assert;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public User $user;
    public Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->user->assignRole(Role::create(["name" => "admin"]));
        $this->actingAs($this->user);
        $images = Image::factory(3)->create();
        $products = Product::factory(2)
            ->create()
            ->each(function ($product) use ($images) {
                $product->images()->attach($images->pluck("id")->toArray());
            });

        $this->order = Order::factory()->create([
            "user_id" => $this->user->id,
            "session_id" => "valid_session_id",
        ]);
        foreach ($products as $product) {
            $this->order->products()->attach($product->id, ["quantity" => 1]);
        }
        $this->order->locations()->attach(Location::factory()->create()->id);
    }

    #[Test]
    public function user_can_view_order_with_valid_id()
    {
        // Mock a Stripe session retrieval
        $mockSession = Mockery::mock("alias:" . Session::class);
        $mockSession
            ->shouldReceive("retrieve")
            ->with("valid_session_id")
            ->andReturn((object) ["id" => "valid_session_id"]);

        $response = $this->actingAs($this->order->user)->get(
            route("orders.show", [
                "order" => $this->order->id,
                "session_id" => "valid_session_id",
            ])
        );
        $response
            ->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("Products/OrderShowLayout")
                    ->has(
                        "order",
                        fn(Assert $order) => $order
                            ->has("locations")
                            ->has("user")
                            ->has("products")
                            ->etc()
                    )
            );
    }

    #[Test]
    public function user_cannot_view_order_with_invalid_session_id()
    {
        // Mock a failed Stripe session retrieval
        $mockSession = Mockery::mock("alias:" . Session::class);
        $mockSession
            ->shouldReceive("retrieve")
            ->with("invalid_session_id")
            ->andReturnNull();

        $response = $this->actingAs($this->order->user)->get(
            route("orders.show", [
                "order" => $this->order->id,
                "session_id" => "invalid_session_id",
            ])
        );

        $response->assertStatus(404);
    }

    #[Test]
    public function user_can_view_past_orders()
    {
        $response = $this->actingAs($this->order->user)->get(
            route("orders.show", $this->order->id)
        );

        $response
            ->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("Products/OrderShowLayout")
                    ->has(
                        "order",
                        fn(Assert $order) => $order
                            ->has("locations")
                            ->has("user")
                            ->has("products")
                            ->etc()
                    )
            );
    }

    #[Test]
    public function unauthenticated_users_cannot_view_orders_without_session_id()
    {
        Auth::logout();
        $response = $this->get(route("orders.show", $this->order->id));

        $response->assertStatus(404);
    }

    #[Test]
    public function users_can_only_view_their_orders()
    {
        /** @var \App\Models\User $anotherUser */
        $anotherUser = User::factory()->create();
        $this->actingAs($anotherUser);
        $response = $this->get(route("orders.show", $this->order->id));

        $response->assertStatus(404);
    }

    protected function tearDown(): void
    {
        Mockery::close(); // Close Mockery after tests
        parent::tearDown();
    }
}
