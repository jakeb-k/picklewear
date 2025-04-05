<?php

namespace App\Jobs;

use App\Services\ZohoMailerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendContactEmail implements ShouldQueue
{
    use Queueable;

    protected $data;

    protected ZohoMailerService $mailer; 
    
    /**
     * Create a new job instance.
     */
    public function __construct($data)
    {
        $this->mailer = new ZohoMailerService(); 
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $htmlBody = view("mail.contact", ['data' => $this->data])->render();
    
        $subject = "You have a new Enquiry";
        $result = $this->mailer->sendMail('admin@picklewear.com.au', $subject, $htmlBody, null);
    }
}
