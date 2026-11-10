<?php
/**
 * Plugin Name: Fiona Content Manager
 * Description: Dịch vụ có dữ liệu cấu trúc, biên tập bằng block và dashboard Fiona. Bản nền tảng local.
 * Version: 0.1.0
 */
if (!defined('ABSPATH')) { exit; }

add_action('init', function () {
    register_post_type('fiona_service', [
        'labels' => ['name' => 'Dịch vụ Fiona', 'singular_name' => 'Dịch vụ', 'add_new_item' => 'Thêm dịch vụ', 'edit_item' => 'Biên tập dịch vụ'],
        'public' => true, 'show_in_rest' => true, 'menu_icon' => 'dashicons-palmtree',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'],
        'rewrite' => ['slug' => 'services', 'with_front' => false], 'has_archive' => false,
    ]);
    register_taxonomy('fiona_service_category', 'fiona_service', [
        'labels' => ['name' => 'Nhóm dịch vụ', 'singular_name' => 'Nhóm dịch vụ'],
        'public' => false, 'show_ui' => true, 'show_in_rest' => true, 'hierarchical' => true,
    ]);
    register_post_type('fiona_booking', [
        'labels' => ['name' => 'Yêu cầu đặt lịch', 'singular_name' => 'Yêu cầu đặt lịch'],
        'public' => false, 'publicly_queryable' => false, 'show_ui' => true, 'show_in_rest' => false,
        'exclude_from_search' => true, 'menu_icon' => 'dashicons-calendar-alt',
        'supports' => ['title'], 'capability_type' => 'post', 'map_meta_cap' => true,
        'capabilities' => ['create_posts' => 'do_not_allow'],
    ]);
    register_post_type('fiona_package', [
        'labels' => ['name' => 'Combo Fiona', 'singular_name' => 'Combo'], 'public' => true, 'show_in_rest' => true,
        'menu_icon' => 'dashicons-tickets-alt', 'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
        'rewrite' => ['slug' => 'packages', 'with_front' => false],
    ]);
    register_post_meta('fiona_service', '_fiona_shared', [
        'type' => 'object', 'single' => true, 'show_in_rest' => false,
        'auth_callback' => function () { return current_user_can('edit_posts'); },
    ]);
    register_block_pattern('fiona/service-story', [
        'title' => 'Fiona — Nội dung dịch vụ', 'description' => 'Khối biên tập có sẵn: giới thiệu, hình ảnh, quy trình, lưu ý và câu hỏi thường gặp.',
        'categories' => ['text'],
        'content' => '<!-- wp:heading --><h2 class="wp-block-heading">Trải nghiệm dịch vụ</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Viết phần giới thiệu thực tế của Fiona tại đây.</p><!-- /wp:paragraph --><!-- wp:image --><figure class="wp-block-image"><img alt=""/></figure><!-- /wp:image --><!-- wp:heading --><h2 class="wp-block-heading">Quy trình</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Thêm các bước phục vụ đã được spa xác nhận.</p><!-- /wp:paragraph --><!-- wp:heading --><h2 class="wp-block-heading">Lưu ý trước khi đặt lịch</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Thêm lưu ý đã được spa xác nhận.</p><!-- /wp:paragraph --><!-- wp:heading --><h2 class="wp-block-heading">Câu hỏi thường gặp</h2><!-- /wp:heading --><!-- wp:details --><details class="wp-block-details"><summary>Nhập câu hỏi</summary><!-- wp:paragraph --><p>Nhập câu trả lời.</p><!-- /wp:paragraph --></details><!-- /wp:details -->',
    ]);
});
add_filter('pll_get_post_types', function ($types) { $types['fiona_service'] = 'fiona_service'; return $types; });
add_filter('pll_get_post_types', function ($types) { $types['fiona_package'] = 'fiona_package'; return $types; });
add_filter('pll_get_taxonomies', function ($types) { $types['fiona_service_category'] = 'fiona_service_category'; return $types; });

