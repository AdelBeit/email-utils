import { h, render } from "/modules/preact/dist/preact.mjs";
import { useState } from "/modules/preact/hooks/dist/hooks.mjs";
import EmailForm from "./components/EmailForm.js";
import ResultPanel from "./components/ResultPanel.js";
import GeneratedPanel from "./components/GeneratedPanel.js";

const App = () => {
  const [verified, setVerified] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    setVerified([]);
    setGenerated([]);
    try {
      const response = await fetch("/find-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const generatedList = data.generated ?? [];
      setGenerated(generatedList);
      if (!response.ok) {
        const detail = data.e ? ` (${data.e})` : "";
        const message = [data.error || "Unable to fetch emails", detail]
          .filter(Boolean)
          .join(" ");
        throw new Error(message);
      }
      setVerified(data.verified ?? []);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyList = async (list) => {
    if (!list || !list.length) {
      return;
    }
    try {
      await navigator.clipboard.writeText(list.join(","));
    } catch (copyError) {
      console.error("Copy failed", copyError);
    }
  };

  return h(
    "div",
    { class: "app-shell" },
    h("h1", null, "Email Finder"),
    h(EmailForm, { onSubmit: handleSubmit, loading }),
    h(
      "div",
      { class: "outputs" },
      h(ResultPanel, {
        verified,
        error,
        loading,
        onCopy: () => copyList(verified),
      }),
      h(GeneratedPanel, {
        generated,
        onCopy: () => copyList(generated),
      })
    )
  );
};

render(h(App), document.getElementById("app"));
