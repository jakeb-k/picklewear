<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use http\Env\Response;
use App\Models\Order;
use Stripe\Checkout\Session; 
use Stripe\Stripe;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class StripeController extends Controller
{   
    //Need to make a Stripe Web Hook to validate processed payment before 
    //creating new order.
    public function checkout(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|integer|exists:products,id',
            'cart.*.name' => 'required|string',
            'cart.*.price' => 'required|numeric|min:0.5',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.color' => 'required|string',
            'cart.*.size' => 'required|string'
            // Add other necessary validations based on cart structure
        ]);

        $cart = $request->input('cart');

        // Initialize line items for Stripe Checkout
        $lineItems = [];
        $total = 0;
        $products = [];

        foreach ($cart as $item) {
            $description = "{$item['description']}";
            $color = ucfirst($item['color']); 
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'aud',
                    'product_data' => [
                        'name' => "{$item['name']}: {$color} \n {$item['size']} \n ",
                        'description' => $description,
                        'images'=> [$item['image']['file_path'] ]?? null,

                    ],
                    'unit_amount' => intval($item['price'] * 100), // Convert to cents
                ],
                'quantity' => $item['quantity'],
            ];

            // Prepare products string for Order
            $productDetails = [
                'id' => $item['id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'options' => $item['options'] ?? [],
            ];
            $products[] = $productDetails;

            $total += $item['price'] * $item['quantity'];
        }

        // Set Stripe API key
        Stripe::setApiKey(config('stripe.sk'));

        $session = Session::create([
            'payment_method_types' => ['card','zip'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('success'),
            'cancel_url' => route('index'),
        ]);
        // Create Order record
        // $order = new Order();
        // $order->products = json_encode($products); // Store as JSON
        // $order->status = 'unpaid';
        // $order->total = $total;
        // $order->session_id = $session->id;
        // $order->sent = false;

        // if (Auth::check()) {
        //     $order->user_id = Auth::id();
        // } else {
        //     $order->customer_id = $customer->id;
        // }

        // $order->save();

                
        // Return the session URL to the frontend
        return response()->json(['url' => $session->url]);
    }


    public function success(Request $request){

        \Stripe\Stripe::setApiKey(config('stripe.sk'));
        $sessionId = $request->get('session_id'); 

        try {
             $session = \Stripe\Checkout\Session::retrieve($sessionId); 
            if(!$session) {
                throw new NotFoundHttpException(); 
            }
            $customer = \Stripe\Customer::retrieve($session->customer); 
            $order = Order::where('session_id', $session->id)->where('status','unpaid')->first(); 
            
            if(!$order) {
                throw new NotFoundHttpException(); 
            }

            if ($order->status === 'unpaid') {
                $order->status = 'paid';
                $order->save();
            } 

            return view('products.success')->with('customer',$customer);

            } catch(\Exception $e){
                throw new NotFoundHttpException(); 

            }
         

    }
    public function webhook(){

        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            return response('', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response('', 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;

                $order = Order::where('session_id', $session->id)->first();
                if ($order && $order->status === 'unpaid') {
                    $order->status = 'paid';
                    $order->save();
                    // Send email to customer
                }

            // ... handle other event types
            default:
                echo 'Received unknown event type ' . $event->type;
        }

        return response('');
    }

}
