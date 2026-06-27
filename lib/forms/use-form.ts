/**
 * Use Form Hook — Lead Capture System
 *
 * React hook for managing form state, validation, and submission.
 */

import { useState, useCallback, useRef } from 'react';
import type { z } from 'zod';
import {
  validateForm,
  HONEYPOT_FIELD,
  sanitizeInput,
  type ValidationError,
} from './schema';

export type FormState<T> =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; data: T }
  | { status: 'error'; errors: ValidationError[] };

export interface UseFormOptions<T extends z.ZodType> {
  schema: T;
  onSuccess?: (data: z.infer<T>) => void;
  onError?: (errors: ValidationError[]) => void;
}

export function useForm<T extends z.ZodType>(options: UseFormOptions<T>) {
  const { schema, onSuccess, onError } = options;
  const [state, setState] = useState<FormState<z.infer<T>>>({ status: 'idle' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const submit = useCallback(
    async (formData: FormData) => {
      // Check honeypot field
      const honeypotValue = formData.get(HONEYPOT_FIELD);
      if (honeypotValue && (honeypotValue as string).length > 0) {
        // Silently reject - this is a bot
        setState({ status: 'success', data: {} as z.infer<T> });
        return;
      }

      // Sanitize all string inputs
      const sanitized = new FormData();
      formData.forEach((value, key) => {
        if (key !== HONEYPOT_FIELD && typeof value === 'string') {
          sanitized.append(key, sanitizeInput(value));
        } else {
          sanitized.append(key, value);
        }
      });

      // Validate
      const result = validateForm(schema, Object.fromEntries(sanitized));

      if (!result.success) {
        setState({ status: 'error', errors: result.errors });
        onError?.(result.errors);
        return;
      }

      // Set loading state
      setState({ status: 'submitting' });

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      try {
        // Submit to server action
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          body: JSON.stringify(result.data),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        setState({ status: 'success', data: result.data });
        onSuccess?.(result.data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        setState({
          status: 'error',
          errors: [{ field: '_form', message: 'Submission failed. Please try again.' }],
        });
        onError?.([{ field: '_form', message: 'Submission failed. Please try again.' }]);
      }
    },
    [schema, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle' });
    setTouched({});
    abortControllerRef.current?.abort();
  }, []);

  const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      if (state.status !== 'error') return undefined;
      const error = state.errors.find((e) => e.field === field);
      return error?.message;
    },
    [state]
  );

  const hasFieldError = useCallback(
    (field: string): boolean => {
      return !!(touched[field] && state.status === 'error' && getFieldError(field));
    },
    [touched, state, getFieldError]
  );

  return {
    state,
    touched,
    submit,
    reset,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    isSubmitting: state.status === 'submitting',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}
