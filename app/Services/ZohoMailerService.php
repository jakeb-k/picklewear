<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class ZohoMailerService
{
    protected PHPMailer $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->configure();
    }

    protected function configure(): void
    {
        $this->mail->isSMTP();
        $this->mail->Host       = 'smtp.zoho.com.au';
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = 'admin@picklewear.com.au';
        $this->mail->Password   = env("ZOHO_MAIL_PASSWORD");
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $this->mail->Port       = 465;
        $this->mail->isHTML(true);
        $this->mail->setFrom('admin@picklewear.com.au', 'Admin');
    }

    public function sendMail(string $to, string $subject, string $body, ?string $altBody = null): bool|string
    {
        try {
            $this->mail->clearAllRecipients();
            $this->mail->addAddress($to);
            $this->mail->Subject = $subject;
            $this->mail->Body    = $body;
            $this->mail->AltBody = $altBody ?? strip_tags($body);
            $this->mail->send();
            return true;
        } catch (Exception $e) {
            return $this->mail->ErrorInfo;
        }
    }
}
