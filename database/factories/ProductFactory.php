<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'url' => $this->faker->url(),
            'type' => $this->faker->randomElement(['type1', 'type2', 'type3']),
            'delivery_date' => $this->faker->numberBetween(1, 30), // Example: days
            'price' => $this->faker->randomFloat(2, 10, 1000), // 2 decimal places, range 10-1000
            'discount' => $this->faker->optional()->randomFloat(2, 1, 100), // Nullable discount
            'sku' => $this->faker->optional()->uuid(), // Nullable unique SKU
            'description' => $this->faker->optional()->sentence(),
            'available' => $this->faker->boolean(),
        ];
        
    }
}
