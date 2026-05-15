"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { LandingPublicFooter, LandingPublicNavbar } from "@/components/layout/landing-public-chrome";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { TextFadeInUp } from "@/components/ui/text-fade-in-up";

export type LegalSection = {
  id: string;
  title: string;
  body: string;
};

type LegalPageProps = {
  badge: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPage({ badge, title, description, updatedAt, sections }: LegalPageProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSectionId((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-950">
      <LandingPublicNavbar />

      <section className="relative overflow-hidden border-b border-slate-200 py-10 sm:py-12 lg:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300 to-violet-300 opacity-20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-gradient-to-br from-violet-300 to-indigo-300 opacity-20 blur-3xl"
        />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <TextFadeInUp as="p" className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {badge}
          </TextFadeInUp>
          <TextFadeInUp as="h1" delay={0.08} className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{title}</TextFadeInUp>
          <TextFadeInUp as="p" delay={0.14} className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{description}</TextFadeInUp>
          <TextFadeInUp as="p" delay={0.2} className="mt-3 text-sm font-medium text-slate-500">{updatedAt}</TextFadeInUp>
        </div>
      </section>

      <section className="pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto w-full max-w-6xl px-4 tz-animate-fade-up sm:px-6 lg:px-8">
          <div className="mt-10 space-y-4 sm:space-y-5">
            {sections.map((section) => {
              const isOpen = openSectionId === section.id;

              return (
                <article
                  key={section.id}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ease-out ${
                    isOpen
                      ? "border-indigo-200 shadow-[0_18px_45px_-20px_rgba(79,70,229,0.30)]"
                      : "border-slate-200 shadow-[0_12px_30px_-18px_rgba(79,70,229,0.22)] hover:border-indigo-100 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-slate-950 transition-colors duration-200 sm:px-8 sm:py-6 sm:text-lg ${
                      isOpen ? "bg-indigo-50/40" : "hover:bg-slate-50"
                    }`}
                    aria-expanded={isOpen}
                    aria-controls={`legal-content-${section.id}`}
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-600" : "text-slate-500"}`}
                    />
                  </button>

                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div id={`legal-content-${section.id}`} className="px-6 pb-6 sm:px-8 sm:pb-7">
                        <p className="text-base leading-8 text-slate-600">{section.body}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-indigo-50/70 p-5 shadow-sm tz-animate-fade-up tz-delay-100 sm:mt-12 sm:p-6">
            <TextFadeInUp as="h2" className="text-lg font-bold text-slate-950 sm:text-xl">Cần hỗ trợ thêm?</TextFadeInUp>
            <TextFadeInUp as="p" delay={0.08} className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
              Liên hệ TzoShop nếu bạn có câu hỏi về nội dung pháp lý hoặc tài khoản.
            </TextFadeInUp>
            <CosmicButton
              href="mailto:support@tzoshop.io.vn"
              className="mt-4"
            >
              <Mail className="h-4 w-4" />
              Gửi email
            </CosmicButton>
          </div>
        </div>
      </section>

      <LandingPublicFooter />
    </main>
  );
}
