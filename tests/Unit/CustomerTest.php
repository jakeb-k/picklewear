<?php

namespace Tests\Unit;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase; 

    public Customer $customer;

    public $orders;

    public Location $location;

    protected function setUp(): void
    {
        parent::setUp(); // Always call the parent setUp method
        $this->customer = Customer::factory()->create();
        $this->orders = Order::factory(3)->create([
            'customer_id' => $this->customer->id
        ]);
        $this->location = Location::factory()->create();
        $this->customer->locations()->attach($this->location->id); 
    }

    #[Test]
    public function a_customer_can_have_many_orders():void
    {
        $customerOrders = $this->customer->orders; 
        $this->assertCount(3, $customerOrders); 

        foreach($customerOrders as $index => $order){
            $this->assertEquals($order->id, $this->orders[$index]->id); 
        }
    }

    #[Test]
    public function a_customer_can_have_locations():void
    {
        $this->assertEquals($this->location->id, $this->customer->locations()->first()->id); 
    }
}
