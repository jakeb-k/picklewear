<?php

namespace App\Jobs;

use App\Services\ZohoMailerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendSubscribersWelcomeEmail implements ShouldQueue
{
    use Queueable;

    protected $email;

    protected ZohoMailerService $mailer; 
    
    /**
     * Create a new job instance.
     */
    public function __construct($email)
    {
        $this->mailer = new ZohoMailerService(); 
        $this->email = $email;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $html = view("mail.newsub", ['email' => $this->email])->render();
        $subject = "Welcome to Picklewear Mail List";
        $this->mailer->sendMail($this->email, $subject, $html);
    }
}
