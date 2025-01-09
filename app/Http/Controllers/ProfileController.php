<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\SubscriberEmail;
use App\Notifications\NewSubscriberEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'orders' => Auth::user()->orders,
            'location' => Auth::user()->locations, 
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if($request->street){
            $location = $request->user()->locations[0];
            $location->street = $request->street; 
            $location->city = $request->city; 
            $location->state = $request->state; 
            $location->postcode = $request->postcode; 
            $location->save(); 
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function admin()
    {
        if(Auth::user()->is_admin){
            return Inertia::render('Auth/AdminDashboard', [
                'orders' => Order::with(['products', 'user', 'locations', 'customer'])->orderBy('created_at', 'desc')->get(),
                'products' => Product::with(['options', 'images'])->orderBy('updated_at', 'desc')->get()
            ]);
        } else {
            return redirect()->back(); 
        }
    }
}
