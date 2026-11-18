document.querySelectorAll("[data-demo-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");

  const summary = form.querySelector("[data-error-summary]");
  const list = form.querySelector("[data-error-list]");
  const fields = [...form.querySelectorAll("[data-validate-field]")];
  let submitted = false;

  // JS 실행 시에만 브라우저 팝업 대신 입력창과 연결된 오류 안내를 사용한다.
  form.noValidate = true;
  form.querySelector("[data-preview]").disabled = false;

  const validate = (field) => {
    const error = document.getElementById(field.dataset.errorId);
    const labelledBy = (field.getAttribute("aria-labelledby") || "").split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
    const label = (labelledBy || field.getAttribute("aria-label") || field.labels?.[0]?.textContent || "입력")
      .replace("(필수)", "").trim();
    let message = "";
    if (field.validity.valueMissing || (field.required && !field.value.trim())) {
      message = `${label} 항목을 입력하세요.`;
    } else if (field.validity.typeMismatch && field.type === "email") {
      message = "이메일 주소를 sample@example.com 형식으로 입력하세요.";
    } else if (!field.validity.valid) {
      message = field.validationMessage;
    }
    error.textContent = message;
    error.hidden = !message;
    const descriptions = (field.getAttribute("aria-describedby") || "")
      .split(/\s+/).filter((id) => id && id !== error.id);
    if (message) {
      field.setAttribute("aria-invalid", "true");
      descriptions.push(error.id);
    } else {
      field.removeAttribute("aria-invalid");
    }
    if (descriptions.length) field.setAttribute("aria-describedby", descriptions.join(" "));
    else field.removeAttribute("aria-describedby");
  };

  const updateSummary = () => {
    list.replaceChildren();
    fields.filter((field) => field.getAttribute("aria-invalid") === "true").forEach((field) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${field.id}`;
      link.textContent = document.getElementById(field.dataset.errorId).textContent;
      link.addEventListener("click", (event) => {
        event.preventDefault();
        field.focus();
      });
      item.append(link);
      list.append(item);
    });
    summary.hidden = !list.children.length;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    status.textContent = "";
    fields.forEach(validate);
    updateSummary();
    if (!summary.hidden) {
      summary.focus();
      return;
    }
    status.textContent = "입력 형식을 확인했습니다. 샘플 화면이므로 전송하거나 저장하지 않았습니다.";
  });

  form.addEventListener("input", (event) => {
    status.textContent = "";
    if (submitted && fields.includes(event.target)) {
      validate(event.target);
      updateSummary();
    }
  });
});
