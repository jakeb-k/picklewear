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
                "t-shirts" => Tag::findOrCreateFromString("t-shirts"),
                "polos" => Tag::findOrCreateFromString("polos"),
                "singlets" => Tag::findOrCreateFromString("singlets"),
                "visors & hats" => Tag::findOrCreateFromString("visors & hats"),
                "shorts" => Tag::findOrCreateFromString("shorts"),
                "track pants" => Tag::findOrCreateFromString("track pants"),
                "hoodies" => Tag::findOrCreateFromString("hoodies"),
                "button downs" => Tag::findOrCreateFromString("button downs"),
                "zips" => Tag::findOrCreateFromString("zips"),
            ],
            "womens" => [
                "dresses" => Tag::findOrCreateFromString("dresses"),
                "tank tops" => Tag::findOrCreateFromString("tank tops"),
                "leggings" => Tag::findOrCreateFromString("leggings"),
                "sleeveless" => Tag::findOrCreateFromString("sleeveless"),
                "visors & hats" => Tag::findOrCreateFromString("visors & hats"),
                "sun shirts" => Tag::findOrCreateFromString("sun shirts"),
                "skorts" => Tag::findOrCreateFromString("skorts"),
                "headbands" => Tag::findOrCreateFromString("headbands"),
                "sweat shirts" => Tag::findOrCreateFromString("sweat shirts"),
            ],
            "kids" => [
                "polos" => Tag::findOrCreateFromString("polos"),
                "t-shirts" => Tag::findOrCreateFromString("t-shirts"),
                "long-sleeve shirts" => Tag::findOrCreateFromString("long-sleeve shirts"),
                "shorts" => Tag::findOrCreateFromString("shorts"),
                "skorts" => Tag::findOrCreateFromString("skorts"),
                "leggings" => Tag::findOrCreateFromString("leggings"),
                "track pants" => Tag::findOrCreateFromString("track pants"),
                "hoodies" => Tag::findOrCreateFromString("hoodies"),
                "jackets" => Tag::findOrCreateFromString("jackets"),
                "socks" => Tag::findOrCreateFromString("socks"),
                "sun hats" => Tag::findOrCreateFromString("sun hats"),
                "visors" => Tag::findOrCreateFromString("visors"),
                "headbands" => Tag::findOrCreateFromString("headbands"),
                "wristbands" => Tag::findOrCreateFromString("wristbands"),
            ],
            "gear" => [
                "t-shirts" => Tag::findOrCreateFromString("t-shirts"),
                "polos" => Tag::findOrCreateFromString("polos"),
                "singlets" => Tag::findOrCreateFromString("singlets"),
                "hats" => Tag::findOrCreateFromString("hats"),
                "sunglasses" => Tag::findOrCreateFromString("sunglasses"),
                "shorts" => Tag::findOrCreateFromString("shorts"),
                "socks" => Tag::findOrCreateFromString("socks"),
                "hoodies" => Tag::findOrCreateFromString("hoodies"),
                "accessories" => Tag::findOrCreateFromString("accessories"),
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
