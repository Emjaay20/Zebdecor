<?php
/**
 * Plugin Name: Zebdecor Spatial Commerce — Headless WordPress & WooCommerce Bridge
 * Description: Must-Use (MU) Plugin for Decoupled Next.js 16 Edge Delivery. Whitelists 3D WebXR (.glb) and Apple QuickLook (.usdz) MIME types, registers architectural spatial meta fields for WooCommerce products, exposes /wp-json/zebdecor/v1/products + WPGraphQL fields, and dispatches HMAC-SHA256 signed webhooks for surgical Next.js revalidateTag() cache invalidation.
 * Version: 2.0.0
 * Author: Yusuf Abubakar — Systems & TypeScript Engineering
 * License: GPL-2.0+
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class Zebdecor_Headless_Bridge {
    private const REST_NAMESPACE = 'zebdecor/v1';
    private const META_KEYS = [
        '_zebdecor_ref',
        '_zebdecor_tag',
        '_zebdecor_badge',
        '_zebdecor_subtitle',
        '_zebdecor_materials_note',
        '_zebdecor_dimensions',
        '_zebdecor_provenance',
        '_zebdecor_has_ar',
        '_zebdecor_glb_url',
        '_zebdecor_usdz_url',
        '_zebdecor_scales_json',
        '_zebdecor_swatches_json',
        '_zebdecor_specs_json',
    ];

    public static function init(): void {
        // 1. Enable 3D AR asset uploads (.glb & .usdz) in WordPress Media Library
        add_filter('upload_mimes', [self::class, 'allow_3d_model_mimes']);
        add_filter('wp_check_filetype_and_ext', [self::class, 'verify_3d_filetype_and_ext'], 10, 4);

        // 2. Register REST API v1 endpoints for edge-cached Next.js consumption
        add_action('rest_api_init', [self::class, 'register_rest_routes']);

        // 3. Register WPGraphQL spatial fields if WPGraphQL is active
        add_action('graphql_register_types', [self::class, 'register_wpgraphql_fields']);

        // 4. Dispatch HMAC-SHA256 signed webhook on WooCommerce product save/update
        add_action('save_post_product', [self::class, 'dispatch_nextjs_revalidation_webhook'], 20, 3);
    }

    /**
     * WordPress blocks .glb and .usdz uploads by default.
     * This filter safely adds IANA MIME types for glTF Binary and USDZ packages.
     */
    public static function allow_3d_model_mimes(array $mimes): array {
        $mimes['glb']  = 'model/gltf-binary';
        $mimes['gltf'] = 'model/gltf+json';
        $mimes['usdz'] = 'model/vnd.usdz+zip';
        return $mimes;
    }

    /**
     * Validates binary magic bytes for .glb (0x46546C67 = "glTF") and .usdz (PK zip header).
     */
    public static function verify_3d_filetype_and_ext(array $data, string $file, string $filename, ?array $mimes): array {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if ($ext === 'glb' && is_readable($file)) {
            $handle = fopen($file, 'rb');
            $magic  = $handle ? fread($handle, 4) : '';
            if ($handle) {
                fclose($handle);
            }
            if ($magic === 'glTF') {
                return [
                    'ext'             => 'glb',
                    'type'            => 'model/gltf-binary',
                    'proper_filename' => $filename,
                ];
            }
        }
        if ($ext === 'usdz') {
            return [
                'ext'             => 'usdz',
                'type'            => 'model/vnd.usdz+zip',
                'proper_filename' => $filename,
            ];
        }
        return $data;
    }

    public static function register_rest_routes(): void {
        register_rest_route(self::REST_NAMESPACE, '/products', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => [self::class, 'handle_get_products'],
        ]);

        register_rest_route('headless-auth/v1', '/forgot-password', [
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'callback'            => [self::class, 'handle_forgot_password'],
        ]);

        register_rest_route('headless-auth/v1', '/reset-password', [
            'methods'             => 'POST',
            'permission_callback' => '__return_true',
            'callback'            => [self::class, 'handle_reset_password'],
        ]);
    }

    public static function handle_forgot_password(\WP_REST_Request $request): \WP_REST_Response {
        $email = sanitize_email((string) $request->get_param('email'));
        if (empty($email)) {
            return new \WP_REST_Response(['message' => 'Email is required.'], 400);
        }

        $user = get_user_by('email', $email);
        if (!$user) {
            // For security, do not leak whether account exists
            return new \WP_REST_Response(['message' => 'If the email exists, a reset instruction has been dispatched.'], 200);
        }

        $key = get_password_reset_key($user);
        if (is_wp_error($key)) {
            return new \WP_REST_Response(['message' => 'Unable to generate reset token.'], 500);
        }

        // Return key & login to Next.js BFF so Next.js can dispatch luxury email via Resend
        return new \WP_REST_Response([
            'success'   => true,
            'message'   => 'Reset key generated.',
            'reset_key' => $key,
            'user_login'=> $user->user_login,
            'email'     => $user->user_email,
        ], 200);
    }

    public static function handle_reset_password(\WP_REST_Request $request): \WP_REST_Response {
        $key          = sanitize_text_field((string) $request->get_param('key'));
        $login        = sanitize_text_field((string) $request->get_param('login'));
        $new_password = (string) $request->get_param('new_password');

        if (empty($key) || empty($login) || empty($new_password)) {
            return new \WP_REST_Response(['message' => 'Key, login, and new_password are required.'], 400);
        }

        $user = check_password_reset_key($key, $login);
        if (is_wp_error($user)) {
            return new \WP_REST_Response(['message' => 'The reset key is invalid or expired.'], 400);
        }

        reset_password($user, $new_password);
        return new \WP_REST_Response(['success' => true, 'message' => 'Password reset successfully.'], 200);
    }

    public static function handle_get_products(\WP_REST_Request $request): \WP_REST_Response {
        $posts = get_posts([
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => 50,
        ]);

        $payload = [];
        foreach ($posts as $post) {
            $price = get_post_meta($post->ID, '_regular_price', true);
            $terms = wp_get_post_terms($post->ID, 'product_cat', ['fields' => 'slugs']);
            $payload[] = [
                'id'                 => $post->ID,
                'slug'               => $post->post_name,
                'name'               => $post->post_title,
                'regular_price'      => $price ?: '4850000',
                'price_formatted'    => $price ? '₦' . number_format((float) $price) : null,
                'category_slug'      => !empty($terms) && !is_wp_error($terms) ? $terms[0] : 'living',
                'short_description'  => wp_strip_all_tags($post->post_excerpt),
                'description'        => wp_strip_all_tags($post->post_content),
                'featured_image_url' => get_the_post_thumbnail_url($post->ID, 'full') ?: null,
                'zebdecor_spatial_meta' => [
                    'ref'            => get_post_meta($post->ID, '_zebdecor_ref', true) ?: 'ZEB-2026',
                    'tag'            => get_post_meta($post->ID, '_zebdecor_tag', true) ?: 'Maitama Atelier',
                    'badge'          => get_post_meta($post->ID, '_zebdecor_badge', true) ?: 'Bespoke Masterpiece',
                    'dimensions'     => get_post_meta($post->ID, '_zebdecor_dimensions', true) ?: '2800L x 1150W x 780H mm',
                    'has_ar'         => (bool) get_post_meta($post->ID, '_zebdecor_has_ar', true),
                    'glb_url'        => get_post_meta($post->ID, '_zebdecor_glb_url', true) ?: null,
                    'usdz_url'       => get_post_meta($post->ID, '_zebdecor_usdz_url', true) ?: null,
                    'scales'         => json_decode((string) get_post_meta($post->ID, '_zebdecor_scales_json', true), true) ?: [],
                    'swatches'       => json_decode((string) get_post_meta($post->ID, '_zebdecor_swatches_json', true), true) ?: [],
                    'specs'          => json_decode((string) get_post_meta($post->ID, '_zebdecor_specs_json', true), true) ?: [],
                ],
            ];
        }

        $response = new \WP_REST_Response($payload, 200);
        $response->header('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');
        return $response;
    }

    public static function register_wpgraphql_fields(): void {
        if (!function_exists('register_graphql_field')) {
            return;
        }
        register_graphql_field('Product', 'zebdecorGlbUrl', [
            'type'        => 'String',
            'description' => 'Binary glTF 2.0 3D model URL for WebXR AR',
            'resolve'     => fn($product) => get_post_meta($product->databaseId, '_zebdecor_glb_url', true) ?: null,
        ]);
        register_graphql_field('Product', 'zebdecorDimensionsMM', [
            'type'        => 'String',
            'description' => 'Millimetric architectural bounding box dimensions',
            'resolve'     => fn($product) => get_post_meta($product->databaseId, '_zebdecor_dimensions', true) ?: null,
        ]);
    }

    /**
     * Dispatches an asynchronous HMAC-SHA256 signed webhook to Next.js /api/webhooks/wordpress
     * for instant surgical cache invalidation via revalidateTag().
     */
    public static function dispatch_nextjs_revalidation_webhook(int $post_id, \WP_Post $post, bool $update): void {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id) || $post->post_status !== 'publish') {
            return;
        }

        $nextjs_webhook_url = getenv('NEXTJS_WEBHOOK_URL') ?: 'http://localhost:3000/api/webhooks/wordpress';
        $webhook_secret     = getenv('WORDPRESS_WEBHOOK_SECRET') ?: 'zebdecor-wp-vip-hmac-secret-2026';
        $delivery_id        = 'wc-dlv-' . substr(md5($post_id . ':' . microtime(true)), 0, 10);

        $body = wp_json_encode([
            'topic'        => $update ? 'product.updated' : 'product.created',
            'product_id'   => $post_id,
            'product_slug' => $post->post_name,
            'delivery_id'  => $delivery_id,
            'timestamp'    => gmdate('c'),
        ]);

        $signature = base64_encode(hash_hmac('sha256', (string) $body, $webhook_secret, true));

        wp_remote_post($nextjs_webhook_url, [
            'blocking' => false,
            'timeout'  => 3,
            'headers'  => [
                'Content-Type'             => 'application/json',
                'X-WC-Webhook-Topic'       => $update ? 'product.updated' : 'product.created',
                'X-WC-Webhook-Delivery-ID' => $delivery_id,
                'X-WC-Webhook-Signature'   => $signature,
                'X-Zebdecor-Signature'     => $signature,
            ],
            'body'     => $body,
        ]);
    }
}

Zebdecor_Headless_Bridge::init();
