<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Product;
use App\Models\ProductOption;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Shows a group of products of a particular category
     *
     * @param String $type
     * @return \Inertia\Response The Inertia response for the client-side renderer.
     */
    public function index(Request $request, string $category)
    {
        $type = $request->get("type");
        $fromHome = $request->get("tag");
        $products = [];
        switch ($category) {
            case "favourites":
                break;
            case "sale":
                $products = Product::with(["options", "images"])
                    ->where("discount", "!=", null)
                    ->orderBy("discount")
                    ->limit(20)
                    ->get();
                break;
            case "popular":
                $products = Product::with(["options", "images"]) // Eager load options and images
                    ->withCount("orders") // Add the count of related orders
                    ->orderBy("orders_count", "desc") // Order by the count of orders
                    ->limit(20)
                    ->get();
                break;
            default:
                if (!is_null($fromHome)) {
                    $products = Product::with(["options", "images"]) // Eager load options and images
                        ->whereHas("tags", function ($query) use ($category) {
                            // Filter tags based on their type
                            $query->where("type", $category);
                        })
                        ->get();
                } else {
                    // Query products with images only
                    $products = Product::with(["options", "images"]) // Eager load options and images
                        ->when(
                            $type,
                            function ($query, $type) use ($category) {
                                // If $type is present, search with both category and type
                                return $query->withAllTagsOfAnyType([
                                    $category,
                                    $type,
                                ]);
                            },
                            function ($query) use ($category) {
                                // If $type is not present, search with category only
                                return $query->withAllTagsOfAnyType([
                                    $category,
                                ]);
                            }
                        )
                        ->get();
                }
                break;
        }
        if ($category != "favourites") {
            // Add order count to each product
            $products = $products->map(function ($product) {
                $product->order_count = $product->orders()->count();
                return $product;
            });
        }

        return Inertia::render("Products/ProductIndexLayout", [
            "products" => $products,
            "category" => $category,
            "type" => $request->get("type"),
        ]);
    }

    /**
     * Shows a singular product
     *
     * @param Product $product
     * @return \Inertia\Response
     */
    public function show(Product $product)
    {
        $related_items = Product::where("type", $product->type)
            ->whereHas("images")
            ->withAnyTags($product->tags->pluck('name')->toArray())
            ->limit(6)
            ->get();
        return Inertia::render("Products/ProductShowLayout", [
            "product" => $product->load(["options", "images"]),
            "relatedItems" => $related_items->load(["images"]),
        ]);
    }

    /**
     * Store a new product
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                "name" => "required|string|max:100",
                "type" => "required",
                "url" => "required",
                "delivery_date" => "numeric|required",
                "price" => "numeric|required|min:0",
                "discount" => "numeric|nullable|min:0|max:100",
                "description" => "required",
                "images" => "required|array|min:3",
                "options" => "nullable|arary",
            ]);

            DB::transaction(function () use ($request) {
                $product = Product::create([
                    "name" => $request->name,
                    "type" => ucfirst($request->type),
                    "url" => $request->url,
                    "delivery_date" => $request->delivery_date,
                    "available" => true,
                    "price" => $request->price,
                    "discount" => $request->discount / 100,
                    "description" => $request->description,
                ]);

                $colorOption = ProductOption::create([
                    'type' => 'color',
                    'values' => str_replace(",", ".", $request->colors), 
                    'product_id' => $product->id, 
                ]); 

                $images = $request->file("images");

                foreach ($images as $index => $imageData) {
                    $fileName = time() . $index . "." . $imageData->extension();

                    $folder = "files/products/";
                    $filePath = $imageData->storeAs(
                        $folder,
                        $fileName,
                        "public"
                    );

                    $disk = config("filesystems.default");
                    $path = Storage::disk($disk)->url($filePath);

                    $image = Image::create([
                        "file_name" => $imageData->getClientOriginalName(),
                        "mime_type" => $imageData->getClientMimeType(),
                        "file_path" => $path,
                        "file_size" => $imageData->getSize(),
                    ]);

                    $product->images()->attach($image);
                }
            }, 1);

            return response()->json([
                "success" => "Your Product was updated",
                "products" => Product::with(["options", "images"])
                    ->orderBy("updated_at", "desc")
                    ->get(),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "error" => $e->getMessage(),
                ],
                400
            );
        }
    }

    /**
     * Update the specified resource
     *
     * @param Request $request
     * @param Product $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Product $product)
    {
        try {
            $request->validate([
                "images.*" => "required|file|mimes:jpeg,png,jpg|max:2048",
                "name" => "required|string|max:100",
                "type" => "required",
                "url" => "required",
                "delivery_date" => "numeric|required",
                "price" => "numeric|required|min:0",
                "discount" => "numeric|nullable|min:0|max:100",
                "description" => "required",
            ]);
            $product->update([
                "name" => $request->name,
                "type" => $request->type,
                "url" => $request->url,
                "delivery_date" => $request->delivery_date,
                "price" => $request->price,
                "discount" => $request->discount / 100,
                "description" => $request->description,
            ]);
            
            $colorOption = ProductOption::find($request->colorOptionId); 
            $colorOption->values = str_replace(",", ".", $request->colors);
            $colorOption->save(); 

            return response()->json([
                "success" => "Your Product was updated",
                "products" => Product::with(["options", "images"])
                    ->orderBy("updated_at", "desc")
                    ->get(),
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "error" => $e->getMessage(),
                ],
                400
            );
        }
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
            "products" => Product::with(["options", "images"])
                ->orderBy("updated_at", "desc")
                ->get(),
        ]);
    }

    /**
     * Delete the specified resource
     *
     * @param Product $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            "products" => Product::with(["options", "images"])
                ->orderBy("updated_at", "desc")
                ->get(),
        ]);
    }
}
