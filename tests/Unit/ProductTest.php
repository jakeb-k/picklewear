<?php

namespace Tests\Unit;

use App\Models\Customer;
use Tests\TestCase;
use App\Models\Product;
use App\Models\Image;
use App\Models\Order;
use App\Models\ProductOption;
use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;

use PHPUnit\Framework\Attributes\Test;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function a_product_can_have_many_images()
    {
        $product = Product::factory()->create();
        $images = Image::factory()->count(3)->create();

        $product->images()->attach($images);

        $this->assertCount(3, $product->images);
        $this->assertInstanceOf(Image::class, $product->images->first());
    }

    #[Test]
    public function a_product_can_have_many_orders()
    {
        $product = Product::factory()->create();
        $orders = Order::factory()->count(2)->create([
            'customer_id' => Customer::factory()->create(),
        ]);

        foreach ($orders as $order) {
            $product->orders()->attach($order, ['quantity' => 5]);
        }

        $this->assertCount(2, $product->orders);
        $this->assertInstanceOf(Order::class, $product->orders->first());
        $this->assertEquals(5, $product->orders->first()->pivot->quantity);
    }

    #[Test]
    public function a_product_can_have_many_options()
    {
        $product = Product::factory()->create();
        $options = ProductOption::factory()->count(2)->create(['product_id' => $product->id]);

        $this->assertCount(2, $product->options);
        $this->assertInstanceOf(ProductOption::class, $product->options->first());
    }

}
