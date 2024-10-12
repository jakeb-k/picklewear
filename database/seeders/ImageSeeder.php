<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bestsellers = [36,37,34,38,39,40,41,42,35,32];

        foreach($bestsellers as $product){
            $product = Product::find($product); 
                for($i = 1; $i < 4; $i++){
                    $image = Image::create([
                        'file_name'=> $product->name.'_image_1',
                        'file_path' => 'https://aussiepicklepro.com.au/storage/images/'.$product->id.'_'.$i.'.webp',
                        'file_size'=> 100,
                        'mime_type'=> '.webp',
                    ]);
                    $product->images()->save($image); 
                }
        }
    }
}
