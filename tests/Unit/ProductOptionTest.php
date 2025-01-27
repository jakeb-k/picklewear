<?php

namespace Tests\Unit;

use App\Models\Product;
use App\Models\ProductOption;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ProductOptionTest extends TestCase
{
    public ProductOption $productOption;
    
    public Product $product;

    protected function setUp(): void
    {
        parent::setUp(); // Always call the parent setUp method
        $this->product = Product::factory()->create();
        $this->productOption = ProductOption::factory()->create([
            'product_id' => $this->product->id, 
        ]);
    }

    #[Test]
    public function a_product_option_belongs_to_a_product():void
    {
        $this->assertEquals($this->product->id, $this->productOption->product->id);
    }
}
