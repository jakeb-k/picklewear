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
            color: #555;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
        .product-box {
            display:flex;
            flex-direction:row; 
            align-items: center;
            border-bottom:1px solid #ddd; 
            margin: 20px 0;
            padding: 8px;
        }
        .product-box img {
            height:auto;
            width: 200px; 
            margin-top: auto;
            margin-right:20px; 
            border-radius:8px; 
        }
        .flex {
            display:flex;
            flex-direction:row; 
            align-items: center;
        }
        .link-btn {
            padding:8px 5px; 
            background-color: #FFD100;
            color: #000;
            margin:20px; 
            border:1px solid black; 
            text-decoration: none;
            border-radius: 5px;
        }
        .link-btn:hover{
            background-color:black;
            color:#FFD100;
            transition:all;
            animation-duration: 150ms;
            transition-timing-function: ease-in-out; 
        }
    </style>
</head>
<body>
    <article class="email-container">
        <h1>Your order has now been completed!</h1>
        <section class='message-box'>
            <h3>Order Details: {{$order->code}} | {{$date}}</h3>
            <p><strong>Recipient:</strong> {{ $order->customer->first_name }} {{ $order->customer->last_name }}</p>
            <p><strong>Email:</strong> {{ $order->customer->email }}</p>
            <p><strong>Delivery Address:</strong> {{ $address }}</p>
            <p><strong>Total:</strong> ${{ $order->total }}</p>
            <p>If your order's gone more out of bounds than your last pickleball serve, hit us up at <a href="mailto:admin@pickleball.com">here</a> - we'll rally back with help, no paddle required.</p>
        </section>
        <div class='flex'>
            <h3>Items: </h3>
            <a href="{{$link}}" class="link-btn">View Order</a>
        </div>
        @foreach($order->products as $product)
            <section class='product-box'>
                @if(!empty($product->images) && isset($product->images[0]))
                    <div>
                        <img src="{{ $product->images[0]->file_path }}" alt="{{ $product->name }}" style="height:auto; width: 200px; border:1px solid #FFD100; margin-top: auto; ">
                    </div>
                @else
                    <div>
                        <img src="{{ asset('images/no-image.png') }}" alt="{{ $product->name }}" style=" ">
                    </div>
                @endif 
                <div>
                    <p><strong>Product:</strong> {{ $product->name }}</p>
                    <p><strong>Price:</strong> ${{ $product->price }}</p>
                    <div class='flex'>
                        <p style="margin-right:10px;"><strong>Quantity:</strong> {{ $product->pivot->quantity }}</p>
                        <p><strong>Color:</strong> {{ $product->pivot->color ?? "-" }}</p>
                    </div>
                    <p><strong>Subtotal:</strong> ${{ $product->pivot->quantity * $product->price }}</p>
                </div>
            </section>
        @endforeach
        <div class="footer">
            <p>This email was automatically generated by {{ config('app.name') }}.</p>
        </div>
    </article>
</body>
</html>
