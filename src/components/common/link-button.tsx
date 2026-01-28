"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { CustomTooltip } from "./custom-tooltip";

interface LinkButtonProps extends ButtonProps {
  href: string;
  children: ReactNode;
  openInNewTab?: boolean;
  title?: string;
}

export default function LinkButton({
  href,
  children,
  openInNewTab = false,
  title,
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

  const buttonElement = (
    <Button variant={"ghost"} onClick={handleClick} {...props}>
      {children}
    </Button>
  );

  if (!title) {
    return buttonElement;
  }

  return <CustomTooltip content={title}>{buttonElement}</CustomTooltip>;
}
