"use client";
import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you're using your custom Button component
import { useRefreshToken } from "@/app/auth/_hooks/use-auth";

const RefreshTokenButton: React.FC = () => {
  const { isPending, error, refreshToken } = useRefreshToken();

  const handleClick = async () => {
    // Call the sendVerificationCode function when the button is clicked
    refreshToken();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending} // Disable button while the mutation is pending
      variant="default"
      size="default"
      className="gap-2 rounded-xl px-6 py-2.5 font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.97] shadow-md hover:shadow-lg"
    >
      {isPending ? "جاري تحديث الجلسة..." : "تحديث الجلسة"}
    </Button>
  );
};

export default RefreshTokenButton;
