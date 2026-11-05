# Speaking7 / Band Room

Ứng dụng luyện IELTS Speaking. Các trang HTML và logic luyện nói hiện có được giữ lại; React chỉ tăng cường giao diện nút gửi bài chấm bằng Liquid Metal Button.

## Chạy bằng Go Live

1. Giải nén ZIP và mở thư mục chứa `index.html` trong VS Code.
2. Mở `index.html` và bấm **Go Live**. Có thể mở `preview.html` để luyện mà không đăng nhập.
3. Trong trang luyện, mở **Gemini của bạn** và dán API key từ [Google AI Studio](https://aistudio.google.com/apikey).

Go Live chạy phần luyện và chấm online ngay trên trình duyệt. Bạn có thể luyện bằng câu trả lời nhập tay hoặc bật microphone khi trình duyệt cho phép. Nền Aurora và viền sáng quanh ô chat chuyển động ngay trên Go Live. Hiệu ứng nút Liquid Metal cần bản đã build hoặc Vite.

## Chạy bằng Vite

Yêu cầu Node.js 22.12+ hoặc 24+ (đã kiểm tra với Node 24).

```bash
npm ci
npm run dev
```

Mở địa chỉ mà Vite in ra. Trang chính là `index.html`; bản luyện không đăng nhập là `preview.html`. Demo component ở đường dẫn `/liquid-metal-demo.html` gồm dạng chữ, icon, disabled và tháo/lắp component.

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

`npm test` chạy 8 bộ kiểm tra phát triển, gồm xác minh Gemini cá nhân, hủy yêu cầu và giữ nguyên client trong một lượt chấm. `tests/scope-audit.cjs` là công cụ so sánh với thư mục dự án gốc, cần đối số riêng và không thuộc bộ kiểm tra khởi động.

Các script JS thuần vẫn chạy theo thứ tự cũ và được chép vào `dist/assets/js` khi build. Bản build nằm trong `dist/`; `npm run preview` phục vụ bản này. Giấy phép font cũng được chép vào bản build.

## Cấu trúc React / shadcn / Tailwind

- `components/ui/liquid-metal-button.tsx`: component từ prompt, điều chỉnh API thư viện và tích hợp với nút gốc.
- `components/ui/demo.tsx`: demo Liquid Metal.
- `components/ui/aurora.tsx` và `components/ui/aurora-demo.tsx`: nền Aurora React và demo. Aurora nhận ba màu CSS, thời lượng chuyển động và cường độ sáng.
- `components/ui/border-beam.tsx`: component React dùng gói `border-beam` cho viền ô chat. Demo nằm ở `components/ui/border-beam-demo.tsx`.
- `assets/css/chat-composer.css`: giao diện ô chat và viền động cho Go Live.
- `assets/css/aurora.css`: keyframes dùng chung và lớp nền cho Go Live. Cả hai cách chạy đều tôn trọng cài đặt giảm chuyển động của hệ điều hành.
- `src/liquid-metal-entry.tsx`: gắn Aurora, BorderBeam và hiệu ứng nút chấm. Ô nhập và nút gửi gốc tiếp tục xử lý chat.
- `src/styles/ui.css`: Tailwind 4, token tương thích shadcn và style cho component. Không nạp Preflight để tránh reset giao diện HTML hiện có.
- `lib/utils.ts`: tiện ích `cn` dùng `clsx` và `tailwind-merge`.
- `components.json`: cấu hình shadcn; `tsconfig.json` và Vite cùng ánh xạ `@/` về gốc dự án.
- `assets/css/`: các style của ứng dụng HTML hiện có.

Thư mục `components/ui` nằm ngay ở gốc repository, tương ứng đường dẫn `/components/ui` trong prompt. Đây là nơi tập trung các component giao diện tái sử dụng, giữ import và công cụ shadcn nhất quán. Dự án trước đây không có React/Tailwind/TypeScript; các dependency, plugin Vite và cấu hình cần thiết nay đã được cài sẵn.

Nếu muốn bổ sung component shadcn về sau, chạy từ gốc dự án:

```bash
npx shadcn@latest add button
```

Không cần chạy lại `shadcn init` trên cấu hình đã có.

## Gemini

Mỗi người dùng nhập API key riêng tại **Gemini của bạn**. Trang giữ key trong bộ nhớ và gửi trực tiếp tới `generativelanguage.googleapis.com` bằng header `x-goog-api-key`. Tải lại trang cần nhập lại key. Trình duyệt cần truy cập được Google Gemini. Microphone cần HTTPS hoặc địa chỉ cục bộ như `localhost`.

Dán key rồi bấm **Xác minh & sử dụng** để kiểm tra với Gemini 3.5 Flash-Lite mặc định. Nếu Google trả về 404 và bạn chưa chọn model khác, trang thử model dự phòng. Nút **Lấy model theo key** lấy danh sách model hỗ trợ `generateContent` từ Google. Bạn cũng có thể chọn hoặc nhập mã model từ AI Studio.

Trang thử gửi văn bản trước, rồi kiểm tra đầu vào audio bằng một đoạn WAV im lặng. Nếu văn bản đã xác minh và audio chưa sẵn sàng, bạn vẫn có thể chat và chấm theo câu trả lời dạng văn bản. Kiểm tra có thể dùng quota API. Bạn có thể hủy, đổi model hoặc ngắt kết nối. Một lượt chấm nhiều câu luôn dùng cùng client và model.

Nếu Google từ chối key, hãy kiểm tra trạng thái và project của key trên [Google AI Studio](https://aistudio.google.com/apikey). Dùng Auth key từ AI Studio. Nếu key có giới hạn website, hãy kiểm tra địa chỉ Go Live hoặc tên miền đã triển khai trong danh sách được phép. Khi chia sẻ ảnh lỗi, chỉ chụp thông báo và che API key.

## Kiểm thử trình duyệt

```bash
npx playwright install chromium
npm run test:browser
```

Máy cloud đã có `/usr/bin/chromium` sẽ dùng trình duyệt đó. Có thể đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE` tới Chromium khác. Bộ kiểm tra tự build và mở server dev/production tại hai cổng 5198/5199; kiểm tra nhập/paste key, phản hồi hợp lệ/không hợp lệ, model, quota, audio, hủy, bàn phím, giao diện điện thoại và menu cố định. Các phản hồi Gemini trong kiểm thử là **giả lập**; không có key thật trong fixture và các kết quả này không chứng minh một key/model thực tế có quyền hay quota. Chỉ bảng xác minh trong ứng dụng mới dùng key cá nhân của bạn để gọi Google thật.

Nếu chạy trong cloud có allowlist mạng, cần cho phép `generativelanguage.googleapis.com`; lỗi mạng không có nghĩa key sai. Chạy trên máy cá nhân hoặc website triển khai dùng kết nối Internet của trình duyệt đó.

Xem [ghi chú tích hợp](docs/liquid-metal-integration.md) để biết props và các điều chỉnh so với prompt.
