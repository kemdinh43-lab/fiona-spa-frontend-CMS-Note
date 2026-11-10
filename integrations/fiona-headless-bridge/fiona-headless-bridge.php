<?php
/**
 * Plugin Name: Fiona React Read-Only Content Bridge
 * Description: Publishes approved Fiona service content to a separate React frontend. No write or booking API.
 * Version: 0.1.0
 */
if (!defined('ABSPATH')) exit;

function fiona_bridge_content($post) {
    $html = '';
    foreach (parse_blocks($post->post_content) as $block) {
        if (($block['blockName'] ?? '') === 'fiona/service-price') {
            $html .= '<fiona-price-placeholder></fiona-price-placeholder>';
        } else {
            $html .= wp_kses_post(render_block($block));
        }
    }
    return $html;
}

function fiona_bridge_catalog() {
    if (!function_exists('pll_get_post_language')) {
        return new WP_Error('fiona_languages_unavailable', 'The multilingual content plugin is not active.', ['status'=>503]);
    }
    $result = [];
    $posts = get_posts(['post_type'=>'fiona_service','post_status'=>'publish','numberposts'=>-1,'lang'=>'','orderby'=>'menu_order','order'=>'ASC']);
    foreach ($posts as $post) {
        $source = get_post_meta($post->ID, '_fiona_source', true);
        $source = is_array($source) ? $source : [];
        $id = sanitize_key($source['id'] ?? '');
        $lang = pll_get_post_language($post->ID);
        if (!$id || !in_array($lang, ['vi','en'], true)) continue;
        $data = get_post_meta($post->ID, '_fiona_shared', true);
        $data = is_array($data) ? $data : [];
        if (($data['availability'] ?? 'available') === 'paused') continue;
        if (!isset($result[$id])) $result[$id] = [
            'id'=>$id,
            'slug'=>sanitize_title($source['slug'] ?? $id),
            'categoryId'=>sanitize_key($source['categoryId'] ?? ''),
            'prices'=>[], 'variants'=>[], 'priceFrom'=>0, 'translations'=>[], 'gallery'=>[]
        ];
        $prices=[];
        foreach (($data['prices'] ?? []) as $p) {
            $minutes=(int)($p['minutes'] ?? 0); $price=(int)($p['price'] ?? 0);
            if ($minutes>0 && $price>0) $prices[]=['minutes'=>$minutes,'price'=>$price];
        }
        $variants=[];
        foreach (($data['variants'] ?? []) as $v) {
            $price=(int)($v['price'] ?? 0);
            if ($price>0) $variants[]=['vi'=>sanitize_text_field($v['vi'] ?? ''),'en'=>sanitize_text_field($v['en'] ?? ''),'price'=>$price];
        }
        $result[$id]['prices']=$prices;
        $result[$id]['variants']=$variants;
        $result[$id]['priceFrom']=(int)($data['priceFrom'] ?? 0);
        $images=array_values(array_unique(array_filter(array_merge([get_post_thumbnail_id($post)],$data['gallery'] ?? []))));
        $result[$id]['gallery']=array_values(array_filter(array_map(fn($image)=>wp_get_attachment_image_url((int)$image, 'large'),$images)));
        $result[$id]['translations'][$lang]=[
            'name'=>wp_strip_all_tags(get_the_title($post)),
            'shortDescription'=>wp_strip_all_tags($post->post_excerpt),
            'description'=>wp_strip_all_tags($post->post_excerpt),
            'article'=>fiona_bridge_content($post),
            'seoTitle'=>sanitize_text_field(get_post_meta($post->ID,'_fiona_seo_title',true)),
            'seoDescription'=>sanitize_textarea_field(get_post_meta($post->ID,'_fiona_seo_description',true))
        ];
    }
    $response = new WP_REST_Response(['version'=>1,'services'=>array_values($result)], 200);
    $response->header('Cache-Control','public, max-age=60');
    return $response;
}
add_action('rest_api_init', function () {
    register_rest_route('fiona/v1', '/catalog', ['methods'=>'GET','callback'=>'fiona_bridge_catalog','permission_callback'=>'__return_true']);
});
