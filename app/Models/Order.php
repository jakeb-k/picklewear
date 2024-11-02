<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The relationship for an orders location
     */
    public function location()
    {
        return $this->morphOne(Location::class, 'locationable');
    }

    /**
     * The relationship of an orders images
     */
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable'); 
    }

    /**
     * The relationship for the user receiving the order
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The relationship for the products of an order
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')
                    ->withPivot('quantity') 
                    ->withTimestamps(); 
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
