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
        $this->accountId = config('services.zoho.account_id');
    }

    
    protected function fetchToken(): string
    {
        return DB::table('zoho_oauth_tokens')->latest()->value('access_token') ?? '';
    }


    public function sendMail(string $to, string $subject, string $html): bool|string
    {
        $this->token = $this->fetchToken();

        $url = "https://mail.zoho.com.au/api/accounts/{$this->accountId}/messages";

        $payload = [
            'fromAddress' => 'admin@picklewear.com.au',
            'toAddress'   => $to,
            'subject'     => $subject,
            'content'     => $html,
            'askReceipt'  => 'no',
        ];
        //Log::info(json_encode($payload));

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
