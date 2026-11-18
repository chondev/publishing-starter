document.querySelectorAll("[data-tabs]").forEach((root) => {
  const list = root.querySelector("[data-tabs-list]");
  const tabs = [...root.querySelectorAll("[data-tab]")];
  const select = (selected) => {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
    });
  };
  list.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.tabIndex = 0;
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs.forEach((item, position) => { item.tabIndex = position === next ? 0 : -1; });
      tabs[next].focus();
    });
  });
  select(tabs[0]);
  list.hidden = false;
});

document.querySelectorAll("[data-async-demo]").forEach((root) => {
  const status = root.querySelector("[data-async-status]");
  const content = root.querySelector("[data-async-content]");
  const buttons = [...root.querySelectorAll("[data-async-result]")];
  buttons.forEach((button) => {
    button.disabled = false;
    button.addEventListener("click", async () => {
      buttons.forEach((item) => { item.disabled = true; });
      content.setAttribute("aria-busy", "true");
      status.textContent = "목록을 불러오는 중입니다.";
      // 실제 요청 없이 성공·실패 상태만 재현하는 로컬 샘플이다.
      await new Promise((resolve) => setTimeout(resolve, 700));
      const message = document.createElement("p");
      if (button.dataset.asyncResult === "error") {
        message.textContent = "목록을 불러오지 못했습니다. 샘플 목록 불러오기 버튼으로 다시 시도하세요.";
        status.textContent = "불러오기에 실패했습니다. 다시 시도할 수 있습니다.";
      } else {
        message.textContent = "샘플 공지 1건: 공통 UI와 접근성 확인 항목을 살펴보세요.";
        status.textContent = "목록 1건을 불러왔습니다.";
      }
      content.replaceChildren(message);
      content.setAttribute("aria-busy", "false");
      buttons.forEach((item) => { item.disabled = false; });
    });
  });
});
