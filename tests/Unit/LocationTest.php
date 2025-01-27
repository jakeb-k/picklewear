<?php

namespace Tests\Unit;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Order;
use App\Models\User;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class LocationTest extends TestCase
{
    public Location $location; 

    public Order $order; 

    public Customer $customer;

    public User $user; 

    protected function setUp(): void
    {
        parent::setUp(); // Always call the parent setUp method
        $this->location = Location::factory()->create();

        $this->order = Order::factory()->create();
        $this->order->locations()->attach($this->location);

        $this->customer = Customer::factory()->create();
        $this->customer->locations()->attach($this->location);

        
        $this->user = User::factory()->create();
        $this->user->locations()->attach($this->location);
    }

    #[Test]
    public function a_location_can_be_morphed_by_an_order():void
    {
        $this->assertEquals($this->order->id, $this->location->order()->first()->id);
    }

    #[Test]
    public function a_location_can_be_morphed_by_a_customer():void
    {
        $this->assertEquals($this->customer->id, $this->location->customer()->first()->id);
    }

    #[Test]
    public function a_location_can_be_morphed_by_a_user():void
    {
        $this->assertEquals($this->user->id, $this->location->user()->first()->id);
    }
}
