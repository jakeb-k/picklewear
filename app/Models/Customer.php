<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use Billable;

    protected $fillable = [
        'email',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

}
