import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

const privacySections: LegalSection[] = [
  {
    id: "thong-tin-thu-thap",
    title: "1. Thông tin chúng tôi thu thập",
    body: "TzoShop có thể thu thập các thông tin cần thiết như họ tên, email, thông tin tài khoản, lịch sử đơn hàng, trạng thái gói credits và dữ liệu sử dụng liên quan đến dịch vụ.",
  },
  {
    id: "cach-su-dung-thong-tin",
    title: "2. Cách chúng tôi sử dụng thông tin",
    body: "Thông tin được sử dụng để tạo và quản lý tài khoản, xử lý đơn hàng, cập nhật gói credits, hỗ trợ người dùng, cải thiện trải nghiệm và đảm bảo dịch vụ hoạt động ổn định.",
  },
  {
    id: "du-lieu-tai-khoan-va-giao-dich",
    title: "3. Dữ liệu tài khoản và giao dịch",
    body: "Các thông tin về đơn hàng, thanh toán và gói đang sử dụng được lưu lại để bạn có thể kiểm tra lịch sử, theo dõi trạng thái và quản lý chi phí rõ ràng hơn.",
  },
  {
    id: "bao-ve-thong-tin",
    title: "4. Bảo vệ thông tin",
    body: "TzoShop áp dụng các biện pháp phù hợp để bảo vệ dữ liệu người dùng, hạn chế truy cập trái phép và giảm rủi ro mất mát hoặc lạm dụng thông tin.",
  },
  {
    id: "chia-se-du-lieu-ben-thu-ba",
    title: "5. Chia sẻ dữ liệu với bên thứ ba",
    body: "Một số dữ liệu có thể được xử lý bởi các dịch vụ bên thứ ba cần thiết cho vận hành, ví dụ xác thực, gửi email hoặc thanh toán. Chúng tôi chỉ chia sẻ thông tin trong phạm vi cần thiết cho mục đích cung cấp dịch vụ.",
  },
  {
    id: "cookie-va-du-lieu-trinh-duyet",
    title: "6. Cookie và dữ liệu trình duyệt",
    body: "TzoShop có thể sử dụng cookie hoặc dữ liệu lưu trữ trình duyệt để duy trì phiên đăng nhập, ghi nhớ tuỳ chọn và cải thiện trải nghiệm sử dụng.",
  },
  {
    id: "thoi-gian-luu-tru-du-lieu",
    title: "7. Thời gian lưu trữ dữ liệu",
    body: "Dữ liệu được lưu trữ trong thời gian cần thiết để cung cấp dịch vụ, đáp ứng yêu cầu hỗ trợ, xử lý giao dịch và tuân thủ các nghĩa vụ vận hành liên quan.",
  },
  {
    id: "quyen-cua-nguoi-dung",
    title: "8. Quyền của người dùng",
    body: "Bạn có thể yêu cầu kiểm tra, cập nhật hoặc hỗ trợ xử lý thông tin tài khoản bằng cách liên hệ với TzoShop qua kênh hỗ trợ chính thức.",
  },
  {
    id: "thay-doi-chinh-sach",
    title: "9. Thay đổi chính sách",
    body: "Chính sách bảo mật có thể được cập nhật theo thời gian. Mọi thay đổi quan trọng sẽ được công bố trên trang này để người dùng dễ dàng theo dõi.",
  },
  {
    id: "lien-he",
    title: "10. Liên hệ",
    body: "Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua email support@tzoshop.io.vn.",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Bảo mật"
      title="Chính sách bảo mật"
      description="Cách TzoShop thu thập, sử dụng và bảo vệ thông tin của bạn."
      updatedAt="Cập nhật lần cuối: 14/05/2026"
      sections={privacySections}
    />
  );
}

