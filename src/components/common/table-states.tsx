// components/ui/table-states.tsx
import { AlertCircle, FileX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function TableEmptyState({
  title = "No data available",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  icon,
  className = "",
}: TableEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        {icon || <FileX className="h-10 w-10 text-gray-400" />}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface TableErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  error?: string | Error;
  className?: string;
}

export function TableErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading the data.",
  actionLabel = "Try again",
  onRetry,
  error,
  className = "",
}: TableErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-400" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>

      <p className="mb-2 max-w-sm text-sm text-gray-500">{description}</p>

      {errorMessage && (
        <p className="mb-6 max-w-sm text-xs text-red-600 bg-red-50 rounded px-3 py-2">
          {errorMessage}
        </p>
      )}

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface TableLoadingStateProps {
  message?: string;
  rows?: number;
  className?: string;
}

export function TableLoadingState({
  message = "Loading...",
  rows = 5,
  className = "",
}: TableLoadingStateProps) {
  return (
    <div className={`space-y-3 p-6 ${className}`}>
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>

      {/* Skeleton rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
