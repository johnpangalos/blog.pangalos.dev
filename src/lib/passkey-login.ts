import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

const emailInput = document.getElementById("email") as HTMLInputElement;
const submitBtn = document.getElementById("submit-email") as HTMLButtonElement;
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

submitBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    showStatus("Please enter your email", true);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Working...";

  try {
    // Try login first
    const loginRes = await fetch("/api/auth/login-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (loginRes.ok) {
      const { options } = (await loginRes.json()) as { options: any };
      showStatus("Tap your passkey to sign in...");

      const credential = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      if (verifyRes.ok) {
        showStatus("Authenticated! Redirecting...");
        window.location.href = "/admin";
        return;
      }

      const verifyData = (await verifyRes.json()) as { error?: string };
      showStatus(verifyData.error || "Authentication failed", true);
    } else {
      const loginData = (await loginRes.json()) as { error?: string; needsRegistration?: boolean };

      if (loginData.needsRegistration || loginRes.status === 404) {
        showStatus("No passkey found. Registering a new one...");

        const regRes = await fetch("/api/auth/register-options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!regRes.ok) {
          const regData = (await regRes.json()) as { error?: string };
          showStatus(regData.error || "Registration failed", true);
          return;
        }

        const { options } = (await regRes.json()) as { options: any };
        showStatus("Create your passkey...");

        const credential = await startRegistration({ optionsJSON: options });

        const verifyRes = await fetch("/api/auth/register-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });

        if (verifyRes.ok) {
          showStatus("Passkey registered! Redirecting...");
          window.location.href = "/admin";
          return;
        }

        const verifyData = (await verifyRes.json()) as { error?: string };
        showStatus(verifyData.error || "Registration failed", true);
      } else {
        showStatus(loginData.error || "Login failed", true);
      }
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
