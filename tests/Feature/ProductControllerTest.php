<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Spatie\Tags\Tag;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase; 

    public Product $product; 

    protected function setUp(): void
    {
        parent::setUp();
        $this->product = Product::factory()->create();

    }

    #[Test]
    public function user_can_view_the_product_index_for_favourites()
    {

        $response = $this->get(route('products.index',['type' => 'favourites']));

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                ->component('Products/ProductIndexLayout')
                ->has('products', 0)
                ->where('category', 'favourites'));
    }

    #[Test]
    public function user_can_view_the_product_index_for_sales()
    {

        Product::factory()->create(['discount' => null]); 
        Product::factory()->create(['discount' => 10]); 
        $response = $this->get(route('products.index',['type' => 'sale']));

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                ->component('Products/ProductIndexLayout')
                ->has('products', 1)
                ->where('category', 'sale'));
    }

    #[Test]
    public function user_can_view_the_product_index_for_popular()
    {
        $response = $this->get(route('products.index', ['type' => 'popular']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/ProductIndexLayout')
            ->where('category', 'popular')
        );
    }

    #[Test]
    public function user_can_view_the_product_index_for_from_home()
    {
        $tag = Tag::findOrCreateFromString('t-shirt', 'tops'); 
        Product::factory()->hasAttached($tag, [], 'tags')->create();
        Product::factory()->create();

        $response = $this->get(route('products.index', [
            'type' => $tag->type,
        ])."?tag=true");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/ProductIndexLayout')
            ->has('products', 1)
            ->where('category', $tag->type)
        );
    }

    #[Test]
    public function user_can_view_the_product_index_with_category_and_type()
    {
        $categoryTag = Tag::findOrCreateFromString('t-shirt', 'tops');
        $typeTag = Tag::findOrCreateFromString('mens', 'category');

        Product::factory()->hasAttached($categoryTag, [], 'tags')->hasAttached($typeTag, [], 'tags')->create();
        Product::factory()->create();

        $response = $this->get(route('products.index', [
            'type' => $categoryTag->name,
        ]).'?type='.$typeTag->name);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/ProductIndexLayout')
            ->has('products', 1)
            ->where('category', $categoryTag->name)
            ->where('type', $typeTag->name)
        );
    }

    #[Test]
    public function user_can_view_the_product_index_with_category()
    {
        $categoryTag = Tag::findOrCreateFromString('t-shirt', 'tops');
        Product::factory()->hasAttached($categoryTag, [], 'tags')->create();
        Product::factory()->create();

        $response = $this->get(route('products.index', [
            'type' => $categoryTag->name,
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/ProductIndexLayout')
            ->has('products', 1)
            ->where('category', $categoryTag->name)
        );
    }

}
