<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $guarded = []; 

    use HasFactory;

    /**
     * Define the polymorphic relationship of an image
     */
    public function products()
    {
        return $this->morphedByMany(Product::class, 'imageable');
    }
}
