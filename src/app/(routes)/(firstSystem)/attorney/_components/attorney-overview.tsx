"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  Plus,
  Settings,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AttorneyOverview() {
  const router = useRouter();

  const systemFeatures = [
    {
      icon: Settings,
      title: "طلب وكالة",
      description:
        "تقديم طلب للحصول على وكالة جديدة من العملاء. قم بتعبئة نموذج الطلب وإرساله للعميل ليتم اصدار الوكاله بكل سهوله ويسر.",
      href: "/attorney/request",
    },
    {
      icon: Plus,
      title: "إضافة وكالة جديدة",
      description:
        "إنشاء طلب وكالة جديد من العملاء. ابدأ بإنشاء وكالة جديدة من خلال ملء البيانات المطلوبة وتحديد نوع الوكالة والبنود المراد اضافتها.",
      href: "/attorney/add",
    },
    {
      icon: Shield,
      title: "التحقق من الوكالات",
      description:
        "التحقق من صحة الوكالات وحالة سريانها. من خلال هذه الصفحة يمكنك التحقق من صحة الوكالات وحالة سريانها .",
      href: "/attorney/verify",
    },
    {
      icon: FileText,
      title: "إدارة الطلبات ",
      description:
        "إنشاء ومتابعة طلبات الوكالات بسهولة. يمكنك من خلال هذه الصفحة عرض جميع طلبات الوكالات ومتابعة حالتها من البداية حتى النهاية.",
      href: "/attorney/attorney-management",
    },
    {
      icon: Users,
      title: "وكالاتي",
      description:
        "عرض وإدارة جميع الوكالات المعتمدة والمنتهية والمفسوخة. يمكنك من خلال هذه الصفحة الوصول إلى جميع الوكالات التي تم اضافتها وعرض تفاصيلها.",
      href: "/attorney/my-attorneies",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-2 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
          <h1 className="text-5xl font-bold text-gray-900">
            نظام إدارة الوكالات القانونية
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          نظام متكامل لإدارة الوكالات القانونية يتيح لك إنشاء ومتابعة وإدارة
          جميع أنواع الوكالات القانونية بسهولة وأمان عالي
        </p>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {systemFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                onClick={() => router.push(feature.href)}
                className="relative cursor-pointer bg-gradient-to-br from-white to-blue-50/30  hover:shadow-xl hover:shadow-blue-700/10 transition-all duration-300 group overflow-hidden"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700/0 via-blue-700/0 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <CardHeader className="pb-3 pt-8 px-8 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="p-3.5 rounded-2xl bg-blue-100 text-blue-700 shadow-lg shadow-blue-700/20 group-hover:shadow-blue-700/40 group-hover:scale-110 transition-all duration-300 shrink-0">
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 leading-snug pt-1 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8 relative z-10">
                  <p className=" text-gray-600 text-sm">
                    {feature.description}
                  </p>

                  {/* Hover arrow indicator */}
                  <div className="flex items-center gap-2 text-blue-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 font-semibold">
                    <span className="text-sm">استكشف المزيد</span>
                    <ArrowLeft />
                  </div>
                </CardContent>

                {/* Bottom right decoration */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-700/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
