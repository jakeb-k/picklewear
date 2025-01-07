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
     * Shows a group of products with a particular type
     *
     * @param String $type
     * @return \Inertia\Response The Inertia response for the client-side renderer.
     */
    public function index(Request $request, string $category)
    {
        $category = "Clothing";
        // Query products with images only
        $products = Product::where("type", $category)
            ->whereHas("images") // Ensure products have images
            ->with(["options", "images"]) // Eager load options and images
            ->get();

        // Add order count to each product
        $products = $products->map(function ($product) {
            $product->order_count = $product->orders()->count();
            return $product;
        });

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
                    "type" => $request->type,
                    "url" => $request->url,
                    "delivery_date" => $request->delivery_date,
                    "available" => true,
                    "price" => $request->price,
                    "discount" => $request->discount,
                    "description" => $request->description,
                ]);

                $images = $request->file("images");

                foreach ($images as $index => $imageData) {
                    Log::info($imageData);
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

            // foreach($options as $optionData){
            //     $values = collect($optionData)->pluck('values');

            //     $option = ProductOption::create([
            //         'values'=> implode('.', $values),
            //         'product_id' => $product->id,
            //     ]);

            // }
            // 'images'=> 'required|array|min:3',
            // 'options'=> 'nullable|arary'

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
                "discount" => $request->discount,
                "description" => $request->description,
            ]);

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
