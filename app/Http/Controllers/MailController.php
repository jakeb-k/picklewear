<?php

namespace App\Http\Controllers;

use App\Models\SubscriberEmail;
use App\Models\User;
use App\Notifications\NewSubscriberEmail;
use App\Notifications\ServiceContactNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class MailController extends Controller
{
    protected User $admin;

    public function __construct()
    {
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
        $request->validate(
            [
                "first_name" => "required|string|max:50",
                "last_name" => "nullable|string|max:50",
                "email" => "required|email",
                "message" => "required|string",
            ],
            [
                "first_name.required" => "First name is required",
                "email.required" => "Email is required",
                "email.email" => "Email is not a valid email",
                "message.required" => "Message is required",
            ]
        );
        $this->admin->notify(new ServiceContactNotification($request->all()));

        return response()->json([
            "success" => true,
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
        $request->validate(
            [
                "email" => "required|email|unique:subscriber_emails",
            ],
            [
                "email.unique" => "This email is already taken",
                "email.required" => "An email is required",
            ]
        );

        SubscriberEmail::create([
            "email" => $request->email,
        ]);
        Notification::route("mail", $request->email)->notify(
            new NewSubscriberEmail($request->email)
        );

        return response()->json([
            "success" => "This didn't fail",
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
