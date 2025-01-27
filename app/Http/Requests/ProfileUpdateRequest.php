<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'mobile'=>  ['required', 'regex:/^(?:\+61|0)4\d{8}$/', 'numeric'], 
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            "street" => "nullable|string",
            "city" => "nullable|string",
            "state" => "nullable|string|in:NSW,QLD,SA,TAS,VIC,WA,ACT,NT",
            "postcode" => "nullable|numeric|digits:4",
            "mobile" => ["required", 'regex:/^[2-478](?:[ -]?[0-9]){8}$/'],
        ];
    }
}
