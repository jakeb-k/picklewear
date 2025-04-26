<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Jobs\ProcessProductNaming;
use App\Models\Image;
use App\Models\Product;
use App\Models\ProductOption;
use App\Services\ProductNamerService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Tags\Tag;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

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
                    if (str_contains($type, "sale")) {
                        $matches = [];
                        preg_match("/([a-zA-Z]+)(\d+)/", $type, $matches);
                        $amount = null;
                        // Eager load products with images
                        if (isset($matches[2])) {
                            $amount = $matches[2];
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
                                ->where("price", "<=", intval($amount))
                                ->get();
                        } else {
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
                                ->where("discount", ">", 0)
                                ->get();
                        }
                    } else {
                        // Eager load products with images
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
        $related_items = Product::withAllTags($product->tags)
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
    public function store(ProductRequest $request)
    {
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
                "type" => "color",
                "values" => str_replace(",", ".", $request->colors),
                "product_id" => $product->id,
            ]);

            $tagIds = array_merge($request->category, $request->type);
            $tags = Tag::findMany($tagIds);
            $product->attachTags($tags);

            $images = $request->file("images");

            foreach ($images as $index => $imageData) {
                $fileName = time() . $index . "." . $imageData->extension();

                $folder = "files/products/";
                $filePath = $imageData->storeAs($folder, $fileName, "public");

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
        });

        return response()->json([
            "success" => "Your Product was updated",
            "products" => Product::with(["options", "images"])
                ->orderBy("updated_at", "desc")
                ->get(),
        ]);
    }

    /**
     * Update the specified resource
     *
     * @param Request $request
     * @param Product $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ProductRequest $request, Product $product)
    {
        $product->update([
            "name" => $request->name,
            "type" => $request->type,
            "url" => $request->url,
            "delivery_date" => $request->delivery_date,
            "price" => $request->price,
            "discount" => $request->discount / 100,
            "description" => $request->description,
        ]);

        $tagIds = array_merge($request->category, $request->type);
        $tags = Tag::findMany($tagIds);
        $product->syncTags($tags);

        if ($request->colorOptionId) {
            $colorOption = ProductOption::find($request->colorOptionId);
            $colorOption->values = str_replace(",", ".", $request->colors);
            $colorOption->save();
        } else {
            $colorOption = ProductOption::create([
                "product_id" => $product->id,
                "values" => str_replace(",", ".", $request->colors),
                "type" => "color",
            ]);
        }
        $images = $request->file("images");

        $newImages = [];

        if (!is_null($images)) {
            foreach ($images as $index => $imageData) {
                $fileName = time() . $index . "." . $imageData->extension();

                $folder = "files/products/";
                $filePath = $imageData->storeAs($folder, $fileName, "public");

                $disk = config("filesystems.default");
                $path = Storage::disk($disk)->url($filePath);

                $image = Image::create([
                    "file_name" => $imageData->getClientOriginalName(),
                    "mime_type" => $imageData->getClientMimeType(),
                    "file_path" => $path,
                    "file_size" => $imageData->getSize(),
                ]);

                $newImages[] = $image->id; // Add the image ID to the array
            }

            $product->images()->sync($newImages);
        }

        return response()->json([
            "success" => "Your Product was updated",
            "products" => Product::with(["options", "images", "tags"])
                ->orderBy("updated_at", "desc")
                ->get(),
        ]);
    }

    /**
     * Get the bestsellers of the store to display on the home page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBestsellers()
    {
        $bestsellers = Product::with(["options", "images"]) // Eager load options and images
            ->withCount("orders") // Add the count of related orders
            ->whereHas("images") // Only include products that have images
            ->orderBy("orders_count", "desc") // Order by the count of orders
            ->limit(10)
            ->get();

        return response()->json([
            "bestsellers" => $bestsellers,
        ]);
    }

    /**
     * User enters a query and it gets matched against name and type of the item
     *
     * @todo Search by tags
     *
     * @param String $query
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(string $query)
    {
        $products = Product::where("name", "like", "%" . $query . "%")
            ->orWhere("type", "like", "%" . $query . "%")
            ->orWhereHas("tags", function ($q) use ($query) {
                $q->where("name->en", "like", $query . "%");
            })
            ->with("images", "tags")
            ->get();

        return response()->json([
            "products" => $products,
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

        return to_route("admin.dashboard")->with([
            "success" => "Product deleted successfully",
        ]);
        return response()->json([
            "products" => Product::with(["options", "images"])
                ->orderBy("updated_at", "desc")
                ->get(),
        ]);
    }

    /**
     * Get the tags for product creates and updates
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTags()
    {
        $categoryTags = Tag::where("type", "category")->get();

        $typeTags = Tag::whereNot("type", "category")->get();

        return response()->json([
            "categories" => $categoryTags,
            "types" => $typeTags,
        ]);
    }

    /**
     * Uploads a JSON file with products information
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request)
    {
        $json = $request->file("products")->get();
        $products = json_decode($json, true);

        foreach ($products as $productData) {
            $imageUrls = [
                $productData["Main Image"],
                $productData["Image 1"],
                $productData["Image 2"],
                $productData["Image 3"],
                $productData["Image 4"],
                $productData["Image 5"],
            ];

            $sku = $productData["SKU Properties"];

            $parts = explode("|", $sku);

            $sizePart = collect($parts)->first(
                fn($p) => str_contains($p, "Size:")
            );

            $sizes = array_map(
                "trim",
                explode(",", str_replace("Size:", "", $sizePart))
            );

            $sizes = array_map("strtoupper", $sizes);

            preg_match('/Color:\s*(.*?)\s*(\||$)/', $sku, $match);
            $colorString = $match[1] ?? "";

            $rawColours = explode(",", $colorString);

            $cssNamedColours = config("colors.css_named");

            $cleanColours = collect($rawColours)
                ->map(function ($c) {
                    $c = trim($c);
                    $c = preg_replace(
                        '/(Men|Women|Unisex|Adult|Kid|Boy|Girl)$/i',
                        "",
                        $c
                    );
                    $c = str_replace(" ", "", $c);
                    return strtolower($c);
                })
                ->filter(function ($c) {
                    // bin if it's just numbers or messy alphanumeric codes
                    return preg_match('/^[a-zA-Z]+$/', $c); // letters only, no digits
                })
                ->filter(fn($c) => in_array($c, $cssNamedColours))
                ->unique()
                ->values()
                ->toArray();

            $categoryTags = Tag::where("type", "category")
                ->pluck("name")
                ->toArray();

            $typeTags = Tag::where("type", "!=", "category")
                ->pluck("name")
                ->toArray();

            // Step 1: Clean + combine weird splits like 'T Shirt' → 'tshirt'
            $dataTags = explode(" ", $productData["Product Title"]);

            $mergedWords = [];

            for ($i = 0; $i < count($dataTags); $i++) {
                $current = $dataTags[$i];
                $next = $dataTags[$i + 1] ?? null;

                if ($next && strlen($next) === 1) {
                    $mergedWords[] = strtolower(
                        str_replace("-", "", $current . $next)
                    );
                    $i++; // skip next
                } else {
                    $mergedWords[] = strtolower(str_replace("-", "", $current));
                }
            }

            // Step 2: Strip punctuation
            $cleanWords = array_map(fn($w) => trim($w, ",.?!"), $mergedWords);

            // Step 3: Normalize tag lists the same way
            $normalize = fn($tag) => strtolower(
                str_replace("-", "", trim($tag))
            );

            // Step 4: Match with flexible plural logic
            $matchedCategories = array_filter($categoryTags, function (
                $tag
            ) use ($cleanWords, $normalize) {
                $tag = $normalize($tag);
                
                foreach ($cleanWords as $word) {
                    if (
                        $word === $tag ||
                        $word === $tag . "s" ||
                        $word . "s" === $tag
                    ) {
                        return true;
                    }
                }
                return false;
            });

            $matchedTypes = array_filter($typeTags, function ($tag) use (
                $cleanWords,
                $normalize
            ) {
                $tag = $normalize($tag);
                foreach ($cleanWords as $word) {
                    if (
                        $word === $tag ||
                        $word === $tag . "s" ||
                        $word . "s" === $tag
                    ) {
                        return true;
                    }
                }
                return false;
            });

            $sku = $productData["id"]; // using JSON `id` as SKU

            $url = $productData["Main Image"];

            $rawDelivery = $productData["Delivery Time"] ?? null;

            $deliveryDate = \Carbon\Carbon::parse($rawDelivery);
            $deliveryDays = now()->diffInDays($deliveryDate, false);

            $originalPrice = str_replace(
                ['AU$', '$'],
                "",
                $productData["Original Price"]
            );
            $originalPrice = is_numeric($originalPrice)
                ? floatval($originalPrice)
                : null;

            $salePrice = floatval(
                str_replace(['AU$', '$'], "", $productData["Sale Price"])
            );
            $shipping = floatval(
                str_replace(['AU$', '$'], "", $productData["Shipping Info"])
            );

            // Calculate discount percentage
            $discountPercentage = $originalPrice
                ? 1 - $salePrice / $originalPrice // ex: (100 - 80) / 100 = 0.2 = 20%
                : 0;

            // Ensure max discount cap 50%
            $discountPercentage = min($discountPercentage, 0.5);

            // Final price = Original + shipping + 20% markup
            if ($originalPrice) {
                $finalPrice = round(($originalPrice + $shipping) * 1.2, 2);
            } else {
                $finalPrice = round(($salePrice + $shipping) * 1.2, 2);
            }

            $available = $productData["Stock"] > 0 ? 1 : 0;

            $product = Product::updateOrCreate(
                ["sku" => $sku],
                [
                    "name" => $productData["Product Title"],
                    "url" => $url,
                    "delivery_date" => $deliveryDays,
                    "price" => $finalPrice,
                    "discount" => $discountPercentage,
                    "sku" => $sku,
                    "description" => $productData["Product Title"],
                    "available" => $available,
                ]
            );

            // only dispatch if this was a new insert
            if ($product->wasRecentlyCreated) {
                ProcessProductNaming::dispatch(
                    $product->id,
                    $productData["Product Title"]
                );
            }

            if (count($cleanColours) > 0) {
                $colorOption = ProductOption::create([
                    "type" => "color",
                    "values" => implode(".", $cleanColours),
                    "product_id" => $product->id,
                ]);
            }

            if (count($sizes) > 0) {
                ProductOption::create([
                    "type" => "size",
                    "values" => implode(".", $sizes),
                    "product_id" => $product->id,
                ]);
            }

            $matchedTagNames = array_merge($matchedCategories, $matchedTypes);

            $product->syncTags($matchedTagNames);

            $product->images()->delete();

            foreach ($imageUrls as $url) {
                if (!$url) {
                    continue;
                } // skip nulls or blanks

                try {
                    $imageBinary = file_get_contents($url);

                    $finfo = new \finfo(FILEINFO_MIME_TYPE);
                    $mime = $finfo->buffer($imageBinary);
                    $size = strlen($imageBinary); // in bytes
                    $ext = match ($mime) {
                        "image/jpeg" => "jpg",
                        "image/png" => "png",
                        "image/webp" => "webp",
                        default => "jpg",
                    };

                    $fileName = Str::uuid() . "." . $ext;

                    $image = Image::create([
                        "file_name" => $fileName,
                        "file_path" => $url,
                        "file_size" => $size,
                        "mime_type" => $mime,
                    ]);

                    $product->images()->attach($image->id);
                } catch (\Exception $e) {
                    // log or skip if failed
                    Log::error("Image failed: $url — " . $e->getMessage());
                }
            }
        }
    }
}
