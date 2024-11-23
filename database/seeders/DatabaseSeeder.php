<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'mobile' => '0455555555',
        ]);

        User::factory()->create([
            'name' => 'Jakey',
            'email' => 'j@j.com',
            'is_admin'=>true,
            'password'=>'123456',
            'mobile' => '0455555565', 
        ]);

        $this->call(ProductSeeder::class);
        $this->call(ProductOptionSeeder::class);
        $this->call(OrderSeeder::class); 
        $this->call(ImageSeeder::class); 


    }
}
