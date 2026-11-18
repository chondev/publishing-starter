const dialogOpeners = new WeakMap();

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const trigger = event.target.closest("[data-dialog-open]");
  if (trigger) {
    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
    if (document.querySelector("dialog[open]")) return;

    dialogOpeners.set(dialog, trigger);
    dialog.showModal();
    document.documentElement.classList.add("is-modal-open");
    dialog.scrollTop = 0;
    dialog.querySelector("[data-dialog-initial]")?.focus({ preventScroll: true });
    return;
  }

  const closeButton = event.target.closest("[data-dialog-close]");
  const dialog = closeButton?.closest("dialog");
  if (dialog instanceof HTMLDialogElement) dialog.close();
});

document.querySelectorAll("dialog.layer-dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) {
      document.documentElement.classList.remove("is-modal-open");
    }
    const opener = dialogOpeners.get(dialog);
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    dialogOpeners.delete(dialog);
  });

  // 브라우저 UI로 초점이 넘어가기 전에 팝업의 처음과 끝을 연결한다.
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => element.getClientRects().length > 0 && element.tabIndex >= 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first) {
      event.preventDefault();
      dialog.querySelector("[data-dialog-initial]")?.focus();
      return;
    }
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !focusable.includes(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
