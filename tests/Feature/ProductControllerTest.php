<?php

namespace Tests\Feature;

use App\Models\Image;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductOption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Permission\Models\Role;
use Spatie\Tags\Tag;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public Product $product;
    public User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->user->assignRole(Role::create(["name" => "admin"]));
        $this->actingAs($this->user);
        $this->product = Product::factory()->create();
    }

    #[Test]
    public function user_can_view_the_product_index_for_favourites()
    {
        $response = $this->get(
            route("products.index", ["type" => "favourites"])
        );

        $response
            ->assertStatus(200)
            ->assertInertia(
                fn($page) => $page
                    ->component("Products/ProductIndexLayout")
                    ->has("products", 0)
                    ->where("category", "favourites")
            );
    }

    #[Test]
    public function user_can_view_the_product_index_for_sales()
    {
        Product::factory()->create(["discount" => null]);
        Product::factory()->create(["discount" => 10]);
        $response = $this->get(route("products.index", ["type" => "sale"]));

        $response
            ->assertStatus(200)
            ->assertInertia(
                fn($page) => $page
                    ->component("Products/ProductIndexLayout")
                    ->has("products", 1)
                    ->where("category", "sale")
            );
    }

    #[Test]
    public function user_can_view_the_product_index_for_popular()
    {
        $response = $this->get(route("products.index", ["type" => "popular"]));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Products/ProductIndexLayout")
                ->where("category", "popular")
        );
    }

    #[Test]
    public function user_can_view_the_product_index_for_from_home()
    {
        $tag = Tag::findOrCreateFromString("t-shirt", "tops");
        Product::factory()->hasAttached($tag, [], "tags")->create();
        Product::factory()->create();

        $response = $this->get(
            route("products.index", [
                "type" => $tag->type,
            ]) . "?tag=true"
        );

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Products/ProductIndexLayout")
                ->has("products", 1)
                ->where("category", $tag->type)
        );
    }

    #[Test]
    public function user_can_view_the_product_index_with_category_and_type()
    {
        $categoryTag = Tag::findOrCreateFromString("t-shirt", "tops");
        $typeTag = Tag::findOrCreateFromString("mens", "category");

        Product::factory()
            ->hasAttached($categoryTag, [], "tags")
            ->hasAttached($typeTag, [], "tags")
            ->create();
        Product::factory()->create();

        $response = $this->get(
            route("products.index", [
                "type" => $categoryTag->name,
            ]) .
                "?type=" .
                $typeTag->name
        );

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Products/ProductIndexLayout")
                ->has("products", 1)
                ->where("category", $categoryTag->name)
                ->where("type", $typeTag->name)
        );
    }

    #[Test]
    public function user_can_view_the_product_index_with_category()
    {
        $categoryTag = Tag::findOrCreateFromString("t-shirt", "tops");
        Product::factory()->hasAttached($categoryTag, [], "tags")->create();
        Product::factory()->create();

        $response = $this->get(
            route("products.index", [
                "type" => $categoryTag->name,
            ])
        );

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Products/ProductIndexLayout")
                ->has("products", 1)
                ->where("category", $categoryTag->name)
        );
    }

    #[Test]
    public function user_can_view_product_show_page()
    {
        $response = $this->get(route("products.show", $this->product));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component("Products/ProductShowLayout")
                ->where("product.id", $this->product->id)
        );
    }

    #[Test]
    public function user_can_store_a_product()
    {
        $this->actingAs($this->user);
        $images = [
            UploadedFile::fake()->image("image1.jpg"),
            UploadedFile::fake()->image("image2.png"),
            UploadedFile::fake()->image("image3.png"),
        ];

        $response = $this->post(route("product.store"), [
            "name" => "New Product",
            "type" => "womens",
            "url" => "https://google.com",
            "delivery_date" => "13",
            "price" => 20.0,
            "discount" => 20,
            "description" => "This is a description",
            "images" => $images,
        ]);

        // dd($response->json());
        $response
            ->assertStatus(200)
            ->assertJsonStructure(["success", "products"]);

        $this->assertDatabaseHas("products", [
            "name" => "New Product",
            "type" => "Womens",
            "url" => "https://google.com",
            "delivery_date" => 13,
            "price" => 20.0,
            "discount" => 0.2,
            "description" => "This is a description",
        ]);
    }

    #[Test]
    public function user_can_update_a_product()
    {
        $this->actingAs($this->user);
        $images = [
            UploadedFile::fake()->image("image1.jpg"),
            UploadedFile::fake()->image("image2.png"),
            UploadedFile::fake()->image("image3.png"),
        ];

        $product = Product::factory()->create();
        $colorOption = ProductOption::factory()->create([
            "type" => "color",
            "product_id" => $product->id,
        ]);

        $response = $this->putJson(route("product.update", $product), [
            "name" => "Updated Product",
            "type" => "womens",
            "url" => "https://google.com",
            "delivery_date" => "13",
            "price" => 20.0,
            "discount" => 20,
            "description" => "This is an updated description",
            "images" => $images,
            "colors" => "red,blue,green",
            "colorOptionId" => $colorOption->id,
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure(["success", "products"]);

        $this->assertDatabaseHas("products", [
            "name" => "Updated Product",
            "type" => "Womens",
            "url" => "https://google.com",
            "delivery_date" => 13,
            "price" => 20.0,
            "discount" => 0.2,
            "description" => "This is an updated description",
        ]);

        $this->assertDatabaseHas("product_options", [
            "id" => $colorOption->id,
            "type" => "color",
            "values" => "red.blue.green",
        ]);
    }

    #[Test]
    public function user_can_get_bestsellers()
    {
        $products = Product::factory(12)
            ->create()
            ->each(function ($product, $index) {
                $orders = Order::factory($index)->create();
                $image = Image::factory()->create();

                $product->images()->attach($image->id);

                foreach ($orders as $order) {
                    $product->orders()->attach($order->id, [
                        "quantity" => rand(1, 10),
                    ]);
                }
            });

        $response = $this->get(route("home.bestsellers"));
        $response->assertStatus(200)->assertJsonCount(10, "bestsellers");
    }

    #[Test]
    public function user_can_search_products()
    {
        $products = Product::factory(5)
            ->create()
            ->each(function ($product, $index) {
                if ($index > 2) {
                    $product->type = "womens";
                    $product->save();
                } else {
                    $product->type = "mens";
                }
            });

        $response = $this->get(route("products.search", "womens"));

        $response->assertStatus(200)->assertJsonCount(2, "products");
    }

    #[Test]
    public function admin_can_set_availability()
    {
        $product = Product::factory()->create([
            "available" => false,
        ]);

        $response = $this->postJson(route("product.available", $product));

        $response->assertStatus(200)->assertJson([
            "products" => [],
        ]);

        $this->assertDatabaseHas("products", [
            "id" => $product->id,
            "available" => true,
        ]);
    }

    #[Test] 
    public function admin_can_delete_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson(route('product.destroy', $product));

        $response->assertStatus(200)
        ->assertJson([
            'products' => []
        ]);

        $this->assertSoftDeleted('products', [
            'id' => $product->id
        ]); 
    }
}
