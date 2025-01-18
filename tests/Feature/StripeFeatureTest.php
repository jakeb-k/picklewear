<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class StripeFeatureTest extends TestCase
{
    use RefreshDatabase;

    public User $user; 

    public function setUp():void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->user->locations()->attach(Location::factory()->create()->id);
        $this->actingAs($this->user);

    }
    
    #[Test]
    public function user_can_navigate_to_checkout_page()
    {
        $location = Location::factory()->create();
        $this->user->locations()->attach($location); 

        $response = $this->get(route('checkout.show'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Checkout')
            ->where('locations', $this->user->locations->toArray())
        );
    }

    #[Test]
    public function user_must_have_valid_checkout_details()
    {
        $response = $this->postJson(route('checkout.store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'cart', 'first_name', 'last_name', 'street', 'city', 'state', 'postcode', 'mobile'
        ]);
    }

    #[Test]
    public function user_can_successfully_checkout_to_stripe()
    {
        Stripe::setApiKey(config('stripe.sk'));
        $this->actingAs($this->user);
        
        $cart = [
            [
                'id' => Product::factory()->create()->id,
                'name' => 'Test Product',
                'price' => 100,
                'quantity' => 1,
                'size' => 'M',
                'delivery_date'=> '14', 
                'color' => 'Blue',
                'description' => 'Test description',
                'image' => ['file_path' => 'image.jpg']
            ]
        ];

        $payload = [
            'cart' => $cart,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'street' => '123 Test St',
            'city' => 'Test City',
            'state' => 'NSW',
            'postcode' => '2000',
            'mobile' => '412345678',
            'total' => 100
        ];

        $response = $this->postJson(route('checkout.store'), $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure(['url']);

        $this->assertDatabaseHas('customers', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'mobile' => '412345678'
        ]);

        $this->assertDatabaseHas('orders', [
            'status' => 'Unpaid',
            'total' => 100
        ]);
    }

    #[Test]
    public function non_user_can_successfully_checkout_to_stripe()
    {
        Stripe::setApiKey(config('stripe.sk'));

        Auth::logout(); 

        $cart = [
            [
                'id' => Product::factory()->create()->id,
                'name' => 'Test Product',
                'price' => 100,
                'quantity' => 1,
                'size' => 'M',
                'delivery_date'=> '14', 
                'color' => 'Blue',
                'description' => 'Test description',
                'image' => ['file_path' => 'image.jpg']
            ]
        ];
        
        $payload = [
            'cart' => $cart,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'street' => '123 Test St',
            'city' => 'Test City',
            'state' => 'NSW',
            'postcode' => '2000',
            'mobile' => '412345678',
            'total' => 100
        ];

        $response = $this->postJson(route('checkout.store'), $payload);

        $response->assertStatus(200);
        $response->assertJsonStructure(['url']);

        $this->assertDatabaseHas('customers', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'mobile' => '412345678'
        ]);

        $this->assertDatabaseHas('orders', [
            'status' => 'Unpaid',
            'total' => 100
        ]);
    }

    #[Test]
    public function user_can_view_order_on_success()
    {
        $lineItems = [
            [
                "price_data" => [
                    "currency" => "aud",
                    "product_data" => [
                        "name" => "Test Product: Blue \n M \n ",
                        "description" => "This is a test product description.",
                        "images" => ["https://example.com/image.jpg"], // Provide a valid image URL
                    ],
                    "unit_amount" => 11000, // Amount in cents (e.g., $110.00 AUD)
                ],
                "quantity" => 2, // Number of units for this item
            ],
        ];

        $stripeCustomer = \Stripe\Customer::create([
            "email" => $this->user->email ?? null, // Optional but commonly used
            "name" =>  $this->user->first_name . " " .  $this->user->last_name, // Combine first and last name for Stripe's 'name' field
            "phone" =>  $this->user->mobile ?? null, // Optional
            "address" => [
                "line1" => null, // Optional
            ],
        ]);

        $session = Session::create([
            "payment_method_types" => ["card", "zip"],
            "line_items" => $lineItems,
            "mode" => "payment",
            "success_url" =>
                route("success", [], true) .
                "?session_id={CHECKOUT_SESSION_ID}",
            "cancel_url" => route("checkout.show"),
            "customer" => $stripeCustomer->id,
        ]);

        $newCustomer = Customer::create([
            "email" =>$this->user->email ?? null,
            "stripe_id" => $session->id,
            "first_name" => $this->user->first_name,
            "last_name" => $this->user->last_name,
            "mobile" => $this->user->mobile,
            "address" => '123 Test St Brisbane, QLD, 4000',
        ]);

        $order = Order::factory()->create(['session_id' => $session->id, 'status' => 'Unpaid', 'customer_id' => $newCustomer->id]);

        $response = $this->get(route('success').'?session_id='.$order->session_id);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products/OrderShowLayout')
            ->has('order')
        );

        $this->assertDatabaseHas('orders', [
            'session_id' => $session->id,
            'status' => 'Paid'
        ]);
    }

    #[Test]
    public function user_can_only_view_order_on_success_with_valid_session_id()
    {
        $lineItems = [
            [
                "price_data" => [
                    "currency" => "aud",
                    "product_data" => [
                        "name" => "Test Product: Blue \n M \n ",
                        "description" => "This is a test product description.",
                        "images" => ["https://example.com/image.jpg"], // Provide a valid image URL
                    ],
                    "unit_amount" => 11000, // Amount in cents (e.g., $110.00 AUD)
                ],
                "quantity" => 2, // Number of units for this item
            ],
        ];

        $newCustomer = Customer::create([
            "email" =>$this->user->email ?? null,
            "stripe_id" => '123456',
            "first_name" => $this->user->first_name,
            "last_name" => $this->user->last_name,
            "mobile" => $this->user->mobile,
            "address" => '123 Test St Brisbane, QLD, 4000',
        ]);

        $order = Order::factory()->create(['session_id' => '123456', 'status' => 'Unpaid', 'customer_id' => $newCustomer->id]);

        $response = $this->get(route('success').'?session_id='.$order->session_id);

        $response->assertStatus(404);

        $this->assertDatabaseMissing('orders', [
            'session_id' => '123456',
            'status' => 'Paid'
        ]);
    }

    // #[Test]
    // public function user_can_only_view_order_after_webhook()
    // {
    //     $this->withoutExceptionHandling();

    //     $sessionId = 'test_session_id';

    //     $order = Order::factory()->create(['session_id' => $sessionId, 'status' => 'Unpaid']);

    //     $payload = json_encode([
    //         'type' => 'checkout.session.completed',
    //         'data' => [
    //             'object' => [
    //                 'id' => $sessionId,
    //                 'customer_details' => [
    //                     'email' => 'test@example.com'
    //                 ]
    //             ]
    //         ]
    //     ]);

    //     $signature = 'test_signature'; // Simulate a valid signature if needed

    //     $response = $this->postJson(route('webhook'), [], [
    //         'HTTP_STRIPE_SIGNATURE' => $signature
    //     ]);

    //     $response->assertStatus(200);

    //     $this->assertDatabaseHas('orders', [
    //         'session_id' => $sessionId,
    //         'status' => 'Paid'
    //     ]);

    //     $this->assertDatabaseHas('customers', [
    //         'email' => 'test@example.com'
    //     ]);
    // }
}
