<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('url');
            $table->string('type')->nullable(); 
            $table->integer('delivery_date'); 
            $table->float('price');
            $table->float('discount')->nullable();
            $table->string('sku')->nullable();
            $table->text('description')->nullable();
            $table->boolean('available')->default(true); 
            $table->softDeletes(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
