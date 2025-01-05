<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $guarded = ['id']; 

    /**
     *A Location is morphed by many orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function order()
    {
        return $this->morphedByMany(Order::class, 'locationable');
    }

    /**
     * A Location is morphed by many customers
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function customer()
    {
        return $this->morphedByMany(Order::class, 'locationable');
    }

}
