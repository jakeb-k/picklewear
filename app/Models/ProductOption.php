<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductOption extends Model
{
    use HasFactory;

    protected $guarded = ['id']; 
    /**
     * The relationship for the options of a product
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
