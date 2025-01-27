<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Billable;

class Customer extends Model
{
    use Billable, HasFactory;

    protected $guarded = [
        'id',
    ];

    /**
     * A customer can have many orders
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * A customer can morph to many locations
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function locations()
    {
        return $this->morphToMany(Location::class, 'locationable');
    }


}
