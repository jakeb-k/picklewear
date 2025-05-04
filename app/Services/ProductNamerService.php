<?php

namespace App\Services;

use OpenAI;

class ProductNamerService
{
    protected $client;

    public function __construct()
    {
        $this->client = OpenAI::client(config("services.openai.api_key"));
    }

    public function renameProduct(string $title): array
    {
        $response = $this->client->chat()->create([
            "model" => "gpt-4o",
            "messages" => [
                [
                    "role" => "system",
                    "content" => "You are a branding expert. Respond ONLY in the following format with no additional text:
        
        title: <A catchy product name, 3-5 words maximum, summarising the product essence, ensure to take words only from the given title to use as the new title.>
        description: <3-4 sentence description, a pickleball related pun would be good, use the provided title to generate the description, ensuring the description matches whats in the provided string.>",
                ],
                [
                    "role" => "user",
                    "content" => "Rewrite this product title: {$title}",
                ],
            ],
        ]);
        $raw = $response["choices"][0]["message"]["content"];

        preg_match('/title:\s*(.+)\ndescription:\s*(.+)/i', $raw, $matches);

        return [
            "title" => $matches[1] ?? null,
            "description" => $matches[2] ?? null,
        ];
    }
}
