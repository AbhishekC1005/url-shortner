import React from "react";
import { motion } from "framer-motion";
const Card = ({ title, desc }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-[#E5E7EB] p-6 flex flex-col gap-3 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all duration-150"
    >
      <h2 className="text-[#111827] text-[18px] font-semibold tracking-tight">{title}</h2>
      <p className="text-[#6B7280] text-[15px] leading-relaxed font-normal">{desc}</p>
    </motion.div>
  );
};

export default Card;