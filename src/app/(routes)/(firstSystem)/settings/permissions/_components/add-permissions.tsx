"use client";
import { useState, useEffect } from "react";
import { useEmployees } from "@/hooks/use-employee";
import { useEmployeePermissions } from "@/hooks/use-employee-permissions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useUpdatePermissions from "../_hooks/use-update-permissions";
import { Loader2 } from "lucide-react";

export default function AddPermissions({
  permissions,
}: {
  permissions: Permission[];
}) {
  const [selectId, setSelectId] = useState<number>(1);

  // Get employees
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();

  // Update permissions
  const { isPending, updatePermissions } = useUpdatePermissions();

  // Selected employee ID
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Selected permissions IDs
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Get permissions of the selected employee
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useEmployeePermissions(selectedEmployee ?? "");

  // Sync API permission data into the selectedPermissions state
  useEffect(() => {
    if (permissionsData?.data) {
      // When employee changes, preload their existing permissions
      setSelectedPermissions(permissionsData.data.map((p: Permission) => p.id));
    } else {
      // Reset if no permissions found
      setSelectedPermissions([]);
    }
  }, [permissionsData]);

  // Add/remove permission from state
  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!selectedEmployee) return;

    updatePermissions(
      {
        UserId: selectedEmployee,
        PermissionIds: selectedPermissions,
      },
      {
        onSuccess: () => {
          setSelectedEmployee(null);
          setSelectedPermissions([]);
          setSelectId((prev) => prev + 1);
        },
      },
    );
  };

  // Reset form
  const handleCancel = () => {
    setSelectedEmployee(null);
    setSelectedPermissions([]);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">إدارة صلاحيات الموظفين</h2>
        <p className="text-gray-600">
          قم باختيار الموظف من القائمة، ثم حدّد الصلاحيات المسموح بها له.
        </p>
      </div>

      {/* === Employee Selector === */}
      {isLoadingEmployees ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <div className="space-y-2">
          <Label>اختر الموظف</Label>
          <Select
            value={selectedEmployee ?? undefined}
            onValueChange={(value) => setSelectedEmployee(value)}
            key={selectId}
          >
            <SelectTrigger>
              <SelectValue placeholder="-- اختر موظف --" />
            </SelectTrigger>
            <SelectContent>
              {/* Loaded employee list */}
              {employees?.data.map((emp: Employee) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Permissions Section*/}
      {selectedEmployee && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">صلاحيات الموظف</h3>

          {/* Permissions loading skeleton */}
          {isLoadingPermissions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(24)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            // List of all permissions with checkboxes
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissions.map((perm: Permission) => (
                <div
                  key={perm.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                >
                  <Checkbox
                    checked={selectedPermissions.includes(perm.id.toString())}
                    onCheckedChange={() =>
                      handlePermissionChange(perm.id.toString())
                    }
                    id={`perm-${perm.id}`}
                  />
                  <Label
                    htmlFor={`perm-${perm.id}`}
                    className="cursor-pointer flex-1"
                  >
                    {perm.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/*Action Buttons*/}
      {selectedEmployee && (
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            إلغاء
          </Button>
        </div>
      )}
    </div>
  );
}
