"use client";
import { useRef, useState } from "react";

interface PdfFile {
  file: File;
  name: string;
  description: string;
}

interface PdfUploaderProps {
  value?: PdfFile | null;
  onChange: (data: PdfFile | null) => void;
  error?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  size?: "small" | "default";
}

export default function PdfUploader({
  value,
  onChange,
  error,
  maxSizeMB = 5,
  disabled = false,
  size = "default",
}: PdfUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(
    value?.file || null,
  );
  const [fileName, setFileName] = useState(value?.name || "");
  const [fileDescription, setFileDescription] = useState(
    value?.description || "",
  );
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      updateParent(file, fileName, fileDescription);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      updateParent(file, fileName, fileDescription);
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFileDescription("");
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const updateParent = (file: File | null, name: string, desc: string) => {
    if (file && name.trim() && desc.trim()) {
      onChange({
        file: file,
        name: name,
        description: desc,
      });
    } else {
      onChange(null);
    }
  };

  const handleNameChange = (newName: string) => {
    setFileName(newName);
    updateParent(selectedFile, newName, fileDescription);
  };

  const handleDescriptionChange = (newDesc: string) => {
    setFileDescription(newDesc);
    updateParent(selectedFile, fileName, newDesc);
  };

  const isSmall = size === "small";

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex ${
            isSmall ? "flex-row gap-3 px-4" : "flex-col"
          } items-center justify-center w-full ${
            isSmall ? "h-20" : "h-48"
          } border-2 border-dashed rounded-xl transition-all duration-300 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : dragActive
                ? "border-blue-500 bg-blue-50 scale-[1.02] cursor-pointer"
                : selectedFile
                  ? "border-green-500 bg-green-50 hover:bg-green-100 cursor-pointer"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 cursor-pointer"
          }`}
        >
          {selectedFile ? (
            <div
              className={`flex ${
                isSmall ? "flex-row gap-3" : "flex-col space-y-3"
              } items-center pointer-events-none`}
            >
              <div
                className={`${
                  isSmall ? "w-10 h-10" : "w-16 h-16"
                } bg-green-500 rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <svg
                  className={`${isSmall ? "w-5 h-5" : "w-8 h-8"} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div
                className={isSmall ? "text-right flex-1" : "text-center px-4"}
              >
                <p
                  className={`${
                    isSmall ? "text-xs" : "text-sm"
                  } font-medium text-green-700`}
                >
                  تم اختيار الملف بنجاح
                </p>
                <p
                  className={`text-xs text-green-600 ${
                    isSmall ? "" : "mt-1"
                  } max-w-xs truncate`}
                >
                  {selectedFile.name}
                </p>
                {!isSmall && (
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>
              {!isSmall && (
                <p className="text-xs text-gray-600 mt-2">انقر لتغيير الملف</p>
              )}
            </div>
          ) : (
            <div
              className={`flex ${
                isSmall ? "flex-row gap-3" : "flex-col space-y-3"
              } items-center pointer-events-none`}
            >
              <div
                className={`${
                  isSmall ? "w-10 h-10" : "w-16 h-16"
                } bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <svg
                  className={`${isSmall ? "w-5 h-5" : "w-8 h-8"} text-blue-600`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className={isSmall ? "text-right flex-1" : "text-center"}>
                <p
                  className={`${
                    isSmall ? "text-xs" : "text-sm"
                  } font-medium text-gray-700`}
                >
                  {isSmall ? "اختر ملف PDF" : "اسحب وأفلت ملف PDF هنا"}
                </p>
                {!isSmall && (
                  <p className="text-xs text-gray-500 mt-1">
                    أو انقر للاختيار من جهازك
                  </p>
                )}
              </div>
              {!isSmall && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    PDF فقط
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    حتى {maxSizeMB} ميجابايت
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedFile && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className={`absolute ${
              isSmall ? "top-1 left-1" : "top-2 left-2"
            } bg-red-500 hover:bg-red-600 text-white rounded-full ${
              isSmall ? "p-1" : "p-2"
            } transition-colors shadow-lg z-10`}
          >
            <svg
              className={`${isSmall ? "w-3 h-3" : "w-4 h-4"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Name and Description - ALWAYS VISIBLE */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="pdf-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            اسم الملف <span className="text-red-500">*</span>
          </label>
          <input
            id="pdf-name"
            type="text"
            value={fileName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="أدخل اسم الملف"
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-right"
          />
        </div>

        <div>
          <label
            htmlFor="pdf-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            وصف الملف <span className="text-red-500">*</span>
          </label>
          <textarea
            id="pdf-description"
            value={fileDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="أدخل وصف الملف"
            disabled={disabled}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none text-right"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
