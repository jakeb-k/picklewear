<?php

namespace Tests\Unit;

use App\Models\Image;
use App\Models\Product;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImageTest extends TestCase
{
    use RefreshDatabase;

    public Product $product;
    public Image $image;

    protected function setUp(): void
    {
        parent::setUp(); // Always call the parent setUp method
        $this->product = Product::factory()->create();
        $this->image = Image::factory()->create();

        $this->image->products()->attach($this->product->id);
    }

    #[Test]
    public function image_can_morph_to_a_product(): void
    {
        $this->assertEquals(
            $this->product->id,
            $this->image->products()->first()->id
        );
    }
}
