<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'total'=> $this->faker->randomFloat(5,40, 100),
            'code' => $this->faker->bothify('ORD-#####'),
            'status' => $this->faker->randomElement(['New', 'Enroute', 'Delivered', 'Lost', 'Cancelled', 'Faulty', 'Refunded']),
            'expected_delivery_range' => mt_rand(10,20),
            'customer_id' => Customer::count() < 3 ? Customer::factory()->create()->id : Customer::inRandomOrder()->first()->id
        ];
    }
}