add_action('admin_menu', function () {
    add_menu_page('Fiona CMS', 'Fiona CMS', 'edit_posts', 'fiona-cms', 'fiona_dashboard', 'dashicons-admin-home', 3);
});
function fiona_dashboard() {
    if (!current_user_can('edit_posts')) { return; }
    $service_count = wp_count_posts('fiona_service');
    echo '<div class="wrap"><h1>Fiona — Quản trị nội dung</h1><p>Giai đoạn 1: chuẩn bị CMS trước, triển khai frontend sau. Nội dung mẫu chưa phải menu kinh doanh.</p>';
    echo '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;max-width:1100px">';
    $cards = [
        ['Dịch vụ', 'edit.php?post_type=fiona_service', 'Tên, mô tả, thời lượng, giá, bộ ảnh và nội dung bằng các khối.'],
        ['Combo trải nghiệm', 'edit.php?post_type=fiona_package', 'Tên, nội dung và giá các gói trải nghiệm Fiona.'],
        ['Bài viết', 'edit.php', 'Viết bài có heading, ảnh, liên kết và xem trước bằng trình soạn thảo WordPress.'],
        ['Trang nội dung', 'edit.php?post_type=page', 'Giới thiệu, liên hệ và các trang nền tảng.'],
        ['Tiếng Anh / Tiếng Việt', 'admin.php?page=mlang', 'Quản lý các bản dịch liên kết với nhau.'],
        ['Thư viện ảnh', 'upload.php', 'Tải ảnh và sửa alt, chú thích, tiêu đề.'],
        ['Yêu cầu đặt lịch', 'edit.php?post_type=fiona_booking', 'Xem yêu cầu từ form, thông tin khách và cập nhật trạng thái xác nhận.'],
    ];
    foreach ($cards as $card) {
        echo '<section style="background:white;border:1px solid #ddd;border-radius:8px;padding:22px"><h2 style="margin-top:0">' . esc_html($card[0]) . '</h2><p>' . esc_html($card[2]) . '</p><a class="button button-primary" href="' . esc_url(admin_url($card[1])) . '">Mở quản trị</a></section>';
    }
    echo '</div><h2>Thử trước khi thiết kế giao diện</h2><ol><li>Mở một dịch vụ mẫu ở dạng bản nháp.</li><li>Sửa nội dung bằng các khối có sẵn.</li><li>Điền thời lượng và giá ở phần “Thông tin dịch vụ”.</li><li>Lưu nháp, xem trước; thử bản tiếng Anh / tiếng Việt.</li></ol><p><strong>Chưa hoàn thành:</strong> frontend Fiona, form đặt lịch, thông báo, tracking, SEO production và chuyển dữ liệu thật.</p></div>';
}
add_action('wp_dashboard_setup', function () { wp_add_dashboard_widget('fiona_welcome', 'Fiona — Bắt đầu', function () {
    echo '<p>WordPress thử nghiệm riêng cho Fiona. Bắt đầu ở <a href="' . esc_url(admin_url('admin.php?page=fiona-cms')) . '">Fiona CMS</a>.</p>';
}); });

