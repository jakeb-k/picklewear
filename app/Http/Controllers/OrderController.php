<?php

namespace App\Http\Controllers;

use App\Jobs\SendOrderCompletedEmail;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class OrderController extends Controller
{
    /**
     * Check user is authorised then display the order details.
     *
     * @param Request $request
     * @param Order $order
     * @return void
     */
    public function show(Request $request, Order $order)
    {
        \Stripe\Stripe::setApiKey(config("stripe.sk"));
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
        } elseif (Auth::user()->hasRole("admin")) {
            return Inertia::render("Products/OrderShowLayout", [
                "order" => $order->load([
                    "locations",
                    "customer",
                    "user",
                    "products.images",
                ]),
            ]);
        }
        throw new HttpException(403, "Unauthorized action.");
    }

    /**
     * Complete the order and dispatch an email denoting the details
     *
     * @param Order $order
     * @return void
     */
    public function completeOrder(Order $order)
    {
        $order->update([
            "status" => "Completed",
        ]);

        SendOrderCompletedEmail::dispatch($order, $order->customer);

        return response()->json([
            "message" => "Order completed successfully",
            "orders" => Order::with([
                "products",
                "user",
                "locations",
                "customer",
            ])
                ->orderBy("updated_at", "desc")
                ->get(),
        ]);
    }
}
