<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => Hash::make('123456'), 
            'mobile' => '0455555555',
        ]);

        $admin = User::factory()->create([
            'first_name' => 'Jakey',
            'last_name' => 'Admin',
            'email' => 'j@j.com',
            'is_admin'=>true,
            'password'=> Hash::make('123456'), 
            'mobile' => '0455555565', 
        ]);

        $admin->assignRole(Role::create(['name'=> 'admin'])); 


        $this->call(ProductSeeder::class);
        $this->call(ProductOptionSeeder::class);
        $this->call(OrderSeeder::class); 
        $this->call(ImageSeeder::class); 


    }
}
