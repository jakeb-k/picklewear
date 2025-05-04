<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Jobs\ProcessProductNaming;
use App\Models\Image;
use App\Models\Product;
use App\Models\ProductOption;
use Illuminate\Support\Facades\Log;
use Spatie\Tags\Tag;
use Illuminate\Support\Str;

class CreateNewProduct implements ShouldQueue
{
    use Queueable;

    public $productData; 
    /**
     * Create a new job instance.
     */
    public function __construct($productData)
    {
        $this->productData = $productData; 
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $imageUrls = [
            $this->productData["Main Image"],
            $this->productData["Image 1"],
            $this->productData["Image 2"],
            $this->productData["Image 3"],
            $this->productData["Image 4"],
            $this->productData["Image 5"],
        ];

        $sku = $this->productData["SKU Properties"];

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
                $c = preg_replace('/(Men|Women|Unisex|Adult|Kid|Boy|Girl)$/i', "", $c);
                $c = str_replace(" ", "", $c);
                return strtolower($c);
            })
            ->filter(fn($c) => preg_match('/^[a-zA-Z]+$/', $c))
            ->filter(fn($c) => in_array($c, $cssNamedColours));
        
        // search full SKU string for any valid colour name
        $foundInText = collect($cssNamedColours)
            ->filter(fn($name) => stripos($sku, $name) !== false);
        
        $allColours = $cleanColours->merge($foundInText)
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
        $dataTags = explode(" ", $this->productData["Product Title"]);

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

        $sku = $this->productData["id"]; // using JSON `id` as SKU

        $url = $this->productData["Main Image"];

        $rawDelivery = $this->productData["Delivery Time"] ?? null;

        $deliveryDate = \Carbon\Carbon::parse($rawDelivery);
        $deliveryDays = now()->diffInDays($deliveryDate, false);

        $originalPrice = str_replace(
            ['AU$', '$'],
            "",
            $this->productData["Original Price"]
        );
        $originalPrice = is_numeric($originalPrice)
            ? floatval($originalPrice)
            : null;

        $salePrice = floatval(
            str_replace(['AU$', '$'], "", $this->productData["Sale Price"])
        );
        $shipping = floatval(
            str_replace(['AU$', '$'], "", $this->productData["Shipping Info"])
        );

        // Calculate discount percentage
        $discountPercentage = $originalPrice
            ? 1 - $salePrice / $originalPrice // ex: (100 - 80) / 100 = 0.2 = 20%
            : 0;

        // Ensure max discount cap 50%
        $discountPercentage = min($discountPercentage, 0.5);

        // Final price = Original + shipping + 20% markup
        if ($originalPrice) {
            $finalPrice = round(($originalPrice) * 1.2, 2) + $shipping;
        } else {
            $finalPrice = round(($salePrice) * 1.2, 2) + $shipping;
        }

        $available = $this->productData["Stock"] > 0 ? 1 : 0;

        $product = Product::updateOrCreate(
            ["sku" => $sku],
            [
                "name" => $this->productData["Product Title"],
                "url" => $url,
                "delivery_date" => $deliveryDays,
                "price" => $finalPrice,
                "discount" => $discountPercentage,
                "sku" => $sku,
                "description" => $this->productData["Product Title"],
                "available" => $available,
            ]
        );

        ProcessProductNaming::dispatch(
            $product->id,
            $this->productData["Product Title"]
        )->onQueue('naming');

        if (count($allColours) > 0) {
            $colorOption = ProductOption::create([
                "type" => "color",
                "values" => implode(".", $allColours),
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
        $allTags = Tag::all()->keyBy(function ($tag) {
            return strtolower(str_replace("-", "", trim($tag->name)));
        });
        
        $matchedTagModels = collect($matchedTagNames)
            ->map(fn($name) => strtolower(str_replace("-", "", trim($name))))
            ->map(fn($normName) => $allTags[$normName] ?? null)
            ->filter();
        
        $product->syncTags($matchedTagModels);
        
        Log::info($matchedTagModels); 
        Log::info($matchedCategories);

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
        Log::info("Created a new product -".$product->name);
    }
}
