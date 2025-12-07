import { ReactNode } from "react";

import { motion } from "framer-motion";

interface StepLayoutProps {
  title: ReactNode;
  children: ReactNode;
}

export function StepLayout({ title, children }: StepLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col gap-4 items-center w-full max-w-md mx-auto"
    >
      <h1 className="font-miroslav text-4xl text-center text-[#7FAECC]">
        {title}
      </h1>
      {children}
    </motion.div>
  );
}
