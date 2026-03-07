const form = document.getElementById("login-form") as HTMLFormElement;
const error = document.getElementById("error")!;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  error.classList.add("hidden");

  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (res.ok) {
    window.location.href = "/write";
  } else {
    error.textContent = "Wrong password";
    error.classList.remove("hidden");
  }
});
