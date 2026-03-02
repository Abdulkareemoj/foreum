

import { Suspense, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  resetPasswordSchema,
} from "~/lib/schemas";
import { resetPassword } from "~/lib/auth-client";
import { KeyRound } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";



function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const token = search.token;

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        setServerError("Invalid reset token");
        toast.error("Invalid reset token");
        return;
      }

      setIsLoading(true);
      setServerError(null);

      try {
        const result = await resetPassword({
          newPassword: value.password,
          token,
        });

        if (result.error) {
          setServerError(result.error.message || "Failed to reset password");
          toast.error("Failed to reset password");
        } else {
          toast.success("Password reset successfully!");
          navigate({ to: "/sign-in" });
        }
      } catch (error) {
        setServerError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col gap-2">
          <KeyRound className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your new password below
          </p>
        </div>

        {serverError && (
          <FieldError className="text-center">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </FieldError>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="•••••••••"
                    aria-invalid={isInvalid}
                    disabled={isLoading}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />

          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="•••••••••"
                    aria-invalid={isInvalid}
                    disabled={isLoading}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              Reset Password
            </Button>
          </Field>
        </form>

        <FieldDescription>
          <Link
            to="/"
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Back to sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </div>
  );
}

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPassword,
})

function ResetPassword() {
  return (
 
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
 
  );
}
