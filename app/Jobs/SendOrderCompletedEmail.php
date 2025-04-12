<?php

namespace App\Jobs;

use App\Models\Customer;
use App\Models\Order;
use App\Services\ZohoMailerService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendOrderCompletedEmail implements ShouldQueue
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
            'link' => route('orders.show',$this->order).'?session_id=' . $this->order->session_id, 
            "order" => $this->order,
            "email" => $this->customer->email,
            "date" => Carbon::parse($this->order->created_at)->format("d/m/Y"),
            "address" => $this->order->locations->first()->street . ", " .
                        $this->order->locations->first()->city . ", " .
                        $this->order->locations->first()->state . ", " .
                        $this->order->locations->first()->postcode,
            "products" => $this->order->products,
        ];

        $html = view("mail.order_completed", $viewData)->render();
        $subject = "Your Order ({$this->order->code}) has been completed!";


        $mailer = new ZohoMailerService(); 
        $mailer->sendMail($this->customer->email, $subject, $html);
    }
}
