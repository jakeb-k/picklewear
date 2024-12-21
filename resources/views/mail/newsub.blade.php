<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #444;
        }
        p {
            margin: 10px 0;
        }
        .message-box {
            background-color: #f1f1f1;
            border-left: 4px solid #FFD100;
            padding: 15px;
            margin: 20px 0;
            font-style: italic;
            color: #555;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class='email-container'>
        
        <h1>Welcome to Picklewear Mail List!</h1>
        <div class='message-box'>
            <p>Thank you for signing up to join our email list! We're thrilled to have you on board, and as a reward use code <b>PICKLELISCIOUS</b> for 20% off on your first order!</p>
            <br />
            <p>By subscribing, you'll be the first to know about exciting updates, exclusive offers, and the latest news from Picklewear.</p>
            <br />
            <p>We promise to keep our emails relevant and valuable to you. If there's anything you'd like to see from us, send us an email <a href="mailto:admin@picklewear.test">here</a> - we'd love to hear your thoughts!</p>
            <br />
            <p>Welcome to the community, and we're excited to stay connected.</p>
        </div>
        <p>Cheers,</p>
        <p>The Picklewear Team</p>
    </div>
    <div class='footer'>
        <a href="{{ url('/unsubscribe?email=' . urlencode($email)) }}">Unsubscribe</a>
    </div>
</body>
</html>
