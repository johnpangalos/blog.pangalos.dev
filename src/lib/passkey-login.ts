import { actions } from "astro:actions";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

const form = document.getElementById("login-form") as HTMLFormElement;
const submitBtn = form.querySelector("button[type=submit]") as HTMLButtonElement;
const successDiv = document.getElementById("status-success") as HTMLDivElement;
const errorDiv = document.getElementById("status-error") as HTMLDivElement;

function showSuccess(message: string) {
  errorDiv.hidden = true;
  successDiv.textContent = message;
  successDiv.hidden = false;
}

function showError(message: string) {
  successDiv.hidden = true;
  errorDiv.textContent = message;
  errorDiv.hidden = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const email = (formData.get("email") as string).trim();
  if (!email) {
    showError("Please enter your email");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Working...";

  try {
    // Try login first
    const loginResult = await actions.auth.loginOptions({ email });

    if (loginResult.data) {
      showSuccess("Tap your passkey to sign in...");

      const credential = await startAuthentication({ optionsJSON: loginResult.data.options });

      const verifyResult = await actions.auth.loginVerify({ credential });

      if (verifyResult.data) {
        showSuccess("Authenticated! Redirecting...");
        window.location.href = "/admin";
        return;
      }

      showError(verifyResult.error?.message || "Authentication failed");
    } else if (loginResult.error?.code === "NOT_FOUND") {
      showSuccess("No passkey found. Registering a new one...");

      const regResult = await actions.auth.registerOptions({ email });

      if (regResult.error) {
        showError(regResult.error.message || "Registration failed");
        return;
      }

      showSuccess("Create your passkey...");

      const credential = await startRegistration({ optionsJSON: regResult.data.options });

      const verifyResult = await actions.auth.registerVerify({ credential });

      if (verifyResult.data) {
        showSuccess("Passkey registered! Redirecting...");
        window.location.href = "/admin";
        return;
      }

      showError(verifyResult.error?.message || "Registration failed");
    } else {
      showError(loginResult.error?.message || "Login failed");
    }
  } catch (err: any) {
    if (err.name === "NotAllowedError") {
      showError("Passkey operation was cancelled");
    } else {
      showError(err.message || "An error occurred");
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Continue with Passkey";
  }
});
