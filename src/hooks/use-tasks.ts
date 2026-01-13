import { useQuery } from "@tanstack/react-query";

export const getAllTasks = async () => {
  const response = await fetch("/api/tasks", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
    staleTime: 5 * 60 * 1000,
  });
}
