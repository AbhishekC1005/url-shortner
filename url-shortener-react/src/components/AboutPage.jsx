import React from "react";
import { FaLink, FaShareAlt, FaEdit, FaChartLine } from "react-icons/fa";
const AboutPage = () => {
  return (
    <div className="lg:px-14 sm:px-8 px-5 min-h-[calc(100vh-72px)] bg-white py-16">
      <div className="max-w-4xl mx-auto bg-white border border-[#E5E7EB] p-8 sm:p-12 rounded-2xl shadow-sm">
        <h1 className="sm:text-4xl text-[#111827] text-3xl font-bold tracking-tight mb-4">
          About <span className="text-[#2563EB]">Linklytics</span>
        </h1>
        <p className="text-[#6B7280] text-base leading-relaxed mb-12 font-normal">
          Linklytics simplifies URL shortening for efficient sharing. Easily
          generate, manage, and track your shortened links. Our mission is to
          provide a clean, high-performance, and reliable linking solution for
          professionals and teams worldwide.
        </p>
        <div className="space-y-8">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#2563EB] mr-4 flex-shrink-0 flex items-center justify-center">
              <FaLink className="text-lg" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#111827]">
                Simple URL Shortening
              </h2>
              <p className="text-[#6B7280] text-[14px] leading-relaxed font-normal">
                Experience the ease of creating short, memorable URLs in just a
                few clicks. Our intuitive interface and quick setup process
                ensure you can start shortening URLs without any hassle.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#2563EB] mr-4 flex-shrink-0 flex items-center justify-center">
              <FaShareAlt className="text-lg" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#111827]">
                Powerful Analytics
              </h2>
              <p className="text-[#6B7280] text-[14px] leading-relaxed font-normal">
                Gain insights into your link performance with our comprehensive
                analytics dashboard. Track clicks, geographical data, and
                referral sources to optimize your marketing strategies.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#2563EB] mr-4 flex-shrink-0 flex items-center justify-center">
              <FaEdit className="text-lg" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#111827]">
                Enhanced Security
              </h2>
              <p className="text-[#6B7280] text-[14px] leading-relaxed font-normal">
                Rest assured with our robust security measures. All shortened
                URLs are protected with advanced encryption, ensuring your data
                remains safe and secure.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#2563EB] mr-4 flex-shrink-0 flex items-center justify-center">
              <FaChartLine className="text-lg" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[#111827]">
                Fast and Reliable
              </h2>
              <p className="text-[#6B7280] text-[14px] leading-relaxed font-normal">
                Enjoy lightning-fast redirects and high uptime with our reliable
                infrastructure. Your shortened URLs will always be available and
                responsive, ensuring a seamless experience for your users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;