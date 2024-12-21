<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use http\Env\Response;
use App\Models\Order;
use Inertia\Inertia;
use Stripe\Checkout\Session; 
use Stripe\Stripe;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class StripeController extends Controller
{   
    public function checkoutShow()
    {
        return Inertia::render('Checkout', []); 
    }
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
            'cart.*.size' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'mobile' => ['required', 'regex:/^[2-478](?:[ -]?[0-9]){8}$/'],
            // Add other necessary validations based on cart structure
        ], [
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'mobile.required' => 'Mobile number is required',
            'mobile.regex' => 'Mobile number is invalid',
        ]);

        $cart = $request->input('cart');

        // Initialize line items for Stripe Checkout
        $lineItems = [];
        $products = []; 
        foreach ($cart as $item) {
            $description = "{$item['description']}";
            $color = ucfirst($item['color']); 
            $basePriceCents = intval($item['price'] * 100); // Convert base price to cents
            $discountValue = isset($request->discount) ? $request->discount : 0; // Default discount to 0 if not set
        
            // Calculate GST (10% of the original price)
            $gstCents = $basePriceCents * 0.1;

            // Calculate discounted total (after applying discount to the original price)
            $discountedPriceCents = $basePriceCents - ($basePriceCents * $discountValue);

            // Final price including GST (add GST to the discounted price)
            $finalPriceCents = $discountedPriceCents + $gstCents;
        
            // Add line item with the calculated final price
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'aud',
                    'product_data' => [
                        'name' => "{$item['name']}: {$color} \n {$item['size']} \n ",
                        'description' => $description,
                        'images' => [$item['image']['file_path']] ?? null,
                    ],
                    'unit_amount' => round($finalPriceCents), // Ensure it's rounded to the nearest cent
                ],
                'quantity' => $item['quantity'],
            ];

            // Prepare products string for Order
            $productDetails = [
                'id' => $item['id'],
                'name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'size' => $item['size'],
                'color' => $item['color'],
                'options' => $item['options'] ?? [],
            ];
            $products[] = $productDetails;
        }

        // Set Stripe API key
        Stripe::setApiKey(config('stripe.sk'));

        $session = Session::create([
            'payment_method_types' => ['card','zip'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => route('success'),
            'cancel_url' => route('checkout.show'),
        ]);

        $newCustomer = Customer::create([
            'email' => Auth::user()->email ?? null,
            'stripe_id' => $session->id, 
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'mobile' => $request->mobile,
            'address' => $request->address,
        ]);
        // $customerLocation = Location::create([
        //     'street' => $request->street_address,
        //     'city' => $request->city,
        //     'state' => $request->state,
        //     'postcode' => $request->postcode,
        // ]); 
        // $newCustomer->locations()->attach($customerLocation->id);
        // Create Order record
        $order = Order::create([
            'status' => 'Unpaid',
            'total' => $request->total, 
            'session_id' => $session->id, 
            'sent' => false, 
            'user_id' => Auth::user()->id ?? null, 
        ]);
        $order->customer_id = $newCustomer->id; 
        $order->save();
        foreach($products as $product){
            $order->products()->attach($product['id'], [
                'quantity' => $product['quantity'],
                'size'=> $product['size'],
                'color'=> $product['color'],
            ]);
        }   

        // if (Auth::check()) {
        //     $order->user_id = Auth::id();
        // } else {
        //     $order->customer_id = $customer->id;
        // }

        $order->save();

                
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

            $order = Order::where('session_id', $session->id)->where('status','Unpaid')->first(); 
            
            if(!$order) {
                throw new NotFoundHttpException(); 
            }

            if ($order->status === 'Unpaid') {
                $order->status = 'Paid';
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
