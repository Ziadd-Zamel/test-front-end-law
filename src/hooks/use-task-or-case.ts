// hooks/use-task-or-case.ts
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "./use-tasks";
import { getAllCases } from "./use-cases";

type RefType = "task" | "case";

export function useTaskOrCase(type: RefType | undefined) {
  return useQuery({
    queryKey: type ? [type === "task" ? "tasks" : "cases"] : ["no-type"],
    queryFn: () => {
      if (type === "task") {
        return getAllTasks();
      } else if (type === "case") {
        return getAllCases();
      }
      return Promise.resolve({ data: [] });
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
}
