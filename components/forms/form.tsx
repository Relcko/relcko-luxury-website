'use client';

/**
 * Form Component — Lead Capture System
 *
 * Reusable form component with validation, states, and accessibility.
 */

import { forwardRef, useState, useCallback, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { HONEYPOT_FIELD } from '@/lib/forms/schema';
import type { ValidationError } from '@/lib/forms/schema';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface FormProps {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Button text */
  buttonText?: string;
  /** Success message */
  successMessage?: string;
  /** Success title */
  successTitle?: string;
  /** Schema for validation */
  schema: unknown;
  /** Function to handle form submission */
  onSubmit: (data: FormData) => Promise<void>;
  /** Class name for styling */
  className?: string;
  /** Children - form fields */
  children?: React.ReactNode;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      title,
      description,
      buttonText = 'Submit',
      successMessage = 'Thank you! We will contact you shortly.',
      successTitle = 'Message Sent',
      onSubmit,
      className,
      children,
    },
    ref
  ) => {
const [status, setStatus] = useState<FormStatus>('idle');
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const errorRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    const handleSubmit = useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrors([]);

        const formData = new FormData(e.currentTarget);

        try {
          await onSubmit(formData);
          setStatus('success');
          // Focus the success message for accessibility
          setTimeout(() => {
            successRef.current?.focus();
          }, 100);
        } catch (err) {
          setStatus('error');
          if (err && typeof err === 'object' && 'errors' in err) {
            setErrors((err as { errors: ValidationError[] }).errors);
          } else {
            setErrors([
              { field: '_form', message: 'Submission failed. Please try again.' },
            ]);
          }
          // Focus the error summary for accessibility
          setTimeout(() => {
            errorRef.current?.focus();
          }, 100);
        }
      },
      [onSubmit]
    );

    // Success state
    if (status === 'success') {
      return (
        <div
          className={cn('flex flex-col items-center gap-4 text-center py-12', className)}
          role="alert"
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
            <svg
              className="h-8 w-8 text-accent-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <Text as="p" size="lg" tone="primary">
            {successTitle}
          </Text>
          <Text as="p" size="sm" tone="muted">
            {successMessage}
          </Text>
        </div>
      );
    }

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn('flex flex-col gap-6', className)}
noValidate
        aria-label={title}
      >
{title && (
          <h2 className="text-xl text-text-primary font-medium">
            {title}
          </h2>
        )}

        {description && (
          <Text as="p" size="sm" tone="muted">
            {description}
          </Text>
        )}

        {/* Error summary */}
        {status === 'error' && errors.length > 0 && (
          <div
            ref={errorRef}
            role="alert"
            tabIndex={-1}
            className="flex flex-col gap-2 rounded-md border border-red-500/20 bg-red-500/5 p-4"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-red-500">
              Please correct the errors below.
            </p>
            <ul className="list-inside list-disc">
              {errors.map((error, i) => (
                <li key={i} className="text-sm text-red-500">
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form fields */}
        <div className="flex flex-col gap-5">{children}</div>

        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
          aria-hidden="true"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'flex h-14 w-full items-center justify-center rounded-md font-medium',
            'bg-accent-gold text-white transition-all',
            'hover:bg-accent-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {status === 'submitting' ? 'Submitting...' : buttonText}
        </button>
      </form>
    );
  }
);

Form.displayName = 'Form';

/**
 * Form Field Component
 */
export interface FormFieldProps {
  /** Field name */
  name: string;
  /** Label text */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether it's required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Input type */
  type?: string;
  /** AutoComplete */
  autoComplete?: string;
}

export function FormField({
  name,
  label,
  placeholder,
  required,
  error,
  type = 'text',
  autoComplete,
}: FormFieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
className={cn(
          'flex h-12 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm',
          'transition-colors',
          'placeholder:text-text-subtle',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Select Field Component
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  required,
  error,
}: SelectFieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'flex h-12 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm',
          'transition-colors',
          'placeholder:text-text-subtle',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      >
        <option value="">{placeholder || 'Select an option'}</option>
{options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea Field Component
 */
export interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
}

export function TextareaField({
  name,
  label,
  placeholder,
  required,
  rows = 4,
  error,
}: TextareaFieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm',
          'transition-colors',
          'placeholder:text-text-subtle',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500'
        )}
      />
      {error && (
<p id={errorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
