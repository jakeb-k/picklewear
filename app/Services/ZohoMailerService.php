<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ZohoMailerService
{
    protected string $token;
    protected string $accountId;

    public function __construct()
    {
        $this->token = DB::table('zoho_tokens')->latest()->value('access_token');
        $this->accountId = config('services.zoho.account_id');
    }

    public function sendMail(string $to, string $subject, string $html): bool|string
    {
        $url = "https://mail.zoho.com.au/api/accounts/{$this->accountId}/messages";

        $payload = [
            'fromAddress' => 'admin@picklewear.com.au',
            'toAddress'   => $to,
            'subject'     => $subject,
            'content'     => $html,
            'contentType' => 'html',
        ];

        $response = Http::withToken($this->token)
            ->post($url, $payload);

        if ($response->failed()) {
            Log::error('Zoho API sendMail failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return $response->body();
        }

        return true;
    }
}
