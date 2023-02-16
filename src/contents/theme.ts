(() => {
  const themeSaved = localStorage.getItem("theme");
  console.log("themeSaved", themeSaved);
  if (themeSaved) {
    document.documentElement.dataset.theme = themeSaved;
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.dataset.theme = event.matches
          ? "dark"
          : "light";
      }
    });
})();

export {};
