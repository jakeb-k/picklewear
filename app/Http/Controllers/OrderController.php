<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function show(Order $order)
    {
        return Inertia::render('Products/OrderShowLayout', [
            'order' => $order->load(['location', 'customer', 'user', 'products.images']),
        ]);
    }
}
