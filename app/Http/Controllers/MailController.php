<?php

namespace App\Http\Controllers;

use App\Jobs\SendContactEmail;
use App\Jobs\SendSubscribersWelcomeEmail;
use App\Models\SubscriberEmail;
use App\Models\User;
use App\Notifications\NewSubscriberEmail;
use App\Notifications\ServiceContactNotification;
use App\Services\ZohoMailerService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class MailController extends Controller
{
    protected User $admin;
    protected ZohoMailerService $mailer; 

    public function __construct()
    {
        $this->mailer = new ZohoMailerService();
        $this->admin = User::role("admin")->first();
    }


    /**
     * send a message to the admin user
     *
     * @param Request $request
     * @return void
     */
    public function sendContactEmail(Request $request)
    {
        $request->validate([
            "first_name" => "required|string|max:50",
            "last_name" => "nullable|string|max:50",
            "email" => "required|email",
            "message" => "required|string",
        ]);
    
        $data = $request->only(["first_name", "last_name", "email", "message"]);
    
        // $htmlBody = view("mail.contact", ['data' => $data])->render();
    
        // $subject = "You have a new Enquiry";
        // $result = $this->mailer->sendMail('admin@picklewear.com.au', $subject, $htmlBody, null);
    
        SendContactEmail::dispatch($data);

        return response()->json([
            "success" => true,
            "error" => false,
        ]);
    }

    /**
     * Send an email to subscribe to mail list
     *
     * @param Request $request
     * @return void
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            "email" => "required|email|unique:subscriber_emails",
        ], [
            "email.unique" => "This email is already taken",
            "email.required" => "An email is required",
        ]);

        SubscriberEmail::create([
            "email" => $request->email,
        ]);

        // $html = view("mail.newsub", ['email' => $request->email])->render();
        // $subject = "Welcome to Picklewear Mail List";

        // $result = $this->mailer->sendMail($request->email, $subject, $html);
        SendSubscribersWelcomeEmail::dispatch($request->email);

        return response()->json([
            "success" => true,
            "error" => false,
        ]);
    }

    /**
     * Delete the email from the database
     *
     * @param string $email
     * @return void
     */
    public function unsubscribe(Request $request)
    {
        $email = $request->query("email");
        $unsub = SubscriberEmail::where("email", urldecode($email))->first();
        if ($unsub) {
            $unsub->delete();
        }

        return view("mail.unsub");
    }
}
