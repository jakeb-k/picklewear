<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;


class OrderSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     $faker = Faker::create(); 
        for($i=0; $i <= 5; $i++){
            $order = Order::factory()->create([
                'user_id' => 1
            ]); 
            $location = Location::factory()->create(); 

            $order->locations()->save($location);

            $randomCount = $faker->numberBetween(1, 5);
            $order_items = OrderProduct::factory()->count($randomCount)->create([
                'order_id'=> $order->id,
            ]);
        }

    }
}
