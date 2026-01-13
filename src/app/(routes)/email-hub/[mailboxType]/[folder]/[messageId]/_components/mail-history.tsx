import { formatDate } from "@/lib/utils/format-date";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MailHistory({
  messages,
}: {
  messages: { id: number; name: string; dateTime: string }[];
}) {
  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <Card className="overflow-hidden pt-0 mt-10">
      {/* Header - matching mail body header style */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            سجل المشاهدة
          </h3>
          <span className="text-sm text-gray-500 mr-auto">
            ({messages.length})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white divide-y divide-gray-100">
        {messages.map((viewer, index) => (
          <div
            key={viewer.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Avatar with blue gradient matching mail sender */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                  {getInitials(viewer.name)}
                </AvatarFallback>
              </Avatar>

              {/* Viewer info */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {viewer.name}
                </span>
                <span className="text-xs text-gray-500">
                  المشاهدة رقم {index + 1}
                </span>
              </div>
            </div>

            {/* Date/Time */}
            <div className="text-left">
              <span className="text-sm text-gray-500">
                {formatDate(viewer.dateTime)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
