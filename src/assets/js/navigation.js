const navToggle = document.querySelector("[data-nav-toggle]");
if (navToggle) {
  const controls = document.querySelector("[data-nav-controls]");
  const nav = document.getElementById(navToggle.getAttribute("aria-controls"));
  const desktop = matchMedia("(min-width: 40rem)");
  const setOpen = (open) => {
    if (!open && nav.contains(document.activeElement)) navToggle.focus();
    nav.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
  };
  const sync = () => {
    if (desktop.matches) {
      nav.hidden = false;
      if (controls.contains(document.activeElement)) nav.querySelector("a")?.focus();
      controls.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
    } else {
      controls.hidden = false;
      setOpen(false);
    }
  };
  navToggle.addEventListener("click", () => setOpen(navToggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !desktop.matches && !nav.hidden && (nav.contains(event.target) || controls.contains(event.target))) {
      setOpen(false);
      navToggle.focus();
    }
  });
  desktop.addEventListener("change", sync);
  sync();
}
