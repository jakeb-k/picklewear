<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{

    /**
     * Shows a group of products with a particular type
     *
     * @param String $type
     * @return \Inertia\Response The Inertia response for the client-side renderer.
     */
    public function index(String $type)
    {
        $products = Product::where('type', $type)->get(); 

        return Inertia::render('Products/ProductIndexLayout', [
            'products' => $products, 
        ]); 
    }

    /**
     * Shows a singular product
     *
     * @param Product $product
     * @return \Inertia\Response The Inertia response for the client-side renderer.
     */
    public function show(Product $product)
    {
        $related_items = Product::where('type', $product->type)->whereHas('images')->limit(6)->get();
        return Inertia::render('Products/ProductShowLayout', [
            'product' => $product->load(['options', 'images']),
            'relatedItems' => $related_items->load(['images']), 
        ]); 
        
    }

    /**
     * Get the bestsellers of the store to display on the home page
     *
     * @return void
     */
    public function getBestsellers() {
        $bestsellers = Product::where('type', 'Clothing')->orderBy('price', 'DESC')->limit(10)->get();
        $bestsellers->each(function($product) {
            if ($product->images()->exists()) {
                $product->load('images');
            }
        });
        return response()->json([
            'bestsellers' => $bestsellers  
        ]);
    }

    public function search(String $query)
    {
        $products = Product::where('name', 'like', '%'.$query.'%')->orWhere('type', 'like', '%'.$query.'%')->get();
        return response()->json([
            'products'=>$products->load(['images']),
            'query'=> $query, 
        ]);
    }

}
