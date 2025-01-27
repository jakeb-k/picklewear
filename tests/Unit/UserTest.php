<?php

namespace Tests\Unit;

use App\Models\Location;
use App\Models\Order;
use App\Models\User;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class UserTest extends TestCase
{
   #[Test]
    public function it_can_get_the_combined_name_attribute()
    {
        $user = User::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $this->assertEquals('John Doe', $user->name);
    }

   #[Test]
    public function a_user_can_have_many_orders()
    {
        $user = User::factory()->create();
        $orders = Order::factory()->count(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->orders);
        $this->assertInstanceOf(Order::class, $user->orders->first());
    }

   #[Test]
    public function a_user_can_have_many_locations()
    {
        $user = User::factory()->create();
        $locations = Location::factory()->count(2)->create();

        $user->locations()->attach($locations);

        $this->assertCount(2, $user->locations);
        $this->assertInstanceOf(Location::class, $user->locations->first());
    }
}
