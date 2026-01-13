import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logMailRead } from "../_actions/log-read";

export default function useLogMail() {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: async (mailId: string) => {
      const result = await logMailRead(mailId);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ["mail"],
        exact: false,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    isPending,
    error,
    LogMail: mutate,
  };
}
