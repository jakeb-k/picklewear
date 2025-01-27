<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class OrderController extends Controller
{
    public function show(Request $request, Order $order)
    {
        $sessionId = $request->query("session_id");
        if ($sessionId) {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);
            if (!$session) {
                throw new NotFoundHttpException();
            } else {
                return Inertia::render("Products/OrderShowLayout", [
                    "order" => $order->load([
                        "locations",
                        "customer",
                        "user",
                        "products.images",
                    ]),
                ]);
            }
        } elseif (Auth::check() && Auth::user()->id == $order->user_id) {
            return Inertia::render("Products/OrderShowLayout", [
                "order" => $order->load([
                    "locations",
                    "customer",
                    "user",
                    "products.images",
                ]),
            ]);
        }
        throw new NotFoundHttpException(); 
    }
}
