import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Shield, FileText, AlertCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <ScrollText className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">السياسات</h1>
        </div>
        <p className="text-muted-foreground">
          اطلع على جميع السياسات والإجراءات الخاصة بالنظام
        </p>
      </div>

      <Separator />

      {/* Policy Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Privacy Policy */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Shield className="h-6 w-6 text-blue-500" />
              <Badge variant="secondary">نشط</Badge>
            </div>
            <CardTitle className="text-xl">سياسة الخصوصية</CardTitle>
            <CardDescription>
              تعرف على كيفية حماية بياناتك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              نحن نلتزم بحماية خصوصيتك وأمان معلوماتك. هذه السياسة توضح كيفية
              جمع واستخدام وحماية بياناتك الشخصية.
            </p>
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                آخر تحديث: ١٥ سبتمبر ٢٠٢٥
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileText className="h-6 w-6 text-green-500" />
              <Badge variant="secondary">نشط</Badge>
            </div>
            <CardTitle className="text-xl">شروط الاستخدام</CardTitle>
            <CardDescription>القواعد والشروط العامة للنظام</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              باستخدام هذا النظام، فإنك توافق على الالتزام بهذه الشروط والأحكام.
              يرجى قراءتها بعناية قبل الاستخدام.
            </p>
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                آخر تحديث: ١٠ سبتمبر ٢٠٢٥
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security Policy */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <Badge variant="secondary">نشط</Badge>
            </div>
            <CardTitle className="text-xl">سياسة الأمان</CardTitle>
            <CardDescription>إجراءات الأمان وحماية المعلومات</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              نطبق أعلى معايير الأمان لحماية بياناتك. تعرف على الإجراءات الأمنية
              المتبعة في النظام.
            </p>
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                آخر تحديث: ٥ سبتمبر ٢٠٢٥
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Data Usage Policy */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileText className="h-6 w-6 text-purple-500" />
              <Badge variant="secondary">نشط</Badge>
            </div>
            <CardTitle className="text-xl">سياسة استخدام البيانات</CardTitle>
            <CardDescription>كيفية استخدام ومعالجة البيانات</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              نوضح هنا كيفية جمع البيانات واستخدامها ومشاركتها مع الأطراف
              المعنية بما يتوافق مع القوانين المحلية.
            </p>
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                آخر تحديث: ١ سبتمبر ٢٠٢٥
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Policy */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <ScrollText className="h-6 w-6 text-yellow-500" />
              <Badge variant="secondary">نشط</Badge>
            </div>
            <CardTitle className="text-xl">
              سياسة ملفات تعريف الارتباط
            </CardTitle>
            <CardDescription>معلومات حول استخدام Cookies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك. تعرف على أنواع الملفات
              المستخدمة وكيفية إدارتها.
            </p>
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                آخر تحديث: ٢٥ أغسطس ٢٠٢٥
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use Policy */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Shield className="h-6 w-6 text-red-500" />
              <Badge variant="secondary">نشط</Badge>
            </div>
            <CardTitle className="text-xl">سياسة الاستخدام المقبول</CardTitle>
            <CardDescription>القواعد والمعايير المقبولة</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              توضح هذه السياسة الاستخدامات المقبولة وغير المقبولة للنظام
              والعواقب المترتبة على المخالفات.
            </p>
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">
                آخر تحديث: ٢٠ أغسطس ٢٠٢٥
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            ملاحظة هامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            يتم تحديث السياسات بشكل دوري لضمان التوافق مع القوانين واللوائح
            المحلية والدولية. يرجى مراجعة السياسات بانتظام للبقاء على اطلاع
            بأحدث التغييرات.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
