# Speaking7 / Band Room

Ứng dụng luyện IELTS Speaking. Các trang HTML và logic luyện nói hiện có được giữ lại; React chỉ tăng cường giao diện nút gửi bài chấm bằng Liquid Metal Button.

## Chạy ứng dụng

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

**Dùng Vite thay cho Live Server để xem component mới.** Live Server không biên dịch TSX hay xử lý import từ npm. Khi mở bằng file trực tiếp hoặc server tĩnh không build, phần HTML cũ vẫn có nút gốc nhưng hiệu ứng React cần Vite hoặc bản build.

## Cấu trúc React / shadcn / Tailwind

- `components/ui/liquid-metal-button.tsx`: component từ prompt, điều chỉnh API thư viện và tích hợp với nút gốc.
- `components/ui/demo.tsx`: demo React.
- `src/liquid-metal-entry.tsx`: gắn component vào nút chấm Part/cả bài; giữ ID, trạng thái disabled/display và listener của ứng dụng.
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

Mỗi người dùng nhập API key riêng tại **Gemini của bạn**. Key chỉ được giữ trong bộ nhớ của trang, không lưu vào localStorage và không ghi vào lịch sử. Tải lại trang cần nhập lại key. Nút **Lấy model theo key** lấy danh sách model có hỗ trợ generateContent từ Google; bạn cũng có thể nhập mã model trong Google AI Studio.

Sau khi dán key, bảng giữa màn hình kiểm tra một yêu cầu văn bản và một đoạn WAV im lặng trên đúng model đã chọn. Chỉ khi cả hai phản hồi hợp lệ, kết nối mới được sử dụng cho chấm bài/chat. Đây là kiểm tra quyền truy cập và khả năng nhận audio, không chứng minh độ chính xác của điểm phát âm. Hai yêu cầu kiểm tra có thể dùng quota của bạn. Có thể hủy, đổi model hoặc ngắt kết nối; lỗi/quota/model không hợp lệ không thay thế kết nối đã xác minh trước đó. Một lượt chấm nhiều câu luôn dùng cùng client/model.

`/api/env.js` ở cả handler triển khai lẫn Vite dev/preview chỉ trả cấu hình rỗng tương thích; không cung cấp `GEMINI_KEY` hay `GEMINI_API_KEY` của chủ trang. Không cần cấu hình key dùng chung trên máy chủ. Key cá nhân được gửi trực tiếp tới `generativelanguage.googleapis.com` bằng header `x-goog-api-key`. Khi triển khai cần HTTPS hoặc localhost để hỗ trợ microphone; trình duyệt cần truy cập được dịch vụ Gemini. Không dán key vào chat, commit hay ảnh chụp màn hình.

## Kiểm thử trình duyệt

```bash
npx playwright install chromium
npm run test:browser
```

Máy cloud đã có `/usr/bin/chromium` sẽ dùng trình duyệt đó. Có thể đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE` tới Chromium khác. Bộ kiểm tra tự build và mở server dev/production tại hai cổng 5198/5199; kiểm tra nhập/paste key, phản hồi hợp lệ/không hợp lệ, model, quota, audio, hủy, bàn phím, giao diện điện thoại và menu cố định. Các phản hồi Gemini trong kiểm thử là **giả lập**; không có key thật trong fixture và các kết quả này không chứng minh một key/model thực tế có quyền hay quota. Chỉ bảng xác minh trong ứng dụng mới dùng key cá nhân của bạn để gọi Google thật.

Nếu chạy trong cloud có allowlist mạng, cần cho phép `generativelanguage.googleapis.com`; lỗi mạng không có nghĩa key sai. Chạy trên máy cá nhân hoặc website triển khai dùng kết nối Internet của trình duyệt đó.

Xem [ghi chú tích hợp](docs/liquid-metal-integration.md) để biết props và các điều chỉnh so với prompt.
