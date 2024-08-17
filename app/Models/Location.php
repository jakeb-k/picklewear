<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    /**
     * Define the polymorphic relationship of an location
     */
    public function locationable()
    {
        return $this->morphTo();
    }
}
