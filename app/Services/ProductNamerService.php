<?php

namespace App\Services;

use OpenAI;

class ProductNamerService
{
    protected $client;

    public function __construct()
    {
        $this->client = OpenAI::client(config('services.openai.api_key'));
    }

    public function renameProduct(string $title): array
    {
        $response = $this->client->chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a branding expert. Respond only in this format: 
                    title: <product name>
                    description: <1-2 sentence Gen Z-style description>.'
                ],
                [
                    'role' => 'user',
                    'content' => "Rewrite this product title: {$title}",
                ],
            ],
        ]);
    
        $raw = $response['choices'][0]['message']['content'];
    
        preg_match('/title:\s*(.+)\ndescription:\s*(.+)/i', $raw, $matches);
    
        return [
            'title' => $matches[1] ?? null,
            'description' => $matches[2] ?? null,
        ];
    }
    
}