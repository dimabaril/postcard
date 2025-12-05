import { ReactNode } from "react";

interface StepLayoutProps {
  title: ReactNode;
  children: ReactNode;
}

export function StepLayout({ title, children }: StepLayoutProps) {
  return (
    <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
      <h1 className="font-miroslav text-4xl text-center text-[#7FAECC]">
        {title}
      </h1>
      {children}
    </div>
  );
}
