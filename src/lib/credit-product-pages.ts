export type CreditFamily = "CODEXAI" | "CLAUDE" | "GEMINI" | "DEEPSEEK";

export type ProductPageConfig = {
  slug: string;
  family: CreditFamily;
  badge: string;
  title: string;
  description: string;
  audienceTitle: string;
  audienceDescription: string;
  bestFor: string[];
  useCases: string[];
  faqs: Array<{ q: string; a: string }>;
};

export const creditProductPages: ProductPageConfig[] = [
  {
    slug: "codexai-credits",
    family: "CODEXAI",
    badge: "CodexAI Credits",
    title: "CodexAI Credits cho workflow coding và phát triển sản phẩm",
    description:
      "Phù hợp cho developer, freelancer và team nhỏ muốn sử dụng AI trong quá trình viết code, sửa lỗi, review và hiểu codebase nhanh hơn.",
    audienceTitle: "CodexAI Credits phù hợp cho ai?",
    audienceDescription:
      "Nếu công việc của bạn xoay quanh code, review thay đổi và phối hợp triển khai sản phẩm, CodexAI Credits giúp bạn bắt đầu nhanh hơn trên cùng nền tảng TzoShop.",
    bestFor: ["Developer cá nhân", "Team sản phẩm", "Workflow coding", "IDE/extension hỗ trợ AI"],
    useCases: [
      "Viết và chỉnh sửa code",
      "Giải thích codebase",
      "Hỗ trợ debug",
      "Gợi ý refactor",
      "Chuẩn bị tài liệu kỹ thuật",
      "Hỗ trợ review thay đổi",
    ],
    faqs: [
      {
        q: "CodexAI Credits có phù hợp cho người mới học lập trình không?",
        a: "Có. Bạn có thể bắt đầu từ gói nhỏ để làm quen cách dùng trong các tác vụ coding thường ngày.",
      },
      {
        q: "Tôi có thể dùng cho nhiều dự án khác nhau không?",
        a: "Có. Bạn có thể phân tách cách sử dụng theo từng dự án để theo dõi credits rõ ràng hơn.",
      },
      {
        q: "Nếu dùng thường xuyên thì nên chọn gói nào?",
        a: "Bạn có thể bắt đầu từ Plus, theo dõi mức dùng thực tế rồi nâng lên Pro/Max khi cần.",
      },
      {
        q: "Có thể kết hợp với quy trình review code hiện tại không?",
        a: "Có. CodexAI Credits có thể hỗ trợ các bước phân tích và rà soát thay đổi trong workflow quen thuộc.",
      },
    ],
  },
  {
    slug: "claude-credits",
    family: "CLAUDE",
    badge: "Claude Credits",
    title: "Claude Credits cho phân tích, nội dung dài và workflow có ngữ cảnh lớn",
    description:
      "Phù hợp cho người dùng cần xử lý tài liệu dài, phân tích logic, viết nội dung chất lượng cao và hỗ trợ các tác vụ cần ngữ cảnh rõ ràng.",
    audienceTitle: "Claude Credits phù hợp cho ai?",
    audienceDescription:
      "Nếu bạn thường xuyên xử lý nhiều tài liệu, cần lập luận mạch lạc và soạn nội dung dài, Claude Credits là lựa chọn đáng cân nhắc trên TzoShop.",
    bestFor: ["Phân tích tài liệu", "Viết nội dung dài", "Lập kế hoạch", "Workflow cần ngữ cảnh"],
    useCases: [
      "Tóm tắt tài liệu dài",
      "Viết nội dung chuyên sâu",
      "Phân tích yêu cầu",
      "Lập kế hoạch công việc",
      "Hỗ trợ agent workflow",
      "Soạn email/báo cáo",
    ],
    faqs: [
      {
        q: "Claude Credits có phù hợp cho nội dung dài không?",
        a: "Có. Đây là lựa chọn phù hợp khi bạn cần xử lý nội dung có ngữ cảnh lớn và nhiều lớp thông tin.",
      },
      {
        q: "Tôi có thể dùng cho cả công việc cá nhân và nhóm không?",
        a: "Có. Bạn có thể bắt đầu cá nhân và mở rộng dần theo nhu cầu của team nhỏ.",
      },
      {
        q: "Tôi nên chọn gói nào nếu chưa chắc mức dùng?",
        a: "Nên bắt đầu gói nhỏ để đo nhu cầu thực tế, sau đó nâng lên khi tần suất sử dụng tăng.",
      },
      {
        q: "Có thể dùng cho tác vụ lập kế hoạch và báo cáo không?",
        a: "Có. Claude Credits phù hợp với các tác vụ cần cấu trúc nội dung rõ ràng và nhất quán.",
      },
    ],
  },
  {
    slug: "gemini-credits",
    family: "GEMINI",
    badge: "Gemini Credits",
    title: "Gemini Credits cho tác vụ linh hoạt, đa phương thức và tốc độ cao",
    description:
      "Phù hợp cho người dùng cần một lựa chọn linh hoạt cho nhiều dạng tác vụ: viết, phân tích, coding, xử lý hình ảnh, dữ liệu và workflow hằng ngày.",
    audienceTitle: "Gemini Credits phù hợp cho ai?",
    audienceDescription:
      "Nếu bạn cần xử lý nhiều loại tác vụ trong cùng một luồng công việc, Gemini Credits giúp bạn linh hoạt triển khai hơn trên nền tảng TzoShop.",
    bestFor: ["Tác vụ đa dạng", "Multimodal workflow", "Tốc độ nhanh", "Chi phí hợp lý"],
    useCases: [
      "Phân tích nội dung nhiều định dạng",
      "Viết và biên tập",
      "Hỗ trợ coding",
      "Tổng hợp thông tin",
      "Lên ý tưởng",
      "Hỗ trợ học tập/công việc",
    ],
    faqs: [
      {
        q: "Gemini Credits có phù hợp cho công việc đa nhiệm không?",
        a: "Có. Đây là lựa chọn phù hợp khi bạn cần luân phiên nhiều dạng tác vụ trong ngày.",
      },
      {
        q: "Tôi có thể dùng cho cả nội dung và coding không?",
        a: "Có. Bạn có thể dùng linh hoạt cho viết, phân tích và hỗ trợ lập trình.",
      },
      {
        q: "Nên bắt đầu từ gói nào cho nhu cầu phổ thông?",
        a: "Bạn có thể bắt đầu từ Mini hoặc Plus tùy tần suất sử dụng hằng tuần.",
      },
      {
        q: "Gemini Credits có phù hợp cho team nhỏ không?",
        a: "Có. Team nhỏ có thể theo dõi usage tập trung và điều chỉnh gói theo nhu cầu.",
      },
    ],
  },
  {
    slug: "deepseek-credits",
    family: "DEEPSEEK",
    badge: "DeepSeek Credits",
    title: "DeepSeek Credits cho reasoning, coding và nhu cầu tối ưu chi phí",
    description:
      "Phù hợp cho người dùng muốn cân bằng giữa hiệu năng và chi phí, đặc biệt ở các tác vụ reasoning, coding, phân tích và xử lý công việc thường ngày.",
    audienceTitle: "DeepSeek Credits phù hợp cho ai?",
    audienceDescription:
      "Nếu bạn ưu tiên hiệu quả chi phí nhưng vẫn muốn xử lý tốt các tác vụ logic và coding, DeepSeek Credits là một lựa chọn thực tế trên TzoShop.",
    bestFor: ["Coding tiết kiệm", "Reasoning", "Tác vụ thường ngày", "Người dùng cần tối ưu chi phí"],
    useCases: [
      "Giải bài toán logic",
      "Hỗ trợ viết code",
      "Phân tích yêu cầu",
      "Tóm tắt nội dung",
      "Chat workflow cơ bản",
      "Tối ưu chi phí sử dụng",
    ],
    faqs: [
      {
        q: "DeepSeek Credits có phù hợp để bắt đầu tiết kiệm chi phí không?",
        a: "Có. Bạn có thể bắt đầu từ gói nhỏ và mở rộng khi nhu cầu tăng lên.",
      },
      {
        q: "Tôi có thể dùng cho coding hằng ngày không?",
        a: "Có. DeepSeek Credits phù hợp cho các tác vụ coding và reasoning thường gặp.",
      },
      {
        q: "Có phù hợp cho cá nhân và freelancer không?",
        a: "Có. Đây là lựa chọn phù hợp khi bạn cần cân đối hiệu năng và ngân sách.",
      },
      {
        q: "Khi nào nên nâng gói?",
        a: "Khi credits tiêu thụ ổn định ở mức cao, bạn nên nâng gói để tránh gián đoạn công việc.",
      },
    ],
  },
];

export const creditPageBySlug = Object.fromEntries(
  creditProductPages.map((item) => [item.slug, item]),
) as Record<string, ProductPageConfig>;

