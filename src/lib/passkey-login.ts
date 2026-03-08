import { actions, isInputError } from "astro:actions";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

const form = document.getElementById("login-form") as HTMLFormElement;
const submitBtn = form.querySelector("button[type=submit]") as HTMLButtonElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;

function showStatus(message: string, isError = false) {
  statusDiv.textContent = message;
  statusDiv.classList.remove("hidden", "bg-red-100", "text-red-700", "bg-green-100", "text-green-700", "dark:bg-red-900", "dark:text-red-300", "dark:bg-green-900", "dark:text-green-300");
  if (isError) {
    statusDiv.classList.add("bg-red-100", "text-red-700", "dark:bg-red-900", "dark:text-red-300");
  } else {
    statusDiv.classList.add("bg-green-100", "text-green-700", "dark:bg-green-900", "dark:text-green-300");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const email = (formData.get("email") as string).trim();
  if (!email) {
    showStatus("Please enter your email", true);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Working...";

  try {
    // Try login first
    const loginResult = await actions.auth.loginOptions({ email });

    if (loginResult.data) {
      showStatus("Tap your passkey to sign in...");

      const credential = await startAuthentication({ optionsJSON: loginResult.data.options });

      const verifyResult = await actions.auth.loginVerify({ credential });

      if (verifyResult.data) {
        showStatus("Authenticated! Redirecting...");
        window.location.href = "/admin";
        return;
      }

      showStatus(verifyResult.error?.message || "Authentication failed", true);
    } else if (loginResult.error?.code === "NOT_FOUND") {
      showStatus("No passkey found. Registering a new one...");

      const regResult = await actions.auth.registerOptions({ email });

      if (regResult.error) {
        showStatus(regResult.error.message || "Registration failed", true);
        return;
      }

      showStatus("Create your passkey...");

      const credential = await startRegistration({ optionsJSON: regResult.data.options });

      const verifyResult = await actions.auth.registerVerify({ credential });

      if (verifyResult.data) {
        showStatus("Passkey registered! Redirecting...");
        window.location.href = "/admin";
        return;
      }

      showStatus(verifyResult.error?.message || "Registration failed", true);
    } else {
      showStatus(loginResult.error?.message || "Login failed", true);
    }
  } catch (err: any) {
    if (err.name === "NotAllowedError") {
      showStatus("Passkey operation was cancelled", true);
    } else {
      showStatus(err.message || "An error occurred", true);
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Continue with Passkey";
  }
});
