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

`npm test` chạy 7 kiểm tra phát triển hiện có. `tests/scope-audit.cjs` là công cụ so sánh với thư mục dự án gốc, cần đối số riêng và không thuộc bộ kiểm tra khởi động.

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

Endpoint `/api/env.js` hiện có vẫn được dùng. Vite dev/preview cung cấp cùng cấu hình từ biến môi trường `GEMINI_KEY` hoặc `GEMINI_API_KEY` của tiến trình, không nhúng khóa vào bundle lúc build. Handler hiện tại trả khóa cho trình duyệt; chỉ cấu hình khóa phù hợp cho bản dùng riêng. Nhập giá trị qua cấu hình môi trường an toàn, không đưa khóa vào Git hay chat. Khi triển khai, cần tiếp tục phục vụ handler `api/env.js`, không dùng một trang HTML thay cho endpoint này.

Xem [ghi chú tích hợp](docs/liquid-metal-integration.md) để biết props và các điều chỉnh so với prompt.
