<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'file_name' => $this->faker->unique()->text() . '.' . $this->faker->fileExtension(),
            'file_path' => $this->faker->filePath(),
            'file_size' => $this->faker->numberBetween(1024, 5242880), // Size in bytes (1KB to 5MB)
            'mime_type' => $this->faker->randomElement(['image/jpeg', 'image/png', 'image/gif']),
            'width' => $this->faker->optional()->numberBetween(100, 1920), // Optional width
            'height' => $this->faker->optional()->numberBetween(100, 1080), // Optional height
            'alt_text' => $this->faker->optional()->sentence(),
            'caption' => $this->faker->optional()->paragraph(),
        ];
    }
}
