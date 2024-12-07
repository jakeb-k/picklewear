<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Tags\HasTags;

class Product extends Model
{
    use HasFactory, HasTags, SoftDeletes;

    protected $guarded = ['id']; 
    /**
     * The relationship for a products images
     */
    public function images()
    {
        return $this->morphToMany(Image::class, 'imageable');
    }

    /**
     * The relationship of orders of a product
     */
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_products')
                     ->withPivot('quantity')
                     ->withTimestamps();
    }

    /**
     * The relationship of options for a product
     */
    public function options()
    {
        return $this->hasMany(ProductOption::class, 'product_id');
    }

    /**
     * The relationship for a users location
     */
    public function location()
    {
        return $this->morphOne(Location::class, 'locationable');
    }


    
}
