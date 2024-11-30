<?php

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

});

Route::get('/home/bestsellers', [ProductController::class, 'getBestsellers'])->name('home.bestsellers'); 
Route::get('/product/{product}', [ProductController::class, 'show'])->name('products.show'); 
Route::get('/products/search/{query}', [ProductController::class, 'search'])->name('products.search');


Route::post('/checkout', [StripeController::class, 'checkout'])->name('checkout');
Route::post('webhook',  [StripeController::class, 'webhook'])->name('webhook');
Route::get('/success',  [StripeController::class, 'success'])->name('success');

require __DIR__.'/auth.php';
