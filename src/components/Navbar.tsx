"use client";

import { useEffect, useState } from "react";

const navItems = [
  { href: "#about", label: "عن مريم" },
  { href: "#services", label: "الخدمات" },
  { href: "#philosophy", label: "فلسفتي" },
];

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_16px_40px_rgba(26,26,26,0.08)]"
          : "bg-white/65 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className={`main-content flex justify-between items-center  transition-all duration-300 ${isScrolled ? "py-3" : "py-4"}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-cyan flex items-center gap-1">
            مريم <span className="text-brand-yellow font-normal">| استشارات</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-2 hover:text-brand-cyan transition-colors after:absolute after:right-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-cyan after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </div>  
        <button
          onClick={scrollToContact}
          className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-cyan transition-all shadow-lg"
        >
          حجز موعد
        </button>
      </nav>
    </header>
  );
}
