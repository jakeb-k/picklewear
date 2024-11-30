<?php

namespace App\Http\Controllers;

use App\Mail\SendContactMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    protected User $admin;

    public function __construct()
    {
        $this->admin = User::where("is_admin", true)->first();
    }

    public function sendContactEmail(Request $request)
    {
        $request->validate([
            "first_name" => "required|string|max:50",
            "last_name" => "nullable|string|max:50",
            "email" => "required|email",
            "message" => "required|string",
        ],[
            'first_name.required' => 'First name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email is not a valid email',
            'message.required' => 'Message is required'
        ]);

        try {
            Mail::to($this->admin)->send(new SendContactMail($request->all()));

            return response()->json([
                "success" => true,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "error" => $e->getMessage(),
                ],
                400
            );
        }
    }
}
