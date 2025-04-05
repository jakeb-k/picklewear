<?php

namespace App\Jobs;

use App\Models\Customer;
use App\Models\Order;
use App\Services\ZohoMailerService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendOrderPurchasedEmail implements ShouldQueue
{
    use Queueable;

    protected Order $order;
    
    protected Customer $customer;

    protected ZohoMailerService $mailer; 
    
    /**
     * Create a new job instance.
     */
    public function __construct(Order $order, Customer $customer)
    {
        $this->mailer = new ZohoMailerService();
        $this->order = $order;
        $this->customer = $customer;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->order->load(["customer", "user", "locations", "products.images"]);

        $viewData = [
            "order" => $this->order,
            "email" => $this->customer->email,
            "date" => Carbon::parse($this->order->created_at)->format("d/m/Y"),
            "delivery_range" => Carbon::parse($this->order->created_at)->addDays((int) $this->order->expected_delivery_range)->format('D jS M Y') .
                                " - " .
                                Carbon::parse($this->order->created_at)->addDays((int) $this->order->expected_delivery_range + 7)->format('D jS M Y'),
            "address" => $this->order->locations->first()->street . ", " .
                        $this->order->locations->first()->city . ", " .
                        $this->order->locations->first()->state . ", " .
                        $this->order->locations->first()->postcode,
            "products" => $this->order->products,
        ];

        $html = view("mail.order_purchased", $viewData)->render();
        $subject = "Smashing News! Your Pickleball Order ({$this->order->code}) is Confirmed!";


        $mailer = new ZohoMailerService(); 
        $mailer->sendMail($this->customer->email, $subject, $html);
    }
}
