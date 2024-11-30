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
    public function index(string $type)
    {
        $products = Product::where("type", $type)->get();

        return Inertia::render("Products/ProductIndexLayout", [
            "products" => $products,
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
        $related_items = Product::where("type", $product->type)
            ->whereHas("images")
            ->limit(6)
            ->get();
        return Inertia::render("Products/ProductShowLayout", [
            "product" => $product->load(["options", "images"]),
            "relatedItems" => $related_items->load(["images"]),
        ]);
    }

    /**
     * Get the bestsellers of the store to display on the home page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBestsellers()
    {
        $bestsellers = Product::where("type", "Clothing")
            ->orderBy("price", "DESC")
            ->limit(10)
            ->get();
        $bestsellers->each(function ($product) {
            if ($product->images()->exists()) {
                $product->load("images");
            }
        });
        return response()->json([
            "bestsellers" => $bestsellers,
        ]);
    }

    /**
     * User enters a query and it gets matched against name and type of the item
     *
     * @param String $query
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(string $query)
    {
        $products = Product::where("name", "like", "%" . $query . "%")
            ->orWhere("type", "like", "%" . $query . "%")
            ->get();
        return response()->json([
            "products" => $products->load(["images"]),
            "query" => $query,
        ]);
    }

    /**
     * Change the availability of the product
     *
     * @param Product $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function setAvailable(Product $product)
    {
        $product->available = !$product->available;
        $product->save();

        return response()->json([
            "products" => Product::with(['options', 'images'])->orderBy('updated_at', 'desc')->get(),
        ]);
    }
}
