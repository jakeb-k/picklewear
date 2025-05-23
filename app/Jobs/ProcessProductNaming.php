<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\ProductNamerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessProductNaming implements ShouldQueue
{
    use Queueable;
    protected int $productId;
    protected string $title;
    /**
     * Create a new job instance.
     */
    public function __construct(int $productId, string $title)
    {
        $this->productId = $productId;
        $this->title = $title;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $namer = new ProductNamerService();
        $result = $namer->renameProduct($this->title);
        
        Product::where('id', $this->productId)->update([
            'name' => $result['title'] ?? $this->title,
            'description' => $result['description'] ?? $this->title,
        ]);
    }
}
