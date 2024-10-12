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
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');
            $table->text('file_path');
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->timestamps();
        });

        Schema::create('imageables', function (Blueprint $table) {
            $table->foreignId('image_id')->constrained()->cascadeOnDelete();

            $table->morphs('imageable');

            $table->unique(['image_id', 'imageable_id', 'imageable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
        Schema::dropIfExists('imageables');
    }
};
