/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const microsoftApps = [
  {
    name: "Excel",
    url: "https://office.com/launch/excel",
    backgroundColor: "#107C41",
    iconColor: "#fff",
  },
  {
    name: "Word",
    url: "https://office.com/launch/word",
    backgroundColor: "#2B579A",
    iconColor: "#fff",
  },
  {
    name: "OneDrive",
    url: "https://onedrive.live.com/",
    backgroundColor: "#0078d4",
    iconColor: "#fff",
  },
  {
    name: "Outlook",
    url: "https://outlook.office.com/",
    backgroundColor: "#0078d4",
    iconColor: "#fff",
  },
  {
    name: "Copilot",
    url: "https://copilot.microsoft.com/",
    backgroundColor: "#8B5CF6",
    iconColor: "#fff",
  },
  {
    name: "Sway",
    url: "https://sway.office.com/",
    backgroundColor: "#008272",
    iconColor: "#fff",
  },
  {
    name: "Teams",
    url: "https://teams.microsoft.com/",
    backgroundColor: "#6264A7",
    iconColor: "#fff",
  },
  {
    name: "SharePoint",
    url: "https://sharepoint.com/",
    backgroundColor: "#0078d4",
    iconColor: "#fff",
  },
  {
    name: "OneNote",
    url: "https://onenote.com/",
    backgroundColor: "#7719AA",
    iconColor: "#fff",
  },
  {
    name: "PowerPoint",
    url: "https://office.com/launch/powerpoint",
    backgroundColor: "#B7472A",
    iconColor: "#fff",
  },
];

const AppIcon = ({
  name,
  backgroundColor,
  iconColor,
}: {
  name: string;
  backgroundColor: string;
  iconColor: string;
}) => {
  const getIconLetter = (appName: string) => {
    switch (appName) {
      case "Excel":
        return "X";
      case "Word":
        return "W";
      case "OneDrive":
        return "☁";
      case "Outlook":
        return "📧";
      case "Copilot":
        return "🤖";
      case "Sway":
        return "S";
      case "Teams":
        return "T";
      case "SharePoint":
        return "📊";
      case "OneNote":
        return "📝";
      case "PowerPoint":
        return "P";
      default:
        return name[0];
    }
  };

  return (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
      style={{ backgroundColor }}
    >
      {getIconLetter(name)}
    </div>
  );
};

export default function MicrosoftLauncher() {
  const handleAppClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-100-accent group"
        >
          <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-current rounded-[1px] opacity-70 group-hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit p-4  bg-white border shadow-lg"
        align="end"
      >
        <div className="grid grid-cols-5 gap-3">
          {microsoftApps.map((app, index) => (
            <button
              key={index}
              onClick={() => handleAppClick(app.url)}
              className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200 hover:scale-105"
            >
              <AppIcon
                name={app.name}
                backgroundColor={app.backgroundColor}
                iconColor={app.iconColor}
              />
              <span className="text-xs text-gray-800 text-center leading-tight font-medium">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
