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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('street');
            $table->string('city');
            $table->enum('state',['QLD','NSW','VIC','ACT','SA','WA','NT','TAS']);
            $table->integer('postcode');
            $table->string('country')->nullable(); 
            $table->timestamps();
        });

        Schema::create('locationables', function (Blueprint $table) {
            $table->foreignId('location_id')->constrained()->cascadeOnDelete();

            $table->morphs('locationable');

            $table->unique(['location_id', 'locationable_id', 'locationable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