add_action('add_meta_boxes_fiona_service', function () {
    add_meta_box('fiona-service-data', 'Thông tin dịch vụ — dữ liệu dùng chung Anh / Việt', 'fiona_service_fields', 'fiona_service', 'normal', 'high');
});
function fiona_service_fields($post) {
    $data = get_post_meta($post->ID, '_fiona_shared', true);
    $data = is_array($data) ? $data : [];
    wp_nonce_field('fiona_service_save', 'fiona_service_nonce');
    echo '<p>Giá và thời lượng được đồng bộ giữa các bản dịch đã liên kết. Mô tả dài được viết bằng các khối ở phía trên. Chưa nhập giá thật nếu chưa kiểm tra menu.</p>';
    echo '<p><label><input type="checkbox" name="fiona_featured" value="1" ' . checked(!empty($data['featured']), true, false) . '> Dịch vụ nổi bật</label></p>';
    echo '<p><label>Trạng thái phục vụ <select name="fiona_availability"><option value="available" ' . selected($data['availability'] ?? '', 'available', false) . '>Đang phục vụ</option><option value="paused" ' . selected($data['availability'] ?? '', 'paused', false) . '>Tạm dừng — giữ trang</option></select></label></p>';
    echo '<p><label>Video URL <input class="widefat" type="url" name="fiona_video" value="' . esc_attr($data['video'] ?? '') . '" placeholder="https://..."></label></p>';
    echo '<h4>Các lựa chọn thời lượng và giá VND</h4><table class="widefat" id="fiona-prices"><thead><tr><th>Phút</th><th>Giá VND (số nguyên)</th><th></th></tr></thead><tbody>';
    $prices = !empty($data['prices']) ? $data['prices'] : [['minutes' => '', 'price' => '']];
    foreach ($prices as $row) { fiona_price_row($row); }
    echo '</tbody></table><p><button type="button" class="button" id="fiona-add-price">Thêm lựa chọn</button></p>';
    echo '<p><label>Giá từ (khi dịch vụ không có thời lượng cố định) <input type="number" min="1" step="1" name="fiona_price_from" value="' . esc_attr($data['priceFrom'] ?? '') . '"></label></p>';
    $variant_lines = []; foreach (($data['variants'] ?? []) as $v) { $variant_lines[] = ($v['vi'] ?? '') . ' | ' . ($v['en'] ?? '') . ' | ' . ($v['price'] ?? ''); }
    echo '<p><label>Bảng giá theo lựa chọn: mỗi dòng theo mẫu <code>Tên tiếng Việt | Tên tiếng Anh | Giá VND</code><textarea class="widefat" rows="8" name="fiona_variants">' . esc_textarea(implode("\n", $variant_lines)) . '</textarea></label></p>';
    echo '<p><label>Ảnh gallery (chọn ảnh trong thư viện)</label><br><input type="hidden" id="fiona-gallery-ids" name="fiona_gallery" value="' . esc_attr(implode(',', $data['gallery'] ?? [])) . '"><button type="button" class="button" id="fiona-gallery">Chọn ảnh</button> <span id="fiona-gallery-count">' . count($data['gallery'] ?? []) . ' ảnh</span></p>';
    echo '<p><label>SEO title cho ngôn ngữ hiện tại <input class="widefat" name="fiona_seo_title" value="' . esc_attr(get_post_meta($post->ID, '_fiona_seo_title', true)) . '"></label></p>';
    echo '<p><label>Meta description cho ngôn ngữ hiện tại <textarea class="widefat" rows="3" name="fiona_seo_description">' . esc_textarea(get_post_meta($post->ID, '_fiona_seo_description', true)) . '</textarea></label></p>';
    echo '<p><em>Các trường SEO hiện được lưu để chuẩn bị frontend, chưa có tích hợp SEO production.</em></p>';
}
function fiona_price_row($row) {
    echo '<tr><td><input type="number" name="fiona_minutes[]" min="1" max="480" step="1" value="' . esc_attr($row['minutes']) . '"></td><td><input type="number" name="fiona_price[]" min="1" step="1" value="' . esc_attr($row['price']) . '"></td><td><button type="button" class="button fiona-remove-price">Xóa dòng</button></td></tr>';
}
add_action('admin_enqueue_scripts', function ($hook) {
    $screen = get_current_screen();
    if (!$screen || $screen->post_type !== 'fiona_service' || !in_array($hook, ['post.php', 'post-new.php'], true)) { return; }
    wp_enqueue_media();
    wp_enqueue_script('fiona-service-editor', plugins_url('editor.js', __FILE__), ['jquery'], '0.1.0', true);
});
add_action('save_post_fiona_service', function ($post_id) {
    if (empty($_POST['fiona_service_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['fiona_service_nonce'])), 'fiona_service_save')) { return; }
    if (!current_user_can('edit_post', $post_id) || wp_is_post_revision($post_id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)) { return; }
    $prices = []; $valid = true; $seen = [];
    $minutes = (array) ($_POST['fiona_minutes'] ?? []); $values = (array) ($_POST['fiona_price'] ?? []);
    foreach ($minutes as $i => $minute) {
        $price = $values[$i] ?? '';
        if ($minute === '' && $price === '') { continue; }
        if (!is_scalar($minute) || !is_scalar($price) || !ctype_digit((string) $minute) || !ctype_digit((string) $price)) { $valid = false; break; }
        $minute = (int) $minute; $price = (int) $price;
        if ($minute < 1 || $minute > 480 || $price < 1 || $price > 100000000 || isset($seen[$minute])) { $valid = false; break; }
        $seen[$minute] = true; $prices[] = ['minutes' => $minute, 'price' => $price];
    }
    if (!$valid) { set_transient('fiona_invalid_' . get_current_user_id(), 1, 60); return; }
    $gallery = array_values(array_filter(array_map('absint', explode(',', sanitize_text_field(wp_unslash($_POST['fiona_gallery'] ?? '')))), function ($id) { return wp_attachment_is_image($id); }));
    $shared = [
        'featured' => !empty($_POST['fiona_featured']),
        'availability' => ($_POST['fiona_availability'] ?? '') === 'paused' ? 'paused' : 'available',
        'prices' => $prices, 'gallery' => $gallery,
        'video' => esc_url_raw(wp_unslash($_POST['fiona_video'] ?? '')),
    ];
    $variants = []; $variant_text = sanitize_textarea_field(wp_unslash($_POST['fiona_variants'] ?? ''));
    foreach (preg_split('/\R/u', $variant_text) as $line) { if (trim($line) === '') continue; $parts = array_map('trim', explode('|', $line)); if (count($parts) !== 3 || !$parts[0] || !$parts[1] || !ctype_digit($parts[2]) || (int)$parts[2] < 1 || (int)$parts[2] > 100000000) { set_transient('fiona_invalid_' . get_current_user_id(), 1, 60); return; } $variants[] = ['vi'=>$parts[0], 'en'=>$parts[1], 'price'=>(int)$parts[2]]; }
    if ($variants) $shared['variants'] = $variants;
    $price_from = $_POST['fiona_price_from'] ?? '';
    if ($price_from !== '') {
        if (!is_scalar($price_from) || !ctype_digit((string) $price_from) || (int) $price_from < 1 || (int) $price_from > 100000000) { set_transient('fiona_invalid_' . get_current_user_id(), 1, 60); return; }
        $shared['priceFrom'] = (int) $price_from;
    }
    $translations = function_exists('pll_get_post_translations') ? pll_get_post_translations($post_id) : [];
    $ids = array_unique(array_merge([$post_id], array_values($translations)));
    foreach ($ids as $id) { if (current_user_can('edit_post', $id)) { update_post_meta($id, '_fiona_shared', $shared); } }
    update_post_meta($post_id, '_fiona_seo_title', sanitize_text_field(wp_unslash($_POST['fiona_seo_title'] ?? '')));
    update_post_meta($post_id, '_fiona_seo_description', sanitize_textarea_field(wp_unslash($_POST['fiona_seo_description'] ?? '')));
});
add_action('admin_notices', function () {
    $key = 'fiona_invalid_' . get_current_user_id();
    if (get_transient($key)) { delete_transient($key); echo '<div class="notice notice-error"><p>Chưa lưu thông tin dịch vụ: thời lượng/giá phải là số nguyên dương hợp lệ; không trùng thời lượng. Dữ liệu trước đó được giữ nguyên.</p></div>'; }
});
add_filter('manage_fiona_service_posts_columns', function ($columns) { $columns['fiona_state'] = 'Trạng thái / Giá'; return $columns; });
add_action('manage_fiona_service_posts_custom_column', function ($column, $id) {
    if ($column !== 'fiona_state') { return; }
    $data = get_post_meta($id, '_fiona_shared', true);
    echo esc_html(($data['availability'] ?? 'available') === 'paused' ? 'Tạm dừng' : 'Đang phục vụ');
    echo '<br>' . esc_html(empty($data['prices']) ? 'Chưa nhập giá' : count($data['prices']) . ' lựa chọn');
}, 10, 2);
add_action('add_meta_boxes_fiona_package', function () {
    add_meta_box('fiona-package-data', 'Thời lượng và giá combo', function ($post) {
        $data = get_post_meta($post->ID, '_fiona_package', true);
        wp_nonce_field('fiona_package_save', 'fiona_package_nonce');
        echo '<p><label>Thời lượng (phút) <input type="number" name="fiona_package_minutes" min="1" max="480" value="' . esc_attr($data['minutes'] ?? '') . '"></label></p>';
        echo '<p><label>Giá VND <input type="number" name="fiona_package_price" min="1" value="' . esc_attr($data['price'] ?? '') . '"></label></p><p>Giá và thời lượng dùng chung cho các bản dịch đã liên kết.</p>';
    });
});
add_action('save_post_fiona_package', function ($id) {
    if (empty($_POST['fiona_package_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['fiona_package_nonce'])), 'fiona_package_save') || !current_user_can('edit_post', $id) || wp_is_post_revision($id) || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)) return;
    $minutes = $_POST['fiona_package_minutes'] ?? ''; $price = $_POST['fiona_package_price'] ?? '';
    if (!is_scalar($minutes) || !is_scalar($price) || !ctype_digit((string)$minutes) || !ctype_digit((string)$price) || (int)$minutes < 1 || (int)$minutes > 480 || (int)$price < 1 || (int)$price > 100000000) { set_transient('fiona_invalid_' . get_current_user_id(), 1, 60); return; }
    $translations = function_exists('pll_get_post_translations') ? pll_get_post_translations($id) : [];
    foreach (array_unique(array_merge([$id], array_values($translations))) as $translated_id) { if (current_user_can('edit_post', $translated_id)) update_post_meta($translated_id, '_fiona_package', ['minutes' => (int)$minutes, 'price' => (int)$price]); }
});

require_once __DIR__.'/booking.php';
