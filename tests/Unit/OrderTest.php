<?php

namespace Tests\Unit;

use App\Models\Customer;
use App\Models\Image;
use App\Models\Location;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class OrderTest extends TestCase
{
    public Order $order;

    public Location $location;

    public object $images;

    public User $user;

    public object $products;

    public Customer $customer;

    protected function setUp(): void
    {
        parent::setUp(); // Always call the parent setUp method

        $this->user = User::factory()->create();
        $this->customer = Customer::factory()->create();
        $this->location = Location::factory()->create(); 
        $this->products = Product::factory(3)->create();
        $this->images = Image::factory(3)->create(); 

        $this->order = Order::factory()->create([
            'user_id' => $this->user->id, 
            'customer_id' => $this->customer->id, 
        ]);

        $this->order->locations()->attach($this->location);
        $this->order->images()->saveMany($this->images);
        $this->order->products()->attach(
            $this->products->pluck('id')->toArray(), // Get product IDs
            [
                'quantity' => 3,
                'color' => 'red',
                'size' => 'L',
            ]
        );
    }

    #[Test]
    public function an_order_can_have_a_location():void
    {
        $this->assertEquals($this->location->id, $this->order->locations()->first()->id);
    }

    #[Test]
    public function an_order_can_have_multiple_images():void
    {   
        $images = $this->order->images; 
        $this->assertCount(3, $images);

        foreach($images as $index => $image){
            $this->assertEquals($this->images[$index]->id, $image->id);
        }
    }

    #[Test]
    public function an_order_can_have_multiple_products():void
    {
        $orderProducts = $this->order->products;

        $this->assertCount(3, $orderProducts);

        foreach($orderProducts as $index => $product){
            $this->assertEquals($this->products[$index]->id, $product->id);
        }
    }

    #[Test]
    public function an_order_can_have_a_user():void
    {
        $this->assertEquals($this->user->id, $this->order->user->id); 
    }

    #[Test]
    public function an_order_must_have_a_customer():void
    {
        $this->assertEquals($this->customer->id, $this->order->customer->id); 
    }
}
