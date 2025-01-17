<?php

namespace Tests\Unit;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ImageTest extends TestCase
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
}
