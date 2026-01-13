"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "رسالة جديدة",
    message: "تم استلام رسالة من العميل أحمد",
    time: "5د",
    unread: true,
  },
  {
    id: 2,
    title: "موعد اليوم",
    message: "اجتماع مع الفريق القانوني",
    time: "30د",
    unread: true,
  },
  {
    id: 3,
    title: "مستند جاهز",
    message: "تم إنجاز العقد المطلوب",
    time: "1س",
    unread: false,
  },
];

export default function Notifications() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 hover:bg-gray-100-accent"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full p-0 flex items-center justify-center text-[10px] font-medium border-2 border-background"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-medium text-sm">الإشعارات</h3>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-2.5 border-b last:border-b-0 hover:bg-gray-100-accent/50 cursor-pointer transition-colors ${
                notification.unread ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    notification.unread ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate leading-tight">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs h-7">
            عرض الكل
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
