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
  // Get employees
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();

  // Update permissions
  const { isPending, updatePermissions } = useUpdatePermissions();

  // Selected employee ID
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  // Selected permissions IDs
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Get permissions of the selected employee
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useEmployeePermissions(selectedEmployee ?? 0);

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
  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
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
        },
      }
    );
  };

  // Reset form
  const handleCancel = () => {
    setSelectedEmployee(null);
    setSelectedPermissions([]);
  };

  return (
    <div className="w-full box-container">
      <div className="max-w-lg mx-auto py-5 ">
        <div className="space-y-6 w-full p-5 bg-white rounded-2xl shadow-md">
          <div className="space-y-1 mb-4 text-center">
            <h2 className="text-xl font-semibold text-blue-600">
              إدارة صلاحيات الموظفين
            </h2>
            <p className="text-sm text-muted-foreground">
              قم باختيار الموظف من القائمة، ثم حدّد الصلاحيات المسموح بها له.
            </p>
          </div>
          {/* === Employee Selector === */}
          {isLoadingEmployees ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedEmployee?.toString() || ""}
              onValueChange={(value) => setSelectedEmployee(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الموظف" />
              </SelectTrigger>

              {/* Loaded employee list */}
              <SelectContent>
                {employees?.data.map((emp: Employee) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Permissions Section*/}
          {selectedEmployee && (
            <div className="space-y-2">
              <p className="font-semibold">صلاحيات الموظف</p>

              {/* Permissions loading skeleton */}
              {isLoadingPermissions ? (
                <div className="max-h-64 overflow-y-auto border rounded-md p-2 space-y-4 grid grid-cols-2 py-2">
                  {[...Array(24)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                // List of all permissions with checkboxes
                <div className="max-h-64 overflow-y-auto border rounded-md p-2 space-y-4 grid grid-cols-2 py-2">
                  {permissions.map((perm: Permission) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedPermissions.includes(perm.id)}
                        onCheckedChange={() => handlePermissionChange(perm.id)}
                        id={`perm-${perm.id}`}
                      />
                      <Label
                        htmlFor={`perm-${perm.id}`}
                        className="cursor-pointer"
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
            <div className="flex gap-2">
              <Button
                disabled={isPending}
                onClick={handleSubmit}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    جاري الحفظ
                  </>
                ) : (
                  " حفظ التغييرات"
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
