import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

const termsSections: LegalSection[] = [
  {
    id: "chap-nhan-dieu-khoan",
    title: "1. Chấp nhận điều khoản",
    body: "Khi truy cập hoặc sử dụng TzoShop, bạn đồng ý tuân thủ các điều khoản sử dụng này. Nếu không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng dịch vụ.",
  },
  {
    id: "tai-khoan-nguoi-dung",
    title: "2. Tài khoản người dùng",
    body: "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và các hoạt động phát sinh từ tài khoản của mình. Vui lòng sử dụng thông tin chính xác và cập nhật khi cần thiết.",
  },
  {
    id: "goi-credits-va-thoi-han",
    title: "3. Gói credits và thời hạn sử dụng",
    body: "Các gói credits được cung cấp theo từng dòng AI, số lượng credits và thời hạn cụ thể. Thông tin chi tiết của từng gói sẽ được hiển thị trước khi bạn xác nhận mua.",
  },
  {
    id: "thanh-toan-va-don-hang",
    title: "4. Thanh toán và đơn hàng",
    body: "Đơn hàng sẽ được ghi nhận trong tài khoản của bạn. Sau khi thanh toán được xác nhận thành công, gói credits tương ứng sẽ được cập nhật để bạn sử dụng.",
  },
  {
    id: "su-dung-dich-vu-hop-le",
    title: "5. Sử dụng dịch vụ hợp lệ",
    body: "Bạn đồng ý sử dụng TzoShop cho các mục đích hợp pháp, không lạm dụng hệ thống, không cố tình gây gián đoạn dịch vụ và không sử dụng dịch vụ cho hành vi vi phạm pháp luật.",
  },
  {
    id: "bao-mat-tai-khoan-va-key",
    title: "6. Bảo mật tài khoản và key sử dụng",
    body: "Bạn nên bảo vệ các key sử dụng và không chia sẻ công khai. Nếu nghi ngờ key bị lộ, bạn nên thu hồi key cũ và tạo key mới trong tài khoản.",
  },
  {
    id: "tam-ngung-hoac-gioi-han-dich-vu",
    title: "7. Tạm ngưng hoặc giới hạn dịch vụ",
    body: "TzoShop có thể tạm ngưng hoặc giới hạn quyền sử dụng nếu phát hiện hành vi vi phạm điều khoản, gây rủi ro bảo mật hoặc ảnh hưởng đến trải nghiệm của người dùng khác.",
  },
  {
    id: "gioi-han-trach-nhiem",
    title: "8. Giới hạn trách nhiệm",
    body: "TzoShop cố gắng duy trì dịch vụ ổn định, tuy nhiên không cam kết dịch vụ luôn không gián đoạn. Chúng tôi không chịu trách nhiệm cho các thiệt hại gián tiếp phát sinh ngoài phạm vi kiểm soát hợp lý.",
  },
  {
    id: "thay-doi-dieu-khoan",
    title: "9. Thay đổi điều khoản",
    body: "Các điều khoản có thể được cập nhật để phù hợp với thay đổi sản phẩm, chính sách hoặc yêu cầu vận hành. Phiên bản mới sẽ được công bố trên trang này.",
  },
  {
    id: "lien-he",
    title: "10. Liên hệ",
    body: "Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ qua email support@tzoshop.io.vn.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      badge="Pháp lý"
      title="Điều khoản sử dụng"
      description="Các điều khoản khi bạn truy cập, mua gói credits và sử dụng dịch vụ TzoShop."
      updatedAt="Cập nhật lần cuối: 14/05/2026"
      sections={termsSections}
    />
  );
}

