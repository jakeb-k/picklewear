<?php

use App\Http\Controllers\MailController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('index');

Route::get('/dashboard', function () {
    return redirect()->route('index'); 
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['role:admin', 'auth'])->group(function () {
    Route::get('/admin', [ProfileController::class, 'admin'])->name('admin.dashboard'); 
    Route::post('/product/{product}/available', [ProductController::class, 'setAvailable'])->name('product.available'); 
    Route::delete('/product/{product}/delete', [ProductController::class, 'destroy'])->name('product.destroy'); 
    Route::put('/product/{product}/update', [ProductController::class, 'update'])->name('product.update'); 
    Route::post('/product/store', [ProductController::class, 'store'])->name('product.store'); 
});

Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show'); 
Route::get('/home/bestsellers', [ProductController::class, 'getBestsellers'])->name('home.bestsellers'); 
Route::get('/product/{product}', [ProductController::class, 'show'])->name('products.show'); 
Route::get('/products/search/{query}', [ProductController::class, 'search'])->name('products.search');
Route::get('/products/{type}', [ProductController::class, 'index'])->name('products.index');
Route::get('/faqs', function(){
    return Inertia::render('FAQs',[]); 
});

Route::get('/checkout', [StripeController::class, 'checkoutShow'])->name('checkout.show'); 
Route::post('/checkout', [StripeController::class, 'checkout'])->name('checkout.store');
Route::post('webhook',  [StripeController::class, 'webhook'])->name('webhook');
Route::get('/success',  [StripeController::class, 'success'])->name('success');

Route::post('/contact/email', [MailController::class, 'sendContactEmail'])->name('contact.email'); 
Route::get('/unsubscribe', [MailController::class, 'unsubscribe'])->name('unsubscribe.email');
Route::post('/email/subscribe', [MailController::class, 'subscribe' ])->name('subscribe.email');

require __DIR__.'/auth.php';
