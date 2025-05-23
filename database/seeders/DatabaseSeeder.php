<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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

        // $customer = User::create([
        //     "first_name" => "Test",
        //     "last_name" => "User",
        //     "email" => "test@example.com",
        //     "password" => Hash::make("123456"),
        //     "mobile" => "455555555",
        // ]);

        $admin = User::create([
            "first_name" => "Jakey",
            "last_name" => "Admin",
            "email" => "j@j.com",
            "is_admin" => true,
            "password" => Hash::make("123456"),
            "mobile" => "455555565",
        ]);

        $admin->assignRole(Role::create(["name" => "admin"]));

        // $this->call(ProductSeeder::class);
        // $this->call(ProductOptionSeeder::class);
        // $this->call(OrderSeeder::class);
        // $this->call(ImageSeeder::class);

        // $products = Product::all();

        $tags = [
            "mens" => Tag::findOrCreateFromString("mens", 'category'),
            "womens" => Tag::findOrCreateFromString("womens", 'category'),
            "accessories" => Tag::findOrCreateFromString("accessories", 'category'),
            "gear" => Tag::findOrCreateFromString("gear", 'category'),
        ];

        $typeTags = [
            "mens" => [
                "t-shirts" => Tag::findOrCreateFromString("t-shirts", 'tops'),
                "singlets" => Tag::findOrCreateFromString("singlets", 'tops'),
                "visors & hats" => Tag::findOrCreateFromString("visors & hats", 'hats'),
                "shorts" => Tag::findOrCreateFromString("shorts", 'bottoms'),
                "hoodies" => Tag::findOrCreateFromString("hoodies", 'tops'),
            ],
            "womens" => [
                "t-shirts" => Tag::findOrCreateFromString("t-shirts", 'tops'),
                "singlets" => Tag::findOrCreateFromString("singlets", 'tops'),
                "leggings" => Tag::findOrCreateFromString("leggings", 'bottoms'),
                "visors & hats" => Tag::findOrCreateFromString("visors & hats", 'hats'),
                "skorts" => Tag::findOrCreateFromString("skorts", 'bottoms'),
            ],
            "accessories" => [
                "sunglasses" => Tag::findOrCreateFromString("sunglasses", 'accessories'),
                "socks" => Tag::findOrCreateFromString("socks", 'accessories'),
                "headbands" => Tag::findOrCreateFromString("headbands", 'accessories'),
                "wristbands" => Tag::findOrCreateFromString("wristbands", 'accessories'),
                "hats" => Tag::findOrCreateFromString("hats", 'hats'),
                "visors" => Tag::findOrCreateFromString("visors", 'hats'),
            ],
            "gear" => [
                "balls" => Tag::findOrCreateFromString("balls", 'gear'),
                "bags" => Tag::findOrCreateFromString("bags", 'gear'),
                "bottles" => Tag::findOrCreateFromString("bottles", 'gear'),
                "courts" => Tag::findOrCreateFromString("courts", 'gear'),
                "covers" => Tag::findOrCreateFromString("covers", 'gear'),
            ],
        ];

        
        // foreach ($products as $product) {
        //     $randomTagKey = array_rand($tags);
        //     $randomCategoryTag = $tags[$randomTagKey];

        //     $randomTypeTagKey = array_rand($typeTags[$randomTagKey]);
        //     $randomTypeTag = $typeTags[$randomTagKey][$randomTypeTagKey];
        //     $product->attachTags([$randomCategoryTag, $randomTypeTag]);
        // }
        $token = env('ZOHO_REFRESH_TOKEN');

        DB::insert('INSERT INTO zoho_oauth_tokens (refresh_token) VALUES (?)', [$token]);
    }
}
