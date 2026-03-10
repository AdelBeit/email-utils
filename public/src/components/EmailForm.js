import { h } from "/modules/preact/dist/preact.mjs";
import { useState } from "/modules/preact/hooks/dist/hooks.mjs";

const EmailForm = ({ onSubmit, loading }) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [domain, setDomain] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!first.trim() || !last.trim() || !domain.trim()) {
      return;
    }
    onSubmit({
      firstName: first.trim(),
      lastName: last.trim(),
      domain: domain.trim(),
    });
  };

  return h(
    "form",
    { class: "form-grid", onSubmit: handleSubmit },
    h("input", {
      type: "text",
      placeholder: "First name",
      value: first,
      onInput: (event) => setFirst(event.target.value),
      required: true,
      autocapitalize: "words",
    }),
    h("input", {
      type: "text",
      placeholder: "Last name",
      value: last,
      onInput: (event) => setLast(event.target.value),
      required: true,
      autocapitalize: "words",
    }),
    h("input", {
      type: "text",
      placeholder: "domain.com",
      value: domain,
      onInput: (event) => setDomain(event.target.value),
      required: true,
      inputmode: "url",
    }),
    h(
      "button",
      { class: "primary", type: "submit", disabled: loading },
      loading ? "Finding…" : "Find"
    )
  );
};

export default EmailForm;
