<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

     /**
     * Define the relationship with the Order.
     */
    public function order()
    {
        return $this->morphedByOne(Order::class, 'locationable');
    }
}
