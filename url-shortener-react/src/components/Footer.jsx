import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-[#6B7280] py-8 z-40 relative border-t border-[#E5E7EB]">
      <div className="container mx-auto px-6 lg:px-14 flex flex-col lg:flex-row lg:justify-between items-center gap-4">
        <div className="text-center lg:text-left">
          <h2 className="text-xl font-bold text-[#111827] tracking-tight mb-1">Linklytics</h2>
          <p className="text-xs text-[#6B7280]">Simplifying URL shortening for efficient sharing</p>
        </div>

        <p className="mt-4 lg:mt-0 text-xs text-[#9CA3AF]">
          &copy; {new Date().getFullYear()} Linklytics. All rights reserved.
        </p>

        <div className="flex space-x-6 mt-4 lg:mt-0">
          <a href="#" className="text-[#9CA3AF] hover:text-[#111827] transition-all duration-200">
            <FaFacebook size={18} />
          </a>
          <a href="#" className="text-[#9CA3AF] hover:text-[#111827] transition-all duration-200">
            <FaTwitter size={18} />
          </a>
          <a href="#" className="text-[#9CA3AF] hover:text-[#111827] transition-all duration-200">
            <FaInstagram size={18} />
          </a>
          <a href="#" className="text-[#9CA3AF] hover:text-[#111827] transition-all duration-200">
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;