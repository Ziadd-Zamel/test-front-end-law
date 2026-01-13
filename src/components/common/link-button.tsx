"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";

interface LinkButtonProps extends ButtonProps {
  href: string;
  children: ReactNode;
  openInNewTab?: boolean;
}

export default function LinkButton({
  href,
  children,
  openInNewTab = false,
  ...props
}: LinkButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (openInNewTab) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <Button variant={"ghost"} onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
