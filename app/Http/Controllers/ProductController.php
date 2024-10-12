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
        return Inertia::render('Products/ProductShowLayout', [
            'product' => $product->load(['options'])
        ]); 
        
    }

    public function getBestsellers() {
        $bestsellers = Product::where('type', 'Clothing')->orderBy('price', 'DESC')->limit(10)->get();
        return response()->json([
            'bestsellers' => $bestsellers
        ]);

    }

    public function search(String $query)
    {

    }

    public function addToCart(Product $product)
    {

    }

    public function updateQuantityInCart(Product $product)
    {

    }

    public function removeFromCart(Product $product)
    {
        
    }
}
