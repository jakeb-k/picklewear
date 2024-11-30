import { Head } from "@inertiajs/react";

export default function FAQs() {
    return (
        <article className="flex flex-col justify-center text-center min-h-screen">
            <Head title="FAQs" />
            <h1>Frequently Asked Questions</h1>
            <p>
                Welcome to our FAQs! You've got questions and we've gpt amswers
                (and a few serves).{" "}
            </p>
            <section>
                <h2>Shipping - How soon will my gear arrive?</h2>
                <p>
                    We know you can't wait to smash your opponents in style. Our
                    shipping is faster than your pickleball serve (usually).
                    Orders are dispatched within 1-2 business days, and delivery
                    times vary depending on your location.{" "}
                </p>
                <p>
                    Once your order is processed, you will be sent a tracking
                    link - so you can stalk your pickleball threads like a hawk
                </p>
            </section>

            <section>
                <h2>Returns - What if I change my mind?</h2>
                <p>
                    Changed your mind or ordered pickleball socks instead of a
                    shirt? No worries! We've got a 30-day return policy. Here's
                    the deal:
                </p>
                <ul>
                    <li>
                        If an item arrives in a damaged condition, or isn't to
                        your liking you can send it back for a refund.
                    </li>
                    <li>
                        Items must be unword, unwashed and ready to play again.
                    </li>
                    <li>
                        You cover the return shipping (we're players not
                        magicians)
                    </li>
                </ul>
                <p>
                    Refunds are processed faster than a dink once we receive
                    your return. Drop us a message at <a href="mailto:admin@picklewear.com.au">admin@picklewear.com.au</a> before sending anything back,
                    so we're ready for the rally!
                </p>
            </section>
            <section>
                <h2>Contact Us - How do I yell at you (nicely)?</h2>
                <p>Got a question, praise or gripe? Drop us a line!</p>
                <ul>
                    <li><b>Email:</b> <a href="mailto:admin@picklewear.com.au">admin@picklewear.com.au</a></li>
                    <li><b>Carrier Pigeon:</b> <i>Only if it's wearing tiny pickleball shorts.</i></li>
                </ul>
                <p>We're here Monday-Friday 9am-5pm AEST. If we're slow to reply, we're probably busy perfecting our backhand</p>
            </section>
            <section>
                <h2>Sizing - Will it fit?</h2>
                <p>Our gear is tailored for champions, but not all champions are the same size. We provide a variety of sizes when you select an item, which match the standard conventions. If you're still unsure, go one size up - better to be loose than lose!
                </p>
            </section>
            <section>
                <h2>Care Instructions - How do I make it last?</h2>
                <p>Treat your pickleball gear with love:</p>
                <ul>
                    <li>Wash cold (no saunas)</li>
                    <li>Air dry like your best lobs.</li>
                    <li>Avoid ironing - let those wrinkles tell the story of your epic matches</li>
                </ul>
            </section>
            <section>
                <h2>Other Questions?</h2>
                <p>If your question isn't here, it's probably out-of-bounds. Send it to us below, and we'll hit you back with an answer. Remeber: <b>No question is too silly the world of pickleball</b></p>
            </section>
        </article>
    );
}
