"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full box-container !max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            حدث خطأ غير متوقع
          </h1>

          {/* Error Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            نعتذر، حدث خطأ تقني غير متوقع. يرجى المحاولة مرة أخرى أو العودة إلى
            الصفحة الرئيسية.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-right">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                تفاصيل الخطأ (للمطورين):
              </h3>
              <p className="text-xs text-gray-600 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              حاول مرة أخرى
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Home className="w-5 h-5" />
                الصفحة الرئيسية
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              إذا استمر هذا الخطأ، يرجى التواصل مع فريق الدعم الفني
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
