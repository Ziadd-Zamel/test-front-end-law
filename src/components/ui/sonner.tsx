"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      expand={false}
      richColors
      closeButton
      visibleToasts={3}
      toastOptions={{
        duration: 3000,
        classNames: {
          toast:
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg",
          title: "text-sm font-medium text-gray-900 dark:text-white",
          description: "text-sm text-gray-600 dark:text-gray-300",
          actionButton:
            "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90",
          cancelButton:
            "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600",
          closeButton:
            "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
