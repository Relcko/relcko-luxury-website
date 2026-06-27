/**
 * Form Validation Schemas — Lead Capture System
 *
 * Shared validation schemas for all inquiry forms.
 */

import { z } from 'zod';

/**
 * Honeypot field name - hidden field that should remain empty
 */
export const HONEYPOT_FIELD = 'website_url';

/**
 * Common validation patterns
 */
const PHONE_PATTERN = /^\+?[\d\s\-()]{10,20}$/;
const NAME_PATTERN = /^[\p{L}\s\-']+$/u;

/**
 * Base inquiry form schema
 * Common fields for all inquiry types
 */
export const baseInquirySchema = z.object({
  // Required fields
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(NAME_PATTERN, 'First name can only contain letters and hyphens'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(NAME_PATTERN, 'Last name can only contain letters and hyphens'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || PHONE_PATTERN.test(val),
      'Please enter a valid phone number'
    ),

  // Optional fields
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),

  // Honeypot field - should always be empty
  [HONEYPOT_FIELD]: z.string().max(0, 'Invalid submission'),
});

/**
 * General inquiry form schema
 */
export const generalInquirySchema = baseInquirySchema;

/**
 * Project inquiry schema
 * Includes project reference
 */
export const projectInquirySchema = baseInquirySchema.extend({
  projectSlug: z
    .string()
    .min(1, 'Project selection is required'),
});

/**
 * Callback request schema
 * Includes preferred time
 */
export const callbackRequestSchema = baseInquirySchema.extend({
  preferredTime: z.enum(['morning', 'afternoon', 'evening', 'any'], {
    message: 'Please select a preferred time',
  }),
  bestContactNumber: z
    .string()
    .min(1, 'Contact number is required for callback')
    .regex(PHONE_PATTERN, 'Please enter a valid phone number'),
});

/**
 * Brochure download request schema
 * May include project preference
 */
export const brochureRequestSchema = baseInquirySchema.extend({
  projectSlug: z.string().optional(),
  preferredFormat: z.enum(['digital', 'print', 'both'], {
    message: 'Please select a format',
  }),
});

/**
 * Consultation booking schema
 */
export const consultationBookingSchema = baseInquirySchema.extend({
  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: 'Please select a future date' }
    ),
  preferredTime: z.enum(['morning', 'afternoon', 'evening'], {
      message: 'Please select a preferred time',
    }),
  investmentRange: z
      .enum([
        'under_500k',
        '500k_1m',
        '1m_2m',
        '2m_5m',
        '5m_plus',
        'unsure',
      ])
      .optional(),
  propertyType: z
      .enum(['apartment', 'penthouse', 'villa', 'townhouse', 'any'])
      .optional(),
});

/**
 * Form types
 */
export type InquiryFormData = z.infer<typeof baseInquirySchema>;
export type GeneralInquiryData = z.infer<typeof generalInquirySchema>;
export type ProjectInquiryData = z.infer<typeof projectInquirySchema>;
export type CallbackRequestData = z.infer<typeof callbackRequestSchema>;
export type BrochureRequestData = z.infer<typeof brochureRequestSchema>;
export type ConsultationBookingData = z.infer<typeof consultationBookingSchema>;

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate form data against a schema
 */
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: ValidationError[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return { success: false, errors };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}
