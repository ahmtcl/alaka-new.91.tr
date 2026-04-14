"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { navLinks } from "@/data/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleNavClick(href: string) {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[200] px-8 py-4 flex justify-between items-center bg-white pointer-events-none">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
          className="pointer-events-auto"
        >
          <Image
            src="/images/logo.svg"
            alt="ALAKA"
            width={120}
            height={40}
            className="max-w-[120px] md:max-w-[120px] max-w-[80px] brightness-0 hover:opacity-70 transition-opacity"
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-12 pointer-events-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-dark text-base font-medium tracking-[0.15em] uppercase no-underline hover:opacity-60 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden pointer-events-auto flex flex-col gap-[5px] w-[28px] cursor-pointer bg-transparent border-none p-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          <span
            className={`block h-[2px] w-full bg-dark transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-full bg-dark transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-full bg-dark transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[199] bg-white flex items-center justify-center animate-fade-in">
          <nav className="flex flex-col items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-dark text-2xl font-medium tracking-[0.15em] uppercase no-underline hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
