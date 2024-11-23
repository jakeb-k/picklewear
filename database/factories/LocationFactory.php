<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'street'=> $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state'=> $this->faker->randomElement(['QLD', 'NSW', 'VIC', 'TAS', 'SA', 'WA', 'ACT', 'NT']),
            'postcode' => $this->faker->randomNumber(4, true),
            'country'=> 'Australia', 
        ];
    }
}
