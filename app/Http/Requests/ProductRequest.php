<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "images.*" => "required|file|mimes:jpeg,png,jpg|max:10240",
            "name" => "required|string|max:100",
            "type" => "required|array|min:1",
            'category' => 'required|array|min:1',
            "url" => "required",
            "delivery_date" => "numeric|required",
            "price" => "numeric|required|min:0",
            "discount" => "numeric|nullable|min:0|max:100",
            "description" => "required",
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            "images.*.required" => "Each image is required.",
            "images.*.file" => "Each image must be a valid file.",
            "images.*.mimes" => "Each image must be a file of type: jpeg, png, jpg.",
            "images.*.max" => "Each image must not exceed 2MB in size.",
            "name.required" => "The product name is required.",
            "name.string" => "The product name must be a valid string.",
            "name.max" => "The product name must not exceed 100 characters.",
            "type.required" => "The product type is required.",
            "category.required" => "The product category is required.",           
            "type.min" => "The product type must have at least one item selected.",
            "category.min" => "The product category must have at least one item selected..",
            "url.required" => "The product URL is required.",
            "delivery_date.numeric" => "The delivery date must be a number.",
            "delivery_date.required" => "The delivery date is required.",
            "price.numeric" => "The price must be a numeric value.",
            "price.required" => "The price is required.",
            "price.min" => "The price must be at least 0.",
            "discount.numeric" => "The discount must be a numeric value.",
            "discount.min" => "The discount must be at least 0%.",
            "discount.max" => "The discount must not exceed 100%.",
            "description.required" => "The product description is required.",
        ];
    }
}
