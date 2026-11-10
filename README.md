# Fiona — bản React để IT tiếp tục hoàn thiện

**Trạng thái: bản thử kỹ thuật, CHƯA phải bản production hoặc bản dashboard hoàn chỉnh. Không triển khai đè website Fiona đang hoạt động.**

Mục tiêu: giữ frontend React trên Cloudflare Pages, tham khảo giao diện Fiona WordPress đã duyệt; người biên tập có thể quản lý bằng dashboard. Tài liệu yêu cầu chi tiết ở `YEU-CAU-DASHBOARD.md`.

## Chạy frontend

Yêu cầu Node.js và npm. Trong thư mục này:

```sh
npm ci
npm run dev
```

Mở địa chỉ Vite báo ra, ví dụ `/vi/` hoặc `/en/`; trang chi tiết ví dụ `/vi/services/aroma-massage`. `npm run build` tạo `dist/`. Không có lệnh hoặc workflow triển khai tự động trong gói này. Các tệp cấu hình booking/Cloudflare của dự án cũ không nằm trong gói; IT cần tích hợp có kiểm soát với repository thực tế.

## Nội dung và dữ liệu

- `src/app/FionaRedesign.tsx` và các tệp CSS cùng thư mục: frontend React, gồm trang chủ, chi tiết dịch vụ, booking bản xem thử.
- `public/fiona-assets`, `public/fiona-uploads`: ảnh và tài nguyên giao diện.
- `src/data`: bản sao dữ liệu dùng khi chưa kết nối CMS; giá, nội dung và ảnh cần kiểm tra đối chiếu với dữ liệu được duyệt.
- `handoff-data/catalog-tu-wordpress-local.json`: bản xuất đọc từ CMS thử gồm 18 dịch vụ, giá và nội dung Việt/Anh tại thời điểm xuất. **Không phải bản backup WordPress có thể nhập trực tiếp**; một số đường dẫn ảnh chứa localhost. Tệp dùng làm dữ liệu tham khảo và ánh xạ; ảnh tương ứng nằm trong `public`.
- `integrations/fiona-cms`: mã plugin CMS Fiona từ bản thử WordPress; `integrations/fiona-headless-bridge`: plugin đọc dữ liệu cho React. Chưa đóng gói WordPress, database, tài khoản hoặc plugin bên thứ ba. Plugin bridge cần plugin đa ngôn ngữ Polylang và dữ liệu Fiona đã được nhập. Cần kiểm thử bảo mật, quyền, đồng bộ và tính tương thích trước khi sử dụng.

## Kết nối CMS thử

Đây là một phương án thử headless WordPress, chưa bắt buộc IT chọn giải pháp này. WordPress cần máy chủ PHP/database riêng; Cloudflare Pages không tự chạy WordPress PHP. Trong bản WordPress Fiona thử riêng, kích hoạt `fiona-cms`, Polylang và `fiona-headless-bridge`; cấu hình công khai đọc `GET /wp-json/fiona/v1/catalog` và CORS phù hợp với domain frontend. Không đưa credential vào Vite hoặc endpoint công khai.

Tạo `.env.local` từ `.env.example`, điền `VITE_FIONA_CMS_ENDPOINT` bằng URL API của CMS thử. Sau khi thay env cần khởi động lại Vite. Nếu không cấu hình hoặc API lỗi, frontend dùng dữ liệu tĩnh có sẵn. Endpoint gửi nội dung dịch vụ công khai, không cấp quyền sửa và không gửi yêu cầu đặt lịch.

Đã kiểm tra tại máy cục bộ: 18 dịch vụ có hai ngôn ngữ; sửa tạm giá 60 phút Massage Tinh Dầu trong dữ liệu thử sang 381.000đ thì API trả giá mới, sau đó khôi phục 380.000đ. Kiểm tra React chọn 90 phút hiển thị 550.000đ và liên kết có `minutes=90`. Cần kiểm tra lại toàn bộ luồng trên staging thật.

## Giới hạn bắt buộc đọc trước khi đưa vào sử dụng

1. CMS hiện mới kết nối **danh sách dịch vụ, tên, mô tả, bài chi tiết, ảnh và giá**. Nội dung trang chủ, gói, bài blog, SEO và các thành phần toàn cục chưa đồng bộ đầy đủ với dashboard.
2. Trang đặt lịch React hiện chỉ là bản xem thử, **không lưu yêu cầu hoặc gửi thông báo**. Plugin CMS có mã booking thử riêng nhưng chưa tích hợp frontend React và chưa kiểm thử bảo mật/gửi mail; không xem là tính năng hoạt động.
3. Không cam kết khớp 100% WordPress: cần đối chiếu từng trang, thiết bị, ảnh, chuyển động, widget Facebook/Trustindex và Google Maps. Một số ảnh dịch vụ mới là ảnh tạm.
4. SEO, `index.html`, canonical, hreflang, sitemap, robots, chuyển hướng và khả năng Google nhận nội dung cần IT thiết kế/kiểm thử lại với dữ liệu thật. SPA render bằng JS không đồng nghĩa SEO đã hoàn thiện. Kiểm kê URL cũ và backlink trước khi thay bất kỳ URL nào.
5. Không có backup, cơ chế phân quyền, lịch sử, workflow xuất bản hoặc tích hợp GA4/GSC hoàn chỉnh trong gói frontend này. Cần kiểm tra thực tế, không xóa DNS/email/Cloudflare records. Giữ nguyên website cũ và chuẩn bị phương án rollback trước khi cutover.
6. Gói được tạo riêng để xem xét; không chứa mật khẩu, database hoặc cấu hình deploy production. Không kết nối với website Angel One.
7. `npm ci` ngày 10/11/2026 báo 31 cảnh báo dependency (20 high, 1 critical tính cả dev); `npm audit --omit=dev` báo 12 cảnh báo (8 high). IT phải rà và cập nhật phụ thuộc, kiểm thử tương thích và chạy audit lại trước khi triển khai; con số có thể thay đổi theo cơ sở dữ liệu npm.
