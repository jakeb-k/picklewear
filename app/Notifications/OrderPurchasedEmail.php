<?php

namespace App\Notifications;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPurchasedEmail extends Notification
{
    use Queueable;

    protected Order $order;

    protected string $email;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order, string $email)
    {
        $this->order = $order;
        $this->email = $email;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ["mail"];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject("Welcome to Picklewear Mail List")
            ->greeting("Hello!")
            ->view("mail.order_purchased", [
                "order" => $this->order,
                "email" => $this->email,
                "date" => Carbon::parse($this->order->created_at)->format(
                    "d/m/Y"
                ),
                'delivery_range' => Carbon::parse($this->order->created_at)->addDays(intval($this->order->expected_delivery_range))->format('D jS M Y') . " - " . Carbon::parse($this->order->created_at)->addDays(intval($this->order->expected_delivery_range) + 7)->format('D jS M Y'),
                'address' => $this->order->locations->first()->street . ", " . $this->order->locations->first()->city . ", " . $this->order->locations->first()->state . ", " . $this->order->locations->first()->postcode,
                'products' => $this->order->products->load(['images']),
            ]);
    }

    // /**
    //  * Get the array representation of the notification.
    //  *
    //  * @return array<string, mixed>
    //  */
    // public function toArray(object $notifiable): array
    // {
    //     return [
    //         //
    //     ];
    // }
}
