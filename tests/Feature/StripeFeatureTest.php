<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Mockery;

class StripeFeatureTest extends TestCase
{
    use RefreshDatabase;

    public User $user;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->user->locations()->attach(Location::factory()->create()->id);
        $this->actingAs($this->user);
    }

    #[Test]
    public function user_can_navigate_to_checkout_page()
    {
        $location = Location::factory()->create();
        $this->user->locations()->attach($location);

        $response = $this->get(route("checkout.show"));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Checkout")
                ->where("locations", $this->user->locations->toArray())
        );
    }

    #[Test]
    public function user_must_have_valid_checkout_details()
    {
        $response = $this->postJson(route("checkout.store"), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            "cart",
            "first_name",
            "last_name",
            "street",
            "city",
            "state",
            "postcode",
            "mobile",
        ]);
    }

    #[Test]
    public function user_can_successfully_checkout_to_stripe()
    {
        Mockery::mock("overload:Stripe\Customer")
            ->shouldReceive("create")
            ->once()
            ->andReturn(
                (object) [
                    "id" => "mock_customer_id",
                    "email" => "mock@example.com",
                    "name" => "John Doe",
                    "phone" => "412345678",
                    "address" => (object) [
                        "line1" => "123 Test St",
                    ],
                ]
            );

        Mockery::mock("overload:Stripe\Checkout\Session")
            ->shouldReceive("create")
            ->once()
            ->andReturn(
                (object) [
                    "id" => "mock_session_id",
                    "url" => "https://stripe-mock-url.com",
                ]
            );
        $this->actingAs($this->user);

        $cart = [
            [
                "id" => Product::factory()->create()->id,
                "name" => "Test Product",
                "price" => 100,
                "quantity" => 1,
                "size" => "M",
                "delivery_date" => "14",
                "color" => "Blue",
                "description" => "Test description",
                "image" => ["file_path" => "image.jpg"],
            ],
        ];

        $payload = [
            "cart" => $cart,
            "first_name" => "John",
            "last_name" => "Doe",
            "street" => "123 Test St",
            "city" => "Test City",
            "state" => "NSW",
            "postcode" => "2000",
            "mobile" => "412345678",
            "total" => 100,
        ];

        $response = $this->postJson(route("checkout.store"), $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure(["url"]);

        $this->assertDatabaseHas("customers", [
            "first_name" => "John",
            "last_name" => "Doe",
            "mobile" => "412345678",
        ]);

        $this->assertDatabaseHas("orders", [
            "status" => "Unpaid",
            "total" => 100,
        ]);
    }

    #[Test]
    public function non_user_can_successfully_checkout_to_stripe()
    {
        Mockery::mock("overload:Stripe\Customer")
            ->shouldReceive("create")
            ->once()
            ->andReturn(
                (object) [
                    "id" => "mock_customer_id",
                    "email" => "mock@example.com",
                    "name" => "John Doe",
                    "phone" => "412345678",
                    "address" => (object) [
                        "line1" => "123 Test St",
                    ],
                ]
            );

        Mockery::mock("overload:Stripe\Checkout\Session")
            ->shouldReceive("create")
            ->once()
            ->andReturn(
                (object) [
                    "id" => "mock_session_id",
                    "url" => "https://stripe-mock-url.com",
                ]
            );
        Auth::logout();

        $cart = [
            [
                "id" => Product::factory()->create()->id,
                "name" => "Test Product",
                "price" => 100,
                "quantity" => 1,
                "size" => "M",
                "delivery_date" => "14",
                "color" => "Blue",
                "description" => "Test description",
                "image" => ["file_path" => "image.jpg"],
            ],
        ];

        $payload = [
            "cart" => $cart,
            "first_name" => "John",
            "last_name" => "Doe",
            "street" => "123 Test St",
            "city" => "Test City",
            "state" => "NSW",
            "postcode" => "2000",
            "mobile" => "412345678",
            "total" => 100,
        ];

        $response = $this->postJson(route("checkout.store"), $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure(["url"]);

        $this->assertDatabaseHas("customers", [
            "first_name" => "John",
            "last_name" => "Doe",
            "mobile" => "412345678",
        ]);

        $this->assertDatabaseHas("orders", [
            "status" => "Unpaid",
            "total" => 100,
        ]);
    }

    #[Test]
    public function user_can_view_order_on_success()
    {
        // Mock the Stripe Checkout Session
        Mockery::mock("overload:Stripe\Checkout\Session")
            ->shouldReceive("retrieve")
            ->with("mock_session_id")
            ->andReturn(
                (object) [
                    "id" => "mock_session_id",
                    "customer_details" => (object) [
                        "email" => "customer@example.com",
                    ],
                ]
            );
        $newCustomer = Customer::create([
            "email" => $this->user->email ?? null,
            "stripe_id" => "mock_session_id",
            "first_name" => $this->user->first_name,
            "last_name" => $this->user->last_name,
            "mobile" => $this->user->mobile,
            "address" => "123 Test St Brisbane, QLD, 4000",
        ]);

        $order = Order::factory()->create([
            "session_id" => "mock_session_id",
            "status" => "Unpaid",
            "customer_id" => $newCustomer->id,
        ]);

        $response = $this->get(
            route("success") . "?session_id=" . $order->session_id
        );

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Products/OrderShowLayout")
                ->has("order")
        );

        $this->assertDatabaseHas("orders", [
            "session_id" => "mock_session_id",
            "status" => "Paid",
        ]);
    }

    #[Test]
    public function user_can_only_view_order_on_success_with_valid_session_id()
    {
        // Mock the Stripe Checkout Session
        Mockery::mock("overload:Stripe\Checkout\Session")
            ->shouldReceive("retrieve")
            ->with("mock_session_id")
            ->andReturn(
                (object) [
                    "id" => "mock_session_id",
                    "customer_details" => (object) [
                        "email" => "customer@example.com",
                    ],
                ]
            );
        $newCustomer = Customer::create([
            "email" => $this->user->email ?? null,
            "stripe_id" => "123456",
            "first_name" => $this->user->first_name,
            "last_name" => $this->user->last_name,
            "mobile" => $this->user->mobile,
            "address" => "123 Test St Brisbane, QLD, 4000",
        ]);

        $order = Order::factory()->create([
            "session_id" => "123456",
            "status" => "Unpaid",
            "customer_id" => $newCustomer->id,
        ]);

        $response = $this->get(
            route("success") . "?session_id=" . $order->session_id
        );

        $response->assertStatus(404);

        $this->assertDatabaseMissing("orders", [
            "session_id" => "123456",
            "status" => "Paid",
        ]);
    }

    // #[Test]
    // public function user_can_only_view_order_after_webhook()
    // {
    //     $this->withoutExceptionHandling();

    //     $sessionId = 'test_session_id';

    //     $order = Order::factory()->create(['session_id' => $sessionId, 'status' => 'Unpaid']);

    //     $payload = json_encode([
    //         'type' => 'checkout.session.completed',
    //         'data' => [
    //             'object' => [
    //                 'id' => $sessionId,
    //                 'customer_details' => [
    //                     'email' => 'test@example.com'
    //                 ]
    //             ]
    //         ]
    //     ]);

    //     $signature = 'test_signature'; // Simulate a valid signature if needed

    //     $response = $this->postJson(route('webhook'), [], [
    //         'HTTP_STRIPE_SIGNATURE' => $signature
    //     ]);

    //     $response->assertStatus(200);

    //     $this->assertDatabaseHas('orders', [
    //         'session_id' => $sessionId,
    //         'status' => 'Paid'
    //     ]);

    //     $this->assertDatabaseHas('customers', [
    //         'email' => 'test@example.com'
    //     ]);
    // }
    protected function tearDown(): void
    {
        Mockery::close(); // Close Mockery after tests
        parent::tearDown();
    }
}
