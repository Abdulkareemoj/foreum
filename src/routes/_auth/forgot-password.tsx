

import { useState } from "react";
import { useForm } from "@tanstack/react-form"
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
  forgotPasswordSchema,
} from "~/lib/schemas";
import { requestPasswordReset } from "~/lib/auth-client";
import { Spinner } from "~/components/ui/spinner";
import { Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { createFileRoute, Link } from "@tanstack/react-router";


export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({
    type: null,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setStatus({ type: null, message: null });

      try {
        const result = await requestPasswordReset({
          email: value.email,
          redirectTo: "/reset-password",
        });

        if (result.error) {
          setStatus({
            type: "error",
            message: result.error.message || "Failed to send reset email",
          });
          toast.error("Failed to send reset email");
        } else {
          setStatus({
            type: "success",
            message: "Password reset email sent! Check your inbox.",
          });
          toast.success("Password reset email sent!");
        }
      } catch (error) {
        setStatus({
          type: "error",
          message: "An unexpected error occurred",
        });
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
          <Mail className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below and we'll send you a link to reset your
            password
          </p>
        </div>

        {status.type && (
          <FieldError
            className={status.type === "success" ? "text-green-600" : ""}
          >
            <Alert variant={status.type === "success" ? "default" : "destructive"}>
              <AlertTitle>{status.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription> {status.message}</AlertDescription>
            </Alert>
          </FieldError>
        )}

        {!status.type || status.type === "error" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="email"
                      placeholder="m@example.com"
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
                Send Reset Email
              </Button>
            </Field>
          </form>
        ) : null}

        <FieldDescription>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </div>
  );
}
