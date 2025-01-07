<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = ["id"];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ["password", "remember_token"];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }
    
    /**
     * Variable that is added to model on access
     *
     * @var array
     */
    protected $appends = ['name'];

    /**
     * Accessor for the combined name attribute.
     *
     * @return string
     */
    protected function getNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * The relationship for a users orders
     *
     */
    public function orders()
    {
        return $this->hasMany(Order::class, "user_id");
    }


    /**
     * The relationship for an orders location
     */
    public function locations()
    {
        return $this->morphToMany(Location::class, 'locationable');
    }
}
