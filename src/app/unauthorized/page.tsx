"use client";
import React from "react";
import { ShieldX, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full box-container !max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Unauthorized Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <ShieldX className="w-16 h-16 text-blue-500" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">403</span>
              </div>
            </div>
          </div>

          {/* Unauthorized Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            غير مصرح لك بالوصول
          </h1>

          {/* Unauthorized Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى
            التواصل مع المسؤول للحصول على الصلاحيات المناسبة.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                <Home className="w-5 h-5" />
                الصفحة الرئيسية
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              العودة للخلف
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم الفني
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
