<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Tags\Tag;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $customer = User::factory()->create([
            "first_name" => "Test",
            "last_name" => "User",
            "email" => "test@example.com",
            "password" => Hash::make("123456"),
            "mobile" => "455555555",
        ]);

        $customer->locations()->save(Location::factory()->create());

        $admin = User::factory()->create([
            "first_name" => "Jakey",
            "last_name" => "Admin",
            "email" => "j@j.com",
            "is_admin" => true,
            "password" => Hash::make("123456"),
            "mobile" => "455555565",
        ]);

        $admin->assignRole(Role::create(["name" => "admin"]));

        $this->call(ProductSeeder::class);
        $this->call(ProductOptionSeeder::class);
        $this->call(OrderSeeder::class);
        $this->call(ImageSeeder::class);

        $products = Product::all();

        $tags = [
            "mens" => Tag::findOrCreateFromString("mens"),
            "womens" => Tag::findOrCreateFromString("womens"),
            "kids" => Tag::findOrCreateFromString("kids"),
            "gear" => Tag::findOrCreateFromString("gear"),
        ];

        $typeTags = [
            "mens" => [
                "t-shirts" => Tag::findOrCreateFromString("t-shirts", 'tops'),
                "polos" => Tag::findOrCreateFromString("polos", 'tops'),
                "singlets" => Tag::findOrCreateFromString("singlets", 'tops'),
                "visors & hats" => Tag::findOrCreateFromString("visors & hats", 'hats'),
                "shorts" => Tag::findOrCreateFromString("shorts", 'bottoms'),
                "track pants" => Tag::findOrCreateFromString("track pants", 'bottoms'),
                "hoodies" => Tag::findOrCreateFromString("hoodies",'tops'),
                "button downs" => Tag::findOrCreateFromString("button downs",'tops'),
                "zips" => Tag::findOrCreateFromString("zips",'tops'),
            ],
            "womens" => [
                "dresses" => Tag::findOrCreateFromString("dresses",'bottoms'),
                "tank tops" => Tag::findOrCreateFromString("tank tops",'tops'),
                "leggings" => Tag::findOrCreateFromString("leggings",'bottoms'),
                "sleeveless" => Tag::findOrCreateFromString("sleeveless",'tops'),
                "visors & hats" => Tag::findOrCreateFromString("visors & hats",'hats'),
                "sun shirts" => Tag::findOrCreateFromString("sun shirts",'tops'),
                "skorts" => Tag::findOrCreateFromString("skorts",'bottoms'),
                "headbands" => Tag::findOrCreateFromString("headbands",'gear'),
                "sweat shirts" => Tag::findOrCreateFromString("sweat shirts",'tops'),
            ],
            "kids" => [
                "polos" => Tag::findOrCreateFromString("polos",'tops'),
                "t-shirts" => Tag::findOrCreateFromString("t-shirts",'tops'),
                "long-sleeve shirts" => Tag::findOrCreateFromString("long-sleeve shirts",'tops'),
                "shorts" => Tag::findOrCreateFromString("shorts",'bottoms'),
                "skorts" => Tag::findOrCreateFromString("skorts",'bottoms'),
                "track pants" => Tag::findOrCreateFromString("track pants",'bottoms'),
                "hoodies" => Tag::findOrCreateFromString("hoodies",'tops'),
                "jackets" => Tag::findOrCreateFromString("jackets",'tops'),
                "socks" => Tag::findOrCreateFromString("socks",'gear'),
                "sun hats" => Tag::findOrCreateFromString("sun hats",'hats'),
                "visors" => Tag::findOrCreateFromString("visors",'hats'),
                "headbands" => Tag::findOrCreateFromString("headbands",'gear'),
                "wristbands" => Tag::findOrCreateFromString("wristbands",'gear'),
            ],
            "gear" => [
                "sunglasses" => Tag::findOrCreateFromString("sunglasses",'gear'),
                "socks" => Tag::findOrCreateFromString("socks",'gear'),
                "headbands" => Tag::findOrCreateFromString("headbands",'gear'),
                "wristbands" => Tag::findOrCreateFromString("wristbands",'gear'),
                "headbands" => Tag::findOrCreateFromString("headbands",'gear'),
                "accessories" => Tag::findOrCreateFromString("accessories", 'gear'),
                "paddle coveres" => Tag::findOrCreateFromString("paddle coveres", 'gear'),
                "bags" => Tag::findOrCreateFromString("bags", 'gear'),
                "sleeves" => Tag::findOrCreateFromString("sleeves", 'gear'),
                "ankle braces" => Tag::findOrCreateFromString("ankle braces", 'gear'),
            
            ],
        ];

        
        foreach ($products as $product) {
            $randomTagKey = array_rand($tags);
            $randomCategoryTag = $tags[$randomTagKey];

            $randomTypeTagKey = array_rand($typeTags[$randomTagKey]);
            $randomTypeTag = $typeTags[$randomTagKey][$randomTypeTagKey];
            $product->attachTags([$randomCategoryTag, $randomTypeTag]);
        }
    }
}
