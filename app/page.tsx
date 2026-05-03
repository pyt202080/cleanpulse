"use client";

import Link from "next/link";
import {
  Sparkles,
  Phone,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Star,
  MapPin,
  Users,
  Droplets,
  Wind,
  Building2,
  Wrench,
  CalendarCheck,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";

const services = [
  {
    icon: <Sparkles size={28} />,
    name: "입주 청소",
    desc: "새 공간의 시작을 깨끗하게",
    price: "25만원~",
    time: "약 4시간",
    color: "from-blue-500 to-sky-400",
  },
  {
    icon: <Wind size={28} />,
    name: "에어컨 분해세척",
    desc: "벽걸이/스탠드 완벽 분해",
    price: "8만원~",
    time: "약 1시간",
    color: "from-sky-500 to-cyan-400",
  },
  {
    icon: <Building2 size={28} />,
    name: "사무실 청소",
    desc: "업무 환경을 쾌적하게",
    price: "30만원~",
    time: "약 3시간",
    color: "from-indigo-500 to-blue-400",
  },
  {
    icon: <Droplets size={28} />,
    name: "화장실 특수 청소",
    desc: "묵은 때 완벽 제거",
    price: "15만원~",
    time: "약 2시간",
    color: "from-teal-500 to-emerald-400",
  },
  {
    icon: <Wrench size={28} />,
    name: "바닥 왁스 코팅",
    desc: "광택 나는 바닥 완성",
    price: "20만원~",
    time: "약 2.5시간",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: <CalendarCheck size={28} />,
    name: "정기 청소",
    desc: "월 1회 꾸준한 관리",
    price: "10만원~",
    time: "약 2시간",
    color: "from-rose-500 to-pink-400",
  },
];

const stats = [
  { value: "2,500+", label: "완료된 청소" },
  { value: "98%", label: "고객 만족도" },
  { value: "5년+", label: "업력" },
  { value: "12명", label: "전문 인력" },
];

const steps = [
  {
    step: "01",
    title: "간편 예약",
    desc: "주소와 서비스를 선택하고 원하는 날짜에 예약하세요.",
    icon: <Phone size={24} />,
  },
  {
    step: "02",
    title: "전문가 배정",
    desc: "가장 가까운 전문 인력이 최적의 동선으로 배정됩니다.",
    icon: <Users size={24} />,
  },
  {
    step: "03",
    title: "완벽 시공",
    desc: "Before/After 사진 보고와 함께 꼼꼼한 청소를 진행합니다.",
    icon: <Sparkles size={24} />,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900">
                청소 잘하는 남자
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/lookup"
              className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors hidden sm:block"
            >
              예약 조회
            </Link>
            <Link href="/booking">
              <Button size="sm">예약하기</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-brand opacity-[0.03]" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-sky-200 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-200 rounded-full blur-[100px] opacity-20" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-6 animate-fade-in">
              <Zap size={14} />
              대전 No.1 청소 전문 서비스
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight animate-fade-in stagger-1">
              공간의 가치를
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, #2563eb, #0ea5e9)" }}
              >
                높이다
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-500 leading-relaxed animate-fade-in stagger-2">
              입주 청소부터 에어컨 분해세척까지,
              <br className="hidden sm:block" />
              전문가의 손길로 당신의 공간을 새롭게 만들어 드립니다.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-in stagger-3">
              <Link href="/booking" className="w-full sm:w-auto">
                <Button size="lg" icon={<ArrowRight size={18} />} className="w-full justify-center">
                  지금 예약하기
                </Button>
              </Link>
              <Link href="/lookup" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" icon={<Phone size={18} />} className="w-full justify-center">
                  예약 조회
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto mt-2 sm:mt-0">
                <Button size="lg" variant="outline" className="w-full justify-center bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100">
                  직원/관리자
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 animate-fade-in stagger-4">
              <span className="flex items-center gap-1.5">
                <Shield size={16} className="text-emerald-500" />
                배상책임보험 가입
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-brand-500" />
                당일 예약 가능
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center animate-fade-in stagger-${i + 1}`}
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-600">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              전문 청소 서비스
            </h2>
            <p className="mt-3 text-slate-500 text-lg">
              공간에 맞는 최적의 서비스를 선택하세요
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={service.name}
                className={`
                  group relative bg-white rounded-2xl border border-slate-100 p-6
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                  animate-fade-in stagger-${(i % 5) + 1}
                `}
              >
                <div
                  className={`
                    w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color}
                    flex items-center justify-center text-white mb-4
                    group-hover:scale-110 transition-transform duration-300
                  `}
                >
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{service.desc}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-bold text-brand-600">
                    {service.price}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    {service.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              간단한 3단계
            </h2>
            <p className="mt-3 text-slate-500 text-lg">
              예약부터 완료까지, 쉽고 빠르게
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`
                  relative text-center animate-fade-in stagger-${i + 1}
                `}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-5">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-brand-400 tracking-wider mb-2">
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 right-0 translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-brand-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 gradient-brand-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              고객 후기
            </h2>
            <p className="mt-3 text-slate-500 text-lg">
              실제 이용 고객님들의 생생한 후기
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                name: "김○○",
                area: "서구",
                text: "입주 청소 맡겼는데 창틀, 화장실까지 정말 깔끔하게 해주셨어요. 새 아파트 같아요!",
                rating: 5,
              },
              {
                name: "이○○",
                area: "유성구",
                text: "에어컨 분해세척 후 냄새가 싹 없어졌어요. 시간도 정확히 지켜주시고 너무 좋았습니다.",
                rating: 5,
              },
              {
                name: "박○○",
                area: "동구",
                text: "사무실 정기 청소 맡기고 있는데 항상 꼼꼼하세요. 직원들도 쾌적한 환경에서 일할 수 있어 만족합니다.",
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className={`
                  bg-white rounded-2xl p-6 border border-slate-100
                  shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                  animate-fade-in stagger-${i + 1}
                `}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-600">
                    {review.name}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    대전 {review.area}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            깨끗한 공간, 지금 시작하세요
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            간편하게 예약하고, 전문가의 손길을 경험해보세요.
          </p>
          <div className="mt-8">
            <Link href="/booking">
              <Button size="xl" icon={<ArrowRight size={20} />}>
                무료 견적 받기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-700">
                  청소 잘하는 남자
                </div>
                <div className="text-xs text-slate-400">
                  공간의 가치를 높이다
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <Link
                href="/login"
                className="hover:text-brand-600 transition-colors"
              >
                직원 로그인
              </Link>
              <span>|</span>
              <span>© 2026 Clean Pulse. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
