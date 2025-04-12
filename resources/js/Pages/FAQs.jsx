import { Head } from "@inertiajs/react";
import ContactForm from "@/Components/ContactForm";
export default function FAQs() {
    return (
        <article id="faqs" className="lg:m-24 m-4 bg-white lg:p-12 p-6 space-y-8 rounded-lg mt-32">
            <Head title="FAQs" />
            <h1>Frequently Asked Questions</h1>
            <p className='text-lg'>
                Welcome to our FAQs! You've got questions and we've got answers
                (and a few serves).{" "}
            </p>
            <hr />
            <section id="shipping" className="space-y-4 py-4">
                <h2>Shipping - How soon will my gear arrive?</h2>
                <p className='text-lg'>
                    We know you can't wait to smash your opponents in style. Our
                    shipping is faster than your pickleball serve (usually).
                </p>
                <p className="text-lg"> Orders are dispatched within <b>1-2 business days</b>, and delivery
                times vary depending on your location.{" "}</p>
                <p className='text-lg'>
                    Once your order is processed, you will be sent a tracking
                    link - so you can stalk your pickleball threads like a hawk
                </p>
            </section>

            <hr />
            <section id="returns" className="space-y-4 py-4">
                <h2>Returns - What if I change my mind?</h2>
                <p className='text-lg'>
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
                <p className='text-lg'>
                    Refunds are processed faster than a dink once we receive
                    your return. Drop us a message at <a href="mailto:admin@picklewear.com.au">admin@picklewear.com.au</a> before sending anything back,
                    so we're ready for the rally!
                </p>
            </section>
            <hr />
            <section id="privacy" className="space-y-4 py-4">
                <h2>Privacy Policy - What are you doing with my info?</h2>
                <p className='text-lg'>
                    Relax, champ - we play fair. Your data is safe and sound:
                </p>
                <ul>
                    <li>
                        We'll <b>never</b> share your details (except with our delivery pros)
                    </li>
                    <li>
                        Emails? Only the good kind: deals, updates and exclusive pickleball secrets. ONLY if you sign up at the <a href="#footer">bottom</a> of our site
                    </li>
                    <li>
                        Payment info? Encrypted tighter than a tournament tie-breaker, thanks to Stripe - the GOAT of secure payments.
                    </li>
                </ul>
                <p className='text-lg'>
                    No spam, no nonsense, just great pickleball vibes.
                </p>
            </section>
            <hr />
            <section className="space-y-4 py-4">
                <h2>Contact Us - How do I yell at you (nicely)?</h2>
                <p className='text-lg'>Got a question, praise or gripe? Drop us a line!</p>
                <ul>
                    <li><b>Email:</b> <a href="mailto:admin@picklewear.com.au">admin@picklewear.com.au</a></li>
                    <li><b>Carrier Pigeon:</b> <i>Only if it's wearing tiny pickleball shorts.</i></li>
                </ul>
                <p className='text-lg'>We're here Monday-Friday 9am-5pm AEST. If we're slow to reply, we're probably busy perfecting our backhand</p>
            </section>
            <hr />
            <section className="space-y-4 py-4">
                <h2>Sizing - Will it fit?</h2>
                <p className='text-lg'>Our gear is tailored for champions, but not all champions are the same size. We provide a variety of sizes when you select an item, which match the standard conventions. If you're still unsure, go one size up - better to be loose than lose!
                </p>
            </section>
            <hr />
            <section className="space-y-4 py-4">
                <h2>Care Instructions - How do I make it last?</h2>
                <p className='text-lg'>Treat your pickleball gear with love:</p>
                <ul>
                    <li>Wash cold (no saunas)</li>
                    <li>Air dry like your best lobs.</li>
                    <li>Avoid ironing - let those wrinkles tell the story of your epic matches</li>
                </ul>
            </section>
            <hr />
            <section className="space-y-4 py-4">
                <h2>Other Questions?</h2>
                <p className='text-lg'>If your question isn't here, it's probably out-of-bounds. Send it to us below, and we'll hit you back with an answer. 
                </p>
                <p className="text-xl"> Remember: <b>No question is too silly the world of pickleball</b></p>
            </section>
            <ContactForm /> 
        </article>
    );
}
