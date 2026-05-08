import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const painPoints = [
  {
    title: "Khó kiểm soát chi phí",
    desc: "Nhiều người dùng cần dùng AI thường xuyên nhưng không muốn trả quá nhiều cho các gói lớn ngay từ đầu.",
  },
  {
    title: "Không biết nên chọn gói nào",
    desc: "Mỗi nhu cầu sử dụng khác nhau sẽ phù hợp với một loại credits khác nhau, nên việc chọn sai gói dễ gây lãng phí.",
  },
  {
    title: "Cần dùng trong công cụ quen thuộc",
    desc: "Người dùng thường muốn dùng credits trong extension hoặc công cụ hỗ trợ đang sử dụng, thay vì phải thay đổi toàn bộ quy trình làm việc.",
  },
  {
    title: "Cần theo dõi số dư rõ ràng",
    desc: "Khi sử dụng lâu dài, người dùng cần biết còn bao nhiêu credits, gói còn hạn không và khi nào nên mua thêm.",
  },
];

const steps = [
  {
    title: "Bước 1",
    heading: "Chọn dòng credits phù hợp",
    desc: "Xác định nhu cầu chính của bạn: hỗ trợ lập trình, xử lý nội dung, học tập, làm việc hằng ngày hoặc tối ưu chi phí.",
  },
  {
    title: "Bước 2",
    heading: "Chọn gói theo mức sử dụng",
    desc: "Bắt đầu với gói nhỏ nếu bạn mới trải nghiệm. Khi nhu cầu tăng lên, bạn có thể chọn gói cao hơn để có nhiều credits và thời hạn dài hơn.",
  },
  {
    title: "Bước 3",
    heading: "Tạo API key trong tài khoản",
    desc: "Sau khi có credits, bạn tạo API key để kết nối với extension hoặc công cụ hỗ trợ tương thích.",
  },
  {
    title: "Bước 4",
    heading: "Theo dõi và quản lý sử dụng",
    desc: "Kiểm tra credits còn lại, thời hạn gói và lịch sử sử dụng để chủ động hơn trong quá trình làm việc.",
  },
];

const usageGroups = [
  {
    title: "Dùng cho lập trình",
    desc: "Phù hợp khi bạn cần hỗ trợ viết code, sửa lỗi, giải thích đoạn code, refactor hoặc làm việc với project phần mềm.",
  },
  {
    title: "Dùng cho học tập và nội dung",
    desc: "Phù hợp khi cần tóm tắt, viết lại nội dung, giải thích tài liệu, lập dàn ý hoặc xử lý các tác vụ văn bản.",
  },
  {
    title: "Dùng hằng ngày",
    desc: "Phù hợp cho các nhu cầu linh hoạt như hỏi đáp, soạn nội dung, hỗ trợ công việc, kiểm tra ý tưởng và tăng tốc quy trình cá nhân.",
  },
];

const securityNotes = [
  "Không chia sẻ API key công khai.",
  "Không gửi API key cho người lạ hoặc đăng lên mạng xã hội.",
  "Nếu nghi ngờ key bị lộ, hãy tạo key mới và thu hồi key cũ.",
  "Theo dõi credits thường xuyên để phát hiện sử dụng bất thường.",
];

