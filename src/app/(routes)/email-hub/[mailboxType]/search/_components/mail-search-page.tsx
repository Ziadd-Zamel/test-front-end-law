/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PageErrorState } from "@/components/common/page-states";
import { Loader2, Search, FileX } from "lucide-react";
import { useSearchMail } from "@/app/(routes)/email-hub/_hooks/use-mail";
import { useTaskOrCase } from "@/hooks/use-task-or-case";
import { useClientOrCompany } from "@/hooks/use-client-or-company";
import { DatePicker } from "@/components/ui/date-picker";
import EmailCard from "../../[folder]/_components/mail-card";
import { Label } from "@/components/ui/label";

export default function MailSearchPage({
  mailboxType,
}: {
  mailboxType: mailboxType;
}) {
  // Search state
  const [query, setQuery] = useState("");
  const [refType, setRefType] = useState<"task" | "case" | undefined>("case");
  const [refId, setRefId] = useState<string | undefined>();
  const [clientType, setClientType] = useState<"client" | "company">("client");
  const [clientId, setClientId] = useState<string | undefined>();
  const [messageType, setMessageType] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [hasSearched, setHasSearched] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  // Hooks
  const { data: refData, isPending: refPending } = useTaskOrCase(refType);
  const { data: clientData, isLoading: clientLoading } =
    useClientOrCompany(clientType);
  const { isPending, searchMail, searchResults, error } = useSearchMail();

  const handleSearch = () => {
    if (!query && !refId && !clientId && !messageType && !fromDate && !toDate) {
      return;
    }
    const body: any = {};

    if (query) body.query = query;
    if (refType) body.refType = refType;
    if (refId) body.refId = refId;
    if (clientId) body.clientId = clientId;
    if (messageType) body.messageType = messageType;
    if (fromDate) body.fromDate = fromDate.toISOString();
    if (toDate) body.toDate = toDate.toISOString();

    searchMail(
      {
        body: body,
        mailboxType: mailboxType,
        pageNumber: 1,
        pageSize: 20,
      },
      {
        onSuccess: (data) => {
          setAllMessages(data.messages || []);
          setPagination(data.pagination);
          setCurrentPage(1);
        },
      }
    );
    setHasSearched(true);
  };

  const handleLoadMore = () => {
    const body: any = {};

    if (query) body.query = query;
    if (refType) body.refType = refType;
    if (refId) body.refId = refId;
    if (clientId) body.clientId = clientId;
    if (messageType) body.messageType = messageType;
    if (fromDate) body.fromDate = fromDate.toISOString();
    if (toDate) body.toDate = toDate.toISOString();

    searchMail(
      {
        body: body,
        mailboxType: mailboxType,
        pageNumber: currentPage + 1,
        pageSize: 20,
      },
      {
        onSuccess: (data) => {
          setAllMessages((prev) => [...prev, ...(data.messages || [])]);
          setPagination(data.pagination);
          setCurrentPage((prev) => prev + 1);
        },
      }
    );
  };

  const handleReset = () => {
    setQuery("");
    setRefType("case");
    setRefId("");
    setClientId("");
    setMessageType("");
    setFromDate(undefined);
    setToDate(undefined);
    setHasSearched(false);
    setAllMessages([]);
    setPagination(null);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Form Card - Always Visible */}
      <div className="w-full box-container mt-5">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Search Query */}
              <div className="space-y-2">
                <Label>البحث في البريد</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث في البريد..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Row 1: Reference Type, Reference ID, Message Type */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>نوع المرجع</Label>
                  <Select
                    onValueChange={(value) => {
                      setRefType(value as "task" | "case");
                      setRefId("");
                    }}
                    value={refType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المرجع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">مهمة</SelectItem>
                      <SelectItem value="case">قضية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المعرف المرجعي</Label>
                  <Select
                    onValueChange={setRefId}
                    value={refId}
                    disabled={!refType || refPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المعرف المرجعي" />
                    </SelectTrigger>
                    <SelectContent>
                      {refData?.data?.map((item: any) => (
                        <SelectItem
                          key={item.encryptedId}
                          value={item.encryptedId}
                        >
                          {refType === "task"
                            ? item.nameOfWork
                            : item.caseTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>نوع الرسالة</Label>
                  <Select onValueChange={setMessageType} value={messageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الرسالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbox">الوارد</SelectItem>
                      <SelectItem value="sentitems">المرسل</SelectItem>
                      <SelectItem value="junk">المهملات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Client Type & Client */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع العميل</Label>
                  <Select
                    onValueChange={(value) => {
                      setClientType(value as "client" | "company");
                      setClientId(undefined);
                    }}
                    value={clientType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">عميل</SelectItem>
                      <SelectItem value="company">شركة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>العميل</Label>
                  <Select
                    onValueChange={setClientId}
                    value={clientId}
                    disabled={clientLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientData?.data?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Date Range */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>من تاريخ</Label>
                  <DatePicker
                    date={fromDate}
                    setDate={setFromDate}
                    placeholder="اختر التاريخ"
                  />
                </div>

                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <DatePicker
                    date={toDate}
                    setDate={setToDate}
                    placeholder="اختر التاريخ"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 h-11"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري البحث...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 ml-2" />
                      بحث
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-11"
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="py-10">
        {/* Initial State - No Search Yet */}
        {!hasSearched && (
          <div className="w-full box-container">
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-muted p-6">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">ابدأ البحث</h3>
                    <p className="text-muted-foreground max-w-md">
                      استخدم الفلاتر أعلاه للبحث في رسائل البريد واضغط على زر
                      البحث
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {hasSearched && isPending && allMessages.length === 0 && (
          <div className="w-full box-container">
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    جاري البحث في البريد...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {hasSearched && !isPending && error && (
          <div className="w-full box-container">
            <PageErrorState error={error as Error} />
          </div>
        )}

        {/* Empty Results State */}
        {hasSearched && !isPending && !error && allMessages.length === 0 && (
          <div className="w-full box-container">
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-muted p-6">
                    <FileX className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">لا توجد نتائج</h3>
                    <p className="text-muted-foreground max-w-md">
                      لم يتم العثور على أي رسائل تطابق معايير البحث. حاول تعديل
                      الفلاتر والبحث مرة أخرى.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results State */}
        {hasSearched && !error && allMessages.length > 0 && (
          <div className="">
            {allMessages.map((message: any) => (
              <EmailCard
                key={message.id}
                message={message}
                type="inbox"
                mailboxType="Info"
                folder="inbox"
              />
            ))}

            {pagination?.hasNextPage && (
              <div className="flex justify-center py-6 px-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={isPending}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  {isPending ? (
                    <>
                      <span>جاري التحميل...</span>
                      <Loader2 className="h-4 w-4 me-2 animate-spin" />
                    </>
                  ) : (
                    <span>تحميل المزيد</span>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
