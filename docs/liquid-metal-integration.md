# Liquid Metal Button

Component tại `components/ui/liquid-metal-button.tsx` dùng `@paper-design/shaders`, `lucide-react` và React như prompt. Các lớp được giữ: shader kim loại bên dưới, mặt nút gradient đen, nhãn/icon, lớp ripple. Hover tăng tốc từ 0.6 lên 1; nhấn tăng lên 2.4 trong 300ms; ripple kết thúc sau 600ms.

```tsx
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

<LiquidMetalButton label="Get Started" onClick={() => console.log("clicked")} />
<LiquidMetalButton label="Mở gợi ý" viewMode="icon" />
```

Props gốc: `label`, `onClick`, `viewMode`. Bổ sung `disabled`, `className`, `icon`, `width` và `hostButton` để hỗ trợ ứng dụng hiện có. Không cần provider, store, ảnh hay asset tải ngoài. Vì nút không có ảnh, không bổ sung ảnh Unsplash vào trang.

Trong Speaking7, component tăng cường **hai nút gửi bài chấm**. Nút HTML gốc vẫn là phần tử tương tác duy nhất: không lồng button, không nhân đôi action, không thay đổi luồng chấm. React chỉ sở hữu nội dung bên trong. `MutationObserver` theo dõi disabled để dừng shader; việc ẩn/hiện nút theo chế độ Part/cả bài vẫn do JS hiện có quản lý.

## Điều chỉnh cần thiết so với mẫu

- Phiên bản thư viện được khóa trong `package-lock.json`; API hiện tại dùng `ShaderMount.dispose()`, không có `destroy()`. Cleanup dùng API chính thức và không dùng `any`.
- Bổ sung uniform kích thước/màu mà API shader hiện tại yêu cầu. Giữ các giá trị hiệu ứng được đưa trong prompt.
- Căn kích thước theo vùng chứa khi dùng trong app; demo giữ kích thước gốc 142×46 và 46×46. Nhãn tiếng Việt và aria-label phù hợp chức năng chấm bài.
- Chữ sáng hơn mẫu để đọc được trên mặt nút đen. Có focus bàn phím, ripple từ tâm khi kích hoạt bằng Enter/Space và pointer hỗ trợ chuột/chạm.
- Dừng chuyển động khi disabled, khi yêu cầu giảm chuyển động hoặc theo cơ chế ngoài viewport/tab ẩn của thư viện. Dọn timer, observer, listener và WebGL khi unmount.
- Nếu WebGL 2 không có hoặc mất context, gradient bạc vẫn hiển thị và nút vẫn thực hiện thao tác.

## Kiểm tra

`npm run build` kiểm tra TypeScript và build cả các trang hiện có lẫn demo. `npm test` chạy các kiểm tra Speaking7. Ngoài ra kiểm tra bằng trình duyệt: click/hover/keyboard, disabled, đổi chế độ Part/cả bài, giảm chuyển động, thiếu WebGL, unmount/remount và bản production.
