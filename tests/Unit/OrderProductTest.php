<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class OrderProductTest extends TestCase
{
    public Order $order;

    public Product $product;

    public OrderProduct $orderProduct; 

    protected function setUp(): void
    {
        parent::setUp(); // Always call the parent setUp method

        $this->order = Order::factory()->create();
        $this->product = Product::factory()->create();
        $this->orderProduct = OrderProduct::factory()->create([
            'order_id' => $this->order->id,
            'product_id' => $this->product->id, 
        ]);
    }

   #[Test]
    public function it_belongs_to_a_product()
    {
        $this->assertEquals($this->product->id, $this->orderProduct->product->id);
    }

   #[Test]
    public function it_belongs_to_an_order()
    {
        $this->assertEquals($this->order->id, $this->orderProduct->order->id);
    }
}
