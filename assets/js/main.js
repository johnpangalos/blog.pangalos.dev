function setDarkMode() {
  const root = document.getElementById("root");
  const sun = document.getElementById("sun");
  const moon = document.getElementById("moon");
  root.classList.add("dark");
  sun.classList.remove("hidden");
  moon.classList.add("hidden");
  localStorage.theme = "dark";
}

function setLightMode() {
  const root = document.getElementById("root");
  const sun = document.getElementById("sun");
  const moon = document.getElementById("moon");
  root.classList.remove("dark");
  sun.classList.add("hidden");
  moon.classList.remove("hidden");
  localStorage.theme = "light";
}

function toggleDarkMode() {
  const root = document.getElementById("root");
  const isDark = Array.from(root.classList).some((i) => i == "dark");
  isDark ? setLightMode() : setDarkMode();
}

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  setDarkMode();
}
