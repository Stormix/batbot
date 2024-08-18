import { useTransition } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface UseServerActionOptions<R = unknown> {
  onSuccess?: (response: R) => void;
  onError?: (error: string) => void;
}

const useServerAction = <T extends FieldValues, R = unknown>(
  form: UseFormReturn<T>,
  action: (values: T) => Promise<{ error?: string } & R>,
  options: UseServerActionOptions<R> = {}
) => {
  const { onSuccess, onError } = options;
  const [isPending, startTransition] = useTransition();
  const onSubmit = form.handleSubmit((values: T) =>
    startTransition(async () => {
      const response = await action(values);
      if (response.error && onError) {
        onError(response.error);
        return;
      }
      if (!response.error) {
        onSuccess?.(response);
      }
    })
  );

  return { isPending, onSubmit };
};

export default useServerAction;
