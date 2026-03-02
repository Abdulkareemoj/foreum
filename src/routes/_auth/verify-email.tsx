import { Suspense } from "react";

import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { FieldDescription, FieldGroup } from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { Link } from "@tanstack/react-router";
import { Spinner } from "~/components/ui/spinner";


export function VerifyEmailContent() {
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const token = search.token;

  useEffect(() => {
    async function verify() {
      if (!token) return;

      setVerifying(true);
      try {
        const result = await authClient.verifyEmail({
          query: { token: token },
        });

        if (result.error) {
          setStatus("error");
          setErrorMessage(result.error.message || "Email verification failed.");
          toast.error(result.error.message || "Failed to verify email.");
        } else {
          setStatus("success");
          toast.success("Email verified successfully!");
          // Optional: auto-redirect after a delay
          setTimeout(() => navigate({ to: "/threads" }), 3000);
        }
      } catch (err) {
        console.error("Verify email error:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [token, navigate]);
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col gap-2">
          {verifying && (
            <Spinner className="animate-spin h-8 w-8 text-primary" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          )}
          {status === "error" && (
            <AlertCircle className="h-8 w-8 text-destructive" />
          )}
          {status === "idle" && <Mail className="h-8 w-8 text-primary" />}

          <h1 className="text-2xl font-bold">
            {verifying && "Verifying your email..."}
            {status === "success" && "Email verified!"}
            {status === "error" && "Verification failed"}
            {status === "idle" && "Verify your email"}
          </h1>

          <p className="text-muted-foreground text-sm">
            {verifying && "Please wait while we verify your email address..."}
            {status === "success" &&
              "Your email has been successfully verified. Redirecting to threads..."}
            {status === "error" && errorMessage}
            {status === "idle" &&
              "Click the link in your email to verify your account"}
          </p>
        </div>

        {status === "error" && (
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/sign-in">Back to sign in</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/forgot-password">Request new verification</Link>
            </Button>
          </div>
        )}

        {status === "success" && (
          <FieldDescription>
            <Link
              to="/threads"
              className="text-sm underline underline-offset-4 hover:text-primary"
            >
              Go to threads
            </Link>
          </FieldDescription>
        )}
      </FieldGroup>
    </div>
  );
}
export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmail,
})

function VerifyEmail() {
  return (
 
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
 
  );
}
