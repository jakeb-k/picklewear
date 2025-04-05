<?php 

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RefreshZohoToken extends Command
{
    protected $signature = 'zoho:refresh-token';
    protected $description = 'Refresh Zoho OAuth access token using the stored refresh token';

    public function handle()
    {
        $record = DB::table('zoho_oauth_tokens')->latest()->first();

        if (!$record) {
            $this->error('No Zoho token record found.');
            return 1;
        }

        $response = Http::asForm()->post('https://accounts.zoho.com.au/oauth/v2/token', [
            'grant_type'    => 'refresh_token',
            'client_id'     => config('services.zoho.client_id'),
            'client_secret' => config('services.zoho.client_secret'),
            'refresh_token' => $record->refresh_token,
        ]);

        if ($response->failed()) {
            Log::error('Zoho token refresh failed', ['response' => $response->body()]);
            $this->error('Failed to refresh Zoho token.');
            return 1;
        }

        $data = $response->json();

        DB::table('zoho_oauth_tokens')->insert([
            'access_token' => $data['access_token'],
            'refresh_token' => $record->refresh_token, // stays the same
            'expires_in' => Carbon::now()->addSeconds($data['expires_in']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->info('Zoho access token refreshed successfully.');
        return 0;
    }
}
