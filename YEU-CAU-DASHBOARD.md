# Yêu cầu dashboard Fiona — bàn giao cho IT

## Mục đích

Nhân viên SEO không cần sửa code: chỉnh nội dung tiếng Việt/Anh, xem trước và xuất bản; thay đổi một nguồn được dùng lại trên trang chủ, trang chi tiết và bảng giá. Frontend giữ React/Cloudflare Pages; CMS có thể là WordPress riêng hoặc giải pháp khác sau khi IT thống nhất. Chưa giả định backend đã làm xong.

## 1. Dịch vụ và trang chi tiết

Mỗi dịch vụ có: tên Việt/Anh; slug/URL và trạng thái; nhóm dịch vụ; mô tả ngắn; ảnh đại diện; bộ ảnh có thể sắp xếp và alt; bài viết dài bằng trình soạn thảo trực quan (heading, đoạn, danh sách, ảnh, video, link và khối giá); câu hỏi thường gặp; dịch vụ/bài liên quan; lựa chọn hiển thị nổi bật và thứ tự. Giá có nhiều lựa chọn thời lượng hoặc tên biến thể, giá VND, tình trạng; thêm/sửa/xóa được. Trang chi tiết và menu lấy cùng dữ liệu, không nhập nhiều lần. Có bản nháp, preview và lịch sử khôi phục. SEO mỗi ngôn ngữ: title, meta description, canonical/robots khi phù hợp, ảnh chia sẻ và slug; không tự thay URL đã có traffic.

**Đã thử kết nối:** giá, tên, mô tả, bài dịch vụ và gallery từ CMS WordPress bản thử sang React. Các trường SEO có trong phản hồi bridge nhưng chưa xuất ra metadata trang; các trường khác phải làm và nghiệm thu.

## 2. Trang chủ và nội dung chung

Cho phép thay, bật/tắt và sắp xếp các khối có sẵn; quản lý 3 ảnh hero và tiêu đề/CTA; danh sách video Facebook; dịch vụ nổi bật; menu; các gói; giới thiệu; gallery; tiêu đề và widget review; đội ngũ; giờ mở cửa; FAQ; Google Maps; footer và thanh liên hệ. Mỗi trường văn bản hỗ trợ Việt/Anh, ảnh có alt. Chỉnh xong xem trước desktop/mobile, sau đó mới xuất bản. Review lấy từ widget thực, không tạo đánh giá giả. URL video, bản đồ và các liên kết cần kiểm tra khi lưu.

**Trạng thái:** hiện phần lớn đang là nội dung tĩnh trong React; chưa có dashboard điều khiển các khối này.

## 3. Bài viết và gói dịch vụ

Bài viết: tạo/sửa/xóa mềm, danh mục, ảnh đại diện/alt, tiêu đề, nội dung khối, nội dung Việt/Anh, trạng thái, lịch đăng, SEO, slug và bài liên quan. Gói: tên, thành phần, giá, ảnh, thời lượng, mô tả hai ngôn ngữ, thứ tự, trạng thái và nút đặt lịch. Nội dung phải được frontend hiển thị thật; không chỉ tồn tại trong dashboard.

**Trạng thái:** mã CMS Fiona có loại nội dung gói, WordPress có trình viết bài; React chưa nối dữ liệu bài viết hoặc gói từ CMS.

## 4. Yêu cầu đặt lịch

Form có tên, phương thức liên lạc, số khách, dịch vụ/biến thể/thời lượng, ngày giờ mong muốn và ghi chú; không yêu cầu tải giấy tờ hay thẻ thanh toán. Lưu yêu cầu, thông báo lễ tân, trạng thái mới/đã xác nhận/hoàn tất/hủy; phản hồi rõ yêu cầu được gửi, lịch chỉ xác nhận sau khi lễ tân liên hệ. Khi đi từ trang dịch vụ phải chuyển đúng lựa chọn sang form. Cần quyền truy cập theo vai trò, chống spam, giới hạn tốc độ, bảo vệ dữ liệu, sao lưu, và kiểm thử email thật.

**Trạng thái:** chưa tích hợp React với lưu trữ hoặc thông báo; plugin thử có mã riêng nhưng cần review và kiểm thử trước khi dùng.

## 5. SEO, vận hành và nghiệm thu

- Giữ nguyên domain và URL đang có khi khả thi; lập bảng mapping từng URL cũ sang URL mới và redirect 301 khi cần, ưu tiên URL có traffic/backlink. Rà GA4/GTM/GSC, sự kiện, canonical, hreflang Việt/Anh, sitemap, robots, 404 và dữ liệu có cấu trúc đúng thực tế.
- Staging tách biệt, bảo vệ truy cập và tránh bị index; sao lưu, kiểm tra và có phương án rollback. Xác nhận quyền quản lý domain/DNS và từng record trước cutover; không thay email/DNS ngoài phạm vi.
- Quyền admin/editor; backup và phục hồi; dự thảo/xem trước/xuất bản; lịch sử thay đổi; CMS lỗi không làm mất website hoặc hiển thị dữ liệu cũ như mới mà không có cảnh báo vận hành.
- Nghiệm thu bằng tình huống thực tế: SEO tự tạo/sửa dịch vụ và bài viết hai ngôn ngữ, đổi giá một lần thấy cập nhật khắp nơi, sắp xếp khối, sửa ảnh và SEO, gửi booking thử đến đúng lễ tân, kiểm tra trên mobile/desktop, test URL cũ, maps/video/review và đo tracking.

## Lưu ý dữ liệu bảng giá

Giá VND đang trong snapshot cần đối chiếu lại bảng niêm yết hiện tại trước xuất bản, đặc biệt gói, dịch vụ làm đẹp, tên biến thể và khoản cộng thêm. Không tự suy ra số liệu hoặc đánh giá khách hàng.
