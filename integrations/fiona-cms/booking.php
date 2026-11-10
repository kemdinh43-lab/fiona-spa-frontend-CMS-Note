<?php
if (!defined('ABSPATH')) exit;
function fiona_booking_catalog($lang) {
 $items=[];
 foreach(get_posts(['post_type'=>['fiona_service','fiona_package'],'post_status'=>'publish','numberposts'=>100,'lang'=>$lang,'orderby'=>'menu_order','order'=>'ASC']) as $p){
  $shared=get_post_meta($p->ID,$p->post_type==='fiona_package'?'_fiona_package':'_fiona_shared',true);$shared=is_array($shared)?$shared:[];
  if(($shared['availability']??'')==='paused')continue;
  $prices=$p->post_type==='fiona_package'?[['minutes'=>(int)($shared['minutes']??0),'price'=>(int)($shared['price']??0)]]:($shared['prices']??[]);
  $items[]=['id'=>$p->ID,'name'=>$p->post_title,'type'=>$p->post_type,'prices'=>$prices,'priceFrom'=>(int)($shared['priceFrom']??0)];
 }return $items;
}
function fiona_booking_submit($request){
 $d=$request->get_json_params();$d=is_array($d)?$d:[];$vi=($d['language']??'en')==='vi';
 $fail=function($fields,$code=422)use($vi){return new WP_REST_Response(['success'=>false,'message'=>$vi?'Vui lòng kiểm tra các thông tin được đánh dấu.':'Please check the highlighted fields.','fields'=>$fields],$code);};
 if(!is_string($d['nonce']??null)||!wp_verify_nonce($d['nonce'],'fiona_booking'))return $fail(['form'=>$vi?'Phiên đã hết hạn. Vui lòng tải lại trang.':'Your session expired. Please reload this page.'],403);
 if(!empty($d['website']))return $fail(['form'=>$vi?'Không thể gửi yêu cầu này.':'Unable to submit this request.']);
 $value=function($key)use($d){return isset($d[$key])&&is_scalar($d[$key])?sanitize_text_field((string)$d[$key]):'';};
 $name=$value('name');$phone=$value('phone');$email=$value('email');$guests=$value('guests');$service=$value('service');$minutes=$value('minutes');$date=$value('date');$time=$value('time');$note=isset($d['note'])&&is_string($d['note'])?sanitize_textarea_field($d['note']):'';$token=$value('request_id');$errors=[];
 if(mb_strlen($name)<2||mb_strlen($name)>100)$errors['name']=$vi?'Nhập họ tên từ 2 đến 100 ký tự.':'Enter your full name (2–100 characters).';
 if(!preg_match('/^\+[0-9 ()\-]{7,24}$/',$phone)||strlen(preg_replace('/\D/','',$phone))<8||strlen(preg_replace('/\D/','',$phone))>15)$errors['phone']=$vi?'Nhập số điện thoại kèm mã quốc gia, ví dụ +84 941 333 184.':'Include the country code, e.g. +84 941 333 184.';
 if($email!==''&&(!is_email($email)||strlen($email)>254))$errors['email']=$vi?'Email chưa đúng định dạng.':'Enter a valid email address.';
 if(!ctype_digit($guests)||(int)$guests<1||(int)$guests>10)$errors['guests']=$vi?'Chọn từ 1 đến 10 khách.':'Choose 1–10 guests.';
 $catalog=fiona_booking_catalog($vi?'vi':'en');$selected=null;foreach($catalog as $item)if((string)$item['id']===$service)$selected=$item;
 if(!$selected)$errors['service']=$vi?'Chọn một dịch vụ đang phục vụ.':'Choose an available treatment.';
 $valid_minutes=$selected?array_map(fn($p)=>(string)(int)$p['minutes'],$selected['prices']):[];
 if($selected&&((!$valid_minutes&&$minutes!=='consult')||($valid_minutes&&!in_array($minutes,$valid_minutes,true))))$errors['minutes']=$vi?'Chọn thời lượng hợp lệ.':'Choose an available duration.';
 $tz=new DateTimeZone('Asia/Ho_Chi_Minh');$appointment=DateTimeImmutable::createFromFormat('!Y-m-d H:i',$date.' '.$time,$tz);$now=new DateTimeImmutable('now',$tz);
 if(!$appointment||$appointment->format('Y-m-d')!==$date||!preg_match('/^\d{4}-\d{2}-\d{2}$/',$date)||$appointment<$now||$appointment>$now->modify('+1 year'))$errors['date']=$vi?'Chọn ngày giờ trong tương lai, trong vòng 12 tháng.':'Choose a future date and time within 12 months.';
 if(!preg_match('/^\d{2}:\d{2}$/',$time)||$time<'09:00'||$time>'23:30'||(int)substr($time,-2)%15!==0)$errors['time']=$vi?'Chọn giờ từ 09:00 đến 23:30, cách nhau 15 phút.':'Choose a time between 09:00 and 23:30 in 15-minute intervals.';
 if(mb_strlen($note)>1500)$errors['note']=$vi?'Lời nhắn tối đa 1.500 ký tự.':'Keep your message within 1,500 characters.';
 if(($d['consent']??false)!==true)$errors['consent']=$vi?'Vui lòng đồng ý để Fiona liên hệ xác nhận.':'Please allow Fiona to contact you about this request.';
 if(!preg_match('/^[a-zA-Z0-9-]{16,80}$/',$token))$errors['form']=$vi?'Vui lòng tải lại trang rồi thử lại.':'Please reload the page and try again.';
 if($errors)return $fail($errors);
 $dedupe='fiona_req_'.hash('sha256',$token);$existing=get_transient($dedupe);
 if($existing)return new WP_REST_Response(['success'=>true,'reference'=>$existing],200);
 $limit='fiona_rate_'.hash_hmac('sha256',preg_replace('/\D/','',$phone),wp_salt());$count=(int)get_transient($limit);
 if($count>=5)return $fail(['form'=>$vi?'Bạn đã gửi nhiều yêu cầu. Vui lòng gọi Fiona nếu cần hỗ trợ.':'Several requests have been received. Please call Fiona for help.'],429);
 $reference='FN-'.strtoupper(wp_generate_password(8,false,false));$data=['name'=>$name,'phone'=>$phone,'email'=>$email,'guests'=>(int)$guests,'service_id'=>(int)$service,'service_name'=>$selected['name'],'minutes'=>$minutes,'date'=>$date,'time'=>$time,'note'=>$note,'language'=>$vi?'vi':'en','reference'=>$reference,'consent_at'=>gmdate('c'),'notification'=>'not_configured'];
 $id=wp_insert_post(['post_type'=>'fiona_booking','post_status'=>'private','post_title'=>$reference.' · '.$name,'meta_input'=>['_fiona_booking'=>$data,'_fiona_booking_status'=>'new']],true);
 if(is_wp_error($id))return new WP_REST_Response(['success'=>false,'fields'=>['form'=>$vi?'Chưa lưu được yêu cầu. Vui lòng thử lại.':'Your request could not be saved. Please try again.']],500);
 set_transient($dedupe,$reference,DAY_IN_SECONDS);set_transient($limit,$count+1,HOUR_IN_SECONDS);
 $recipient=get_option('fiona_booking_notification_email','');
 if(wp_get_environment_type()==='local')$data['notification']='local_disabled';
 elseif(is_email($recipient)){
  $body="New Fiona booking request: $reference\nName: $name\nPhone / WhatsApp: $phone\nEmail: $email\nGuests: $guests\nTreatment: {$selected['name']}\nDuration: $minutes\nDate: $date $time (Da Nang)\nMessage: $note\nManage: ".admin_url('post.php?post='.$id.'&action=edit');
  $data['notification']=wp_mail($recipient,'Fiona booking '.$reference,$body)?'sent':'failed';
 }
 update_post_meta($id,'_fiona_booking',$data);
 return new WP_REST_Response(['success'=>true,'reference'=>$reference],201);
}
add_action('rest_api_init',function(){register_rest_route('fiona/v1','/booking',['methods'=>'POST','callback'=>'fiona_booking_submit','permission_callback'=>'__return_true']);});
function fiona_booking_statuses(){return ['new'=>'Mới','confirmed'=>'Đã xác nhận','completed'=>'Hoàn tất','cancelled'=>'Đã huỷ'];}
add_action('add_meta_boxes_fiona_booking',function(){add_meta_box('fiona-booking-info','Chi tiết yêu cầu đặt lịch',function($post){
 $d=get_post_meta($post->ID,'_fiona_booking',true);if(!is_array($d))return;wp_nonce_field('fiona_booking_admin','fiona_booking_admin_nonce');
 echo '<p><strong>Lịch hẹn chỉ được xác nhận sau khi lễ tân liên hệ khách.</strong></p><table class="widefat striped"><tbody>';
 foreach(['reference'=>'Mã yêu cầu','name'=>'Họ tên','phone'=>'Điện thoại / WhatsApp','email'=>'Email','guests'=>'Số khách','service_name'=>'Dịch vụ','minutes'=>'Thời lượng (phút / cần tư vấn)','date'=>'Ngày','time'=>'Giờ tại Đà Nẵng','note'=>'Lời nhắn','language'=>'Ngôn ngữ','consent_at'=>'Đồng ý liên hệ lúc (UTC)'] as $key=>$label)echo '<tr><th style="width:220px">'.esc_html($label).'</th><td>'.nl2br(esc_html((string)($d[$key]??''))).'</td></tr>';
 echo '</tbody></table><p><label>Trạng thái <select name="fiona_booking_status">';foreach(fiona_booking_statuses() as $key=>$label)echo '<option value="'.esc_attr($key).'" '.selected(get_post_meta($post->ID,'_fiona_booking_status',true),$key,false).'>'.esc_html($label).'</option>';echo '</select></label></p>';
 $notifications=['not_configured'=>'Chưa cấu hình email nhận thông báo.','local_disabled'=>'Bản thử local: email đang tắt. Yêu cầu đã lưu trong WordPress.','sent'=>'Đã chuyển thông báo sang hệ thống gửi email; cần kiểm tra hộp thư để xác nhận nhận được.','failed'=>'Gửi email thất bại. Yêu cầu vẫn được lưu trong WordPress.'];
 echo '<p><strong>Thông báo:</strong> '.esc_html($notifications[$d['notification']??'not_configured']??'Chưa cấu hình').'</p>';
 },'fiona_booking','normal','high');});