const faqItems = [
  {
    question: "Tôi mới bắt đầu thì nên chọn gói nào?",
    answer:
      "Bạn nên bắt đầu bằng gói nhỏ hoặc gói dùng thử để kiểm tra mức độ phù hợp. Sau đó có thể nâng cấp khi nhu cầu sử dụng tăng lên.",
  },
  {
    question: "Credits có dùng chung giữa các dòng không?",
    answer:
      "Không. Mỗi dòng credits được tách riêng để dễ quản lý và tránh nhầm lẫn khi sử dụng.",
  },
  {
    question: "API key dùng để làm gì?",
    answer:
      "API key dùng để kết nối tài khoản của bạn với extension hoặc công cụ hỗ trợ tương thích.",
  },
  {
    question: "Tôi có cần hiểu kỹ thuật mới dùng được không?",
    answer:
      "Không. Bạn chỉ cần chọn gói phù hợp, tạo API key và dùng theo hướng dẫn trong công cụ hỗ trợ.",
  },
  {
    question: "Hết credits thì chuyện gì xảy ra?",
    answer:
      "Khi credits hết hoặc gói hết hạn, bạn cần mua thêm gói mới để tiếp tục sử dụng.",
  },
  {
    question: "Có thể theo dõi lịch sử sử dụng không?",
    answer:
      "Có. Khu vực quản lý tài khoản sẽ giúp bạn xem credits còn lại, thời hạn và lịch sử sử dụng.",
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0f0d]">
      <SiteHeader />

      <section className="hero-gradient border-b border-[#edf1ee]">
        <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-[#dfe5e1] bg-white/80 px-4 py-2 text-sm font-semibold text-[#47524d] backdrop-blur">
              Hướng dẫn sử dụng
            </div>

            <h1 className="text-5xl font-semibold tracking-[-1.5px] text-[#0b0f0d] md:text-6xl md:leading-[1.08]">
              Bắt đầu dùng credits dễ hơn, rõ ràng hơn
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#47524d]">
              Trang này giúp bạn hiểu cách chọn gói, tạo API key, dùng với
              extension hoặc công cụ hỗ trợ và theo dõi credits trong quá trình
              sử dụng.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full !bg-[#0b0f0d] px-6 py-3 text-sm font-bold !text-white transition hover:opacity-90"
              >
                Xem bảng giá
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[#dfe5e1] !bg-white px-6 py-3 text-sm font-bold !text-[#0b0f0d] transition hover:bg-[#f7f8f6]"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
            Những khó khăn thường gặp
          </h2>

          <p className="mt-4 text-base leading-7 text-[#47524d]">
            TzoShop được sắp xếp theo hướng đơn giản: chọn đúng gói, dùng đúng
            nhu cầu và quản lý credits rõ ràng.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {painPoints.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#dfe5e1] bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-[#0b0f0d]">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#47524d]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f8f6] py-20">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
              Quy trình bắt đầu
            </h2>

            <p className="mt-4 text-base leading-7 text-[#47524d]">
              Bạn không cần thao tác phức tạp. Chỉ cần đi theo thứ tự dưới đây
              để bắt đầu sử dụng.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step) => (
              <div key={step.heading} className="card-base p-6">
                <div className="mb-4 inline-flex rounded-full bg-[#e9fbf6] px-3 py-1 text-xs font-bold text-[#057a60]">
                  {step.title}
                </div>

                <h3 className="text-xl font-semibold text-[#0b0f0d]">
                  {step.heading}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#47524d]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
              Nên chọn gói theo nhu cầu nào?
            </h2>

            <p className="mt-4 text-base leading-7 text-[#47524d]">
              Thay vì chọn theo tên gói, bạn nên bắt đầu từ nhu cầu sử dụng
              thực tế. Điều này giúp tránh mua sai gói hoặc mua quá nhiều khi
              chưa cần thiết.
            </p>

            <div className="mt-8">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full !bg-[#0b0f0d] px-6 py-3 text-sm font-bold !text-white transition hover:opacity-90"
              >
                Xem các gói credits
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {usageGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-[#dfe5e1] bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-[#0b0f0d]">
                  {group.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#47524d]">
                  {group.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f6] py-20">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
                API key và bảo mật tài khoản
              </h2>

              <p className="mt-4 text-base leading-7 text-[#47524d]">
                API key giúp kết nối tài khoản của bạn với extension hoặc công
                cụ hỗ trợ. Vì key liên quan đến credits trong tài khoản, bạn
                nên quản lý cẩn thận.
              </p>
            </div>

            <div className="rounded-xl border border-[#dfe5e1] bg-white p-6">
              <h3 className="text-lg font-semibold text-[#0b0f0d]">
                Lưu ý quan trọng
              </h3>

              <div className="mt-5 space-y-3">
                {securityNotes.map((note) => (
                  <div key={note} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#00d4a4]" />
                    <p className="text-sm leading-6 text-[#47524d]">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-[-0.8px] text-[#0b0f0d]">
            Câu hỏi thường gặp
          </h2>

          <p className="mt-4 text-base leading-7 text-[#47524d]">
            Một số câu hỏi cơ bản trước khi bạn chọn gói và bắt đầu sử dụng.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {faqItems.map((item) => (
            <div key={item.question} className="card-base p-6">
              <h3 className="text-lg font-semibold text-[#0b0f0d]">
                {item.question}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#47524d]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-xl bg-[#020c0a] px-8 py-14 text-center">
          <h2 className="text-4xl font-semibold tracking-[-0.8px] text-white">
            Muốn bắt đầu an toàn hơn?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/75">
            Bạn có thể bắt đầu bằng gói nhỏ để kiểm tra mức sử dụng thực tế,
            sau đó nâng cấp khi cần nhiều credits hơn.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex min-w-[160px] items-center justify-center rounded-full !bg-white px-6 py-3 text-sm font-bold !text-[#020c0a] transition hover:opacity-90"
            >
              Xem bảng giá
            </Link>

            <Link
              href="/register"
              className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-white/25 !bg-transparent px-6 py-3 text-sm font-bold !text-white transition hover:!bg-white/10 hover:border-white/40"
            >
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
