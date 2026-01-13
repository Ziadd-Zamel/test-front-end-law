import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import TablePagination from "./table-pagination";

type Header = {
  headName: string;
  className?: string;
};

type TableBuilderProps<T> = {
  tableHeader: React.ReactNode;
  tableHeadNames: Header[];
  tableData: T[];
  hasFooter?: boolean;
  renderRow: (_item: T, _index: number) => React.ReactNode;
  renderExtraRow?: () => React.ReactNode;
  headRowClasses?: string;
  tableHeadClassName?: string;
  emptyState?: React.ReactNode; // New prop for custom empty state
  pagination?: {
    currentPage: number;
    limit: number;
  };
  totalPages?: number;
  totalItems?: number;
};

export function TableBuilder<T>({
  tableHeader,
  tableHeadNames,
  tableData,
  renderRow,
  renderExtraRow,
  headRowClasses,
  tableHeadClassName,
  emptyState,
  pagination,
  totalPages,
}: TableBuilderProps<T>) {
  return (
    <div className="rounded-sm bg-white border-1 border-gray-300">
      {tableHeader && (
        <div className="flex items-center font-semibold justify-between px-6 py-5">
          {tableHeader}
        </div>
      )}
      <Table>
        {/* Table header and render passed header */}
        <TableHeader
          className={cn("bg-blue-50 hover:bg-blue-100", tableHeadClassName)}
        >
          <TableRow className={cn(headRowClasses)}>
            {tableHeadNames.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.headName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Show empty state if no data */}
          {tableData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeadNames.length}
                className="h-[300px] text-center"
              >
                {emptyState || (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-medium text-gray-900">
                      لا توجد بيانات
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      لم يتم العثور على أي سجلات
                    </p>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {/* Render dynamic data no matter the structure */}
              {tableData.map((item, index) => renderRow(item, index))}

              {/* Render the create new Entry in the table */}
              {renderExtraRow && renderExtraRow()}
            </>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center items-center w-full">
        {pagination && (
          <TablePagination
            pagination={pagination}
            totalPages={totalPages || 1}
          />
        )}
      </div>
    </div>
  );
}
