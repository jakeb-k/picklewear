<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'mobile' => '412345678',
                'email' => 'test@example.com',
                'street' => '123 Main St',
                'city' => 'Anytown',
                'state' => 'QLD',
                'postcode' => '4221',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'mobile' => '412345678',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }

    public function test_admin_user_can_access_admin_dashboard()
    {
        // Arrange: Create an admin user and log them in
        $adminUser = User::factory()->create(["is_admin" => true]);
        $adminUser->assignRole(Role::create(["name" => "admin"]));

        // Create some sample orders and products
        Order::factory(3)->create();
        Product::factory(5)->create();

        
        /** @var \App\Models\User $adminUser */
        $this->actingAs($adminUser);

        // Act: Make a GET request to the admin dashboard
        $response = $this->get(route('admin.dashboard'));

        // Assert: Ensure the response is successful and the correct Inertia component is rendered
        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Auth/AdminDashboard')
                ->has('orders')
                ->has('products')
            );
    }

    public function test_non_admin_user_cannot_access_admin_dashboard()
    {
        // Arrange: Create a non-admin user and log them in
        $nonAdminUser = User::factory()->create(["is_admin" => false]);
        /** @var \App\Models\User $nonAdminUser */
        $this->actingAs($nonAdminUser);

        // Act: Attempt to access the admin dashboard
        $response = $this->get(route('admin.dashboard'));

        // Assert: Ensure the user is redirected back
        $response->assertStatus(403); // Redirect status code
    }
}
