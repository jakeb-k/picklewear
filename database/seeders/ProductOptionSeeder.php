<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ProductOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_options')->insert(['type'=>'cover','values'=>'On.Off','product_id'=>1]);
        DB::table('product_options')->insert(['type'=>'size','values'=>'M.L','product_id'=>12]);
        DB::table('product_options')->insert(['type'=>'cover','values'=>'On.Off','product_id'=>3]);
        DB::table('product_options')->insert(['type'=>'cover','values'=>'On.Off','product_id'=>4]);
        DB::table('product_options')->insert(['type'=>'cover','values'=>'On.Off','product_id'=>5]);
        DB::table('product_options')->insert(['type'=>'size','values'=>'M.L.XL','product_id'=>13]);
        DB::table('product_options')->insert(['type'=>'cover','values'=>'On.Off','product_id'=>7]);
        DB::table('product_options')->insert(['type'=>'cover','values'=>'On.Off','product_id'=>8]);
        DB::table('product_options')->insert(['type'=>'size','values'=>'M.L ','product_id'=>14]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'blue.white.black.yellow.pink','product_id'=>10]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'white.black.green.darkblue.purple','product_id'=>11]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'pink.green.black','product_id'=>12]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'black.green.khaki.camo','product_id'=>13]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'green.brown.black','product_id'=>14]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'red.orange.lightblue.yellow.white.darkblue','product_id'=>15]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'red.yellow.orange','product_id'=>19]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'blue.white.pink.yellow','product_id'=>21]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'yellow.orange','product_id'=>25]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'darkblue.black.red.gray.blue.brown.darkgray','product_id'=>30]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'black.darkblue.gray.red','product_id'=>31]);
        DB::table('product_options')->insert(['type'=>'size','values'=>'XS.S.M.L.XL.XL','product_id'=>34]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'darkgray.black.navy.red.lightgray.deepskyblue.brown','product_id'=>33]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'black.khaki.navy.pink.gray.purple.deepskyblue.white','product_id'=>34]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'black.deepskyblue.blue.green.navy.khaki.lightgray.gray.purple','product_id'=>35]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'black.white.gray.red.blue.navy','product_id'=>36]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'black.white.gray.red.blue.navy','product_id'=>37]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'white.black.blue.deepskyblue.gray.darkgreen.khaki.pink.purple.red.yellow.navy.lightgray','product_id'=>38]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'white.gray.red.purple.blue.darkred.navy.black','product_id'=>39]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'navy.black.gray.red.purple.deepskyblue.darkred.white','product_id'=>40]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'darkgray.black.blue.deepskyblue.brown.gray.lightgray.olivedrab.khaki.orange.pink.purple.red','product_id'=>41]);
        DB::table('product_options')->insert(['type'=>'color','values'=>'white.green.red.purple.blue.darkred.navy.black','product_id'=>42]);

    }
}
