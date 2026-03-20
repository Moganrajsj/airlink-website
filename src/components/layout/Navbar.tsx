"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Phone, Mail, MapPin, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Plans', href: '/plans' },
    { name: 'Infrastructure', href: '/infrastructure' },
    { name: 'Speed Test', href: '/speed-test' },
    { name: 'Coverage', href: '/coverage' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 navbar ${scrolled ? 'shadow-md' : ''}`}>
      {/* Top Thin Bar */}
      <div className={`w-full bg-secondary text-white/80 py-1.5 transition-all duration-500 overflow-hidden ${scrolled ? 'h-0 opacity-0 py-0' : 'h-auto opacity-100'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center text-xs font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <a href="tel:+919344584000" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone size={12} className="text-primary" /> +91 93445 84000 | +91 93452 17979
            </a>
            <a href="mailto:info@srirambroadband.com" className="hidden sm:flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={12} className="text-primary" /> info@srirambroadband.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-primary" />
              <span>Dharmapuri <span className="text-white/30 mx-1">|</span> Chennai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl py-2 border-b border-gray-100' : 'bg-white py-3'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">

          {/* Logo and Brand Line */}
          <Link href="/" className="group flex flex-col pt-1">
            <img
              src="/airlink-logo.png"
              alt="Airlink Broadband"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith('/plans') && link.name === 'Plans');
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 relative group py-2 
                                            ${isActive ? 'text-primary' : 'text-secondary/70 hover:text-secondary'}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-primary transition-all duration-300 
                                            ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side Buttons */}
          <div className="hidden xl:flex items-center gap-5">
            <Link href="/contact" className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2">
              Get Connected <ArrowUpRight size={16} strokeWidth={3} />
            </Link>
          </div>

          {/* Mobile Menu Btn */}
          <button
            className="xl:hidden p-2 rounded-xl bg-surface border border-gray-100 text-secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-1 max-h-[75vh] overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-[15px] font-black p-4 rounded-xl flex items-center justify-between group transition-all duration-300 uppercase tracking-[0.15em]
                                            ${pathname === link.href ? 'bg-primary text-secondary shadow-sm' : 'text-secondary/80 hover:bg-surface hover:text-secondary'}`}
                  >
                    {link.name}
                    <ArrowUpRight className={`transition-opacity ${pathname === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} size={18} />
                  </Link>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="w-full bg-[#0A192F] text-white py-4 rounded-xl font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 hover:bg-[#FBBF24] hover:text-[#0A192F] transition-colors shadow-md">
                    Get Connected <ArrowUpRight size={18} className="stroke-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
