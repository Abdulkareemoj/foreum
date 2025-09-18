import { z } from 'zod/v3';

//signup

export const signUpSchema = z
	.object({
		name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
		username: z
			.string()
			.min(5, { message: 'Username must be at least 5 characters.' })
			.max(25, { message: 'Username cannot exceed 30 characters.' })
			.regex(/^[a-zA-Z0-9_-]+$/, {
				message: 'Only letters, numbers, dashes, and underscores are allowed.'
			}),
		email: z.string().email({ message: 'Please enter a valid email address.' }),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
		image: z.string().optional()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

//signin
export const signInSchema = z.object({
	email: z.string().email({
		message: 'Email or username is required.'
	}),
	password: z.string().min(1, {
		message: 'Password is required.'
	})
});

export type SignInFormValues = z.infer<typeof signInSchema>;

//forgot-password
export const forgotPasswordSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.'
	})
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

//reset-password
export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match'
	});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

//verify-email
export const verifyEmailSchema = z.object({
	otp: z.string().length(6, {
		message: 'OTP is required.'
	}),
	email: z.string().email()
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

// thread
export const threadSchema = z.object({
	title: z.string().min(1).max(200, { message: 'Title must be between 1 and 200 characters.' }),
	content: z.string().min(1, { message: 'Content is required.' }),
	categoryId: z.string().min(1, { message: 'Category is required.' }),
	tags: z
		.array(z.string(), {
			required_error: 'Tags are required.'
		})
		.optional()
});

export type ThreadInput = z.infer<typeof threadSchema>;

export const profileSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(30, 'Username must be at most 30 characters')
		.regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores and dashes allowed'),
	displayUsername: z.string().max(100).optional(),
	bio: z.string().max(160).optional(),
	location: z.string().max(100).optional(),
	website: z.string().url().optional().or(z.literal('')),
	image: z.string().url().optional()
});
