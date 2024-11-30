<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class OrderProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id, 
            'quantity'=> $this->faker->numberBetween(1,4),
            'size'=> $this->faker->randomElement(['XS','S','M','L','XL','2XL']),
            'color'=> $this->faker->colorName(), 
            'order_id'=> Order::inRandomOrder()->first()->id
        ];
    }
}
