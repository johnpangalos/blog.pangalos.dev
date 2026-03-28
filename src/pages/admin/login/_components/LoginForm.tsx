import { useState } from "react";
import { actions } from "astro:actions";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import {
  Button,
  Field,
  Input,
  Label,
} from "@headlessui/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setError(null);
    setSuccess(msg);
  };

  const showError = (msg: string) => {
    setSuccess(null);
    setError(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      showError("Please enter your email");
      return;
    }

    setSubmitting(true);

    try {
      const loginResult = await actions.auth.loginOptions({ email: trimmed });

      if (loginResult.error && loginResult.error.code !== "NOT_FOUND") {
        showError(loginResult.error.message || "Login failed");
        return;
      }

      if (loginResult.data) {
        showSuccess("Tap your passkey to sign in...");

        try {
          const credential = await startAuthentication({
            optionsJSON: loginResult.data.options,
          });
          const verifyResult = await actions.auth.loginVerify({ credential });

          if (verifyResult.error) {
            showError(verifyResult.error.message || "Authentication failed");
            return;
          }

          showSuccess("Authenticated! Redirecting...");
          window.location.href = "/admin";
          return;
        } catch (authErr: any) {
          if (authErr.name === "NotAllowedError") {
            showSuccess(
              "No passkey found for this domain. Registering a new one...",
            );
          } else {
            throw authErr;
          }
        }
      } else {
        showSuccess("No passkey found. Registering a new one...");
      }

      const regResult = await actions.auth.registerOptions({ email: trimmed });

      if (regResult.error) {
        showError(regResult.error.message || "Registration failed");
        return;
      }

      showSuccess("Create your passkey...");

      const credential = await startRegistration({
        optionsJSON: regResult.data.options,
      });
      const verifyResult = await actions.auth.registerVerify({ credential });

      if (verifyResult.error) {
        showError(verifyResult.error.message || "Registration failed");
        return;
      }

      showSuccess("Passkey registered! Redirecting...");
      window.location.href = "/admin";
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        showError("Passkey operation was cancelled");
      } else {
        showError(err.message || "An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Field>
          <Label className="mb-2 block text-sm font-medium">Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 dark:border-stone-600 dark:bg-stone-800 dark:text-white"
          />
        </Field>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-fuchsia-700 px-4 py-2 font-medium text-white hover:bg-fuchsia-800 disabled:opacity-50 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700"
        >
          {submitting ? "Working..." : "Continue with Passkey"}
        </Button>
      </form>

      {success && (
        <div className="mt-4 rounded bg-green-100 p-3 text-center text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded bg-red-100 p-3 text-center text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
    </>
  );
}
