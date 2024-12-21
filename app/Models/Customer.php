<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Billable;

class Customer extends Model
{
    use Billable;

    protected $guarded = [
        'id',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

}