add_action('save_post_fiona_booking',function($id){if(empty($_POST['fiona_booking_admin_nonce'])||!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['fiona_booking_admin_nonce'])),'fiona_booking_admin')||!current_user_can('edit_post',$id)||wp_is_post_revision($id))return;$s=sanitize_key($_POST['fiona_booking_status']??'');if(isset(fiona_booking_statuses()[$s]))update_post_meta($id,'_fiona_booking_status',$s);});
add_filter('manage_fiona_booking_posts_columns',function($c){return ['cb'=>$c['cb'],'title'=>'Yêu cầu','fiona_booking_time'=>'Lịch mong muốn','fiona_booking_service'=>'Dịch vụ / Khách','fiona_booking_phone'=>'Liên hệ','fiona_booking_status'=>'Trạng thái','date'=>'Ngày nhận'];});
add_action('manage_fiona_booking_posts_custom_column',function($column,$id){$d=get_post_meta($id,'_fiona_booking',true);if(!is_array($d))return;
 if($column==='fiona_booking_time')echo esc_html(($d['date']??'').' · '.($d['time']??'')).'<br>Đà Nẵng (UTC+7)';
 if($column==='fiona_booking_service')echo esc_html(($d['service_name']??'').' / '.($d['guests']??'').' khách');
 if($column==='fiona_booking_phone')echo esc_html($d['phone']??'');
 if($column==='fiona_booking_status')echo esc_html(fiona_booking_statuses()[get_post_meta($id,'_fiona_booking_status',true)]??'Mới');
},10,2);
add_action('admin_menu',function(){add_submenu_page('edit.php?post_type=fiona_booking','Thông báo đặt lịch','Thông báo','manage_options','fiona-booking-settings',function(){if(!current_user_can('manage_options'))return;echo '<div class="wrap"><h1>Thông báo đặt lịch Fiona</h1><p>Yêu cầu luôn lưu trong dashboard. Cần cấu hình hệ thống gửi mail / SMTP trên hosting và kiểm tra thư thực nhận trước khi vận hành.</p>';if(wp_get_environment_type()==='local')echo '<div class="notice notice-warning inline"><p>Bản thử local đang tắt toàn bộ email gửi ra ngoài.</p></div>';echo '<form action="options.php" method="post">';settings_fields('fiona-booking');echo '<p><label>Email của lễ tân <input type="email" name="fiona_booking_notification_email" value="'.esc_attr(get_option('fiona_booking_notification_email','')).'" class="regular-text"></label></p>';submit_button();echo '</form></div>';});});
add_action('admin_init',function(){register_setting('fiona-booking','fiona_booking_notification_email',['type'=>'string','sanitize_callback'=>'sanitize_email','default'=>'']);});
