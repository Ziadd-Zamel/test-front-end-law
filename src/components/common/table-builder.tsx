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

  renderRow: (_item: T, _index: number) => React.ReactNode;
  renderExtraRow?: () => React.ReactNode;

  headRowClasses?: string;
  tableHeadClassName?: string;
  emptyState?: React.ReactNode;

  pagination?: {
    currentPage: number;
    limit: number;
  };
  totalPages?: number;

  selectAllHeader?: React.ReactNode;
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
  selectAllHeader,
}: TableBuilderProps<T>) {
  const columnCount = tableHeadNames.length + (selectAllHeader ? 1 : 0);

  return (
    <div className="rounded-sm bg-white border border-gray-300">
      {tableHeader && (
        <div className="flex items-center font-semibold justify-between px-6 py-5">
          {tableHeader}
        </div>
      )}

      <Table>
        <TableHeader
          className={cn("bg-gray-100 hover:bg-gray-100 ", tableHeadClassName)}
        >
          <TableRow className={cn(headRowClasses)}>
            {selectAllHeader && (
              <TableHead className="w-[40px] text-center">
                {selectAllHeader}
              </TableHead>
            )}

            {tableHeadNames.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.headName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
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
              {tableData.map((item, index) => renderRow(item, index))}
              {renderExtraRow && renderExtraRow()}
            </>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-center items-center w-full">
          <TablePagination
            pagination={pagination}
            totalPages={totalPages || 1}
          />
        </div>
      )}
    </div>
  );
}
