import { h, render } from "/modules/preact/dist/preact.mjs";
import { useState } from "/modules/preact/hooks/dist/hooks.mjs";
import EmailForm from "./components/EmailForm.js";
import ResultPanel from "./components/ResultPanel.js";
import GeneratedPanel from "./components/GeneratedPanel.js";

const formatErrorMessage = (message) => {
  if (!message) return "";
  const braceIndex = message.indexOf("{");
  if (braceIndex === -1) return message;
  const prefix = message.slice(0, braceIndex).trim();
  const rawJsonPart = message.slice(braceIndex);
  const endBraceIndex = rawJsonPart.lastIndexOf("}");
  const jsonCandidate =
    endBraceIndex !== -1
      ? rawJsonPart.slice(0, endBraceIndex + 1)
      : rawJsonPart;
  try {
    const parsed = JSON.parse(jsonCandidate);
    const formattedJson = JSON.stringify(parsed, null, 2);
    const suffix = endBraceIndex !== -1 ? rawJsonPart.slice(endBraceIndex + 1) : "";
    return prefix
      ? `${prefix}\n${formattedJson}${suffix}`
      : `${formattedJson}${suffix}`;
  } catch (err) {
    return message;
  }
};

const App = () => {
  const [verified, setVerified] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyingVerified, setCopyingVerified] = useState(false);
  const [copyingGenerated, setCopyingGenerated] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    setVerified([]);
    setGenerated([]);
    try {
      const generateResponse = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const generateData = await generateResponse.json();
      const generatedList = generateData.generated ?? [];
      setGenerated(generatedList);
      if (!generateResponse.ok) {
        throw new Error(generateData.error || "Unable to generate emails");
      }
      const verifyResponse = await fetch("/find-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          generated: generatedList,
        }),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        const detail = verifyData.e ? ` (${verifyData.e})` : "";
        const message = [verifyData.error || "Unable to fetch emails", detail]
          .filter(Boolean)
          .join(" ");
        throw new Error(message);
      }
      setVerified(verifyData.verified ?? []);
    } catch (err) {
      setError(formatErrorMessage(err?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const copyList = async (list, onCopied) => {
    if (!list || !list.length) {
      return;
    }
    try {
      await navigator.clipboard.writeText(list.join(","));
      if (typeof onCopied === "function") {
        onCopied();
      }
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
        copyLabel: copyingVerified ? "Copied!" : "Copy verified list",
        onCopy: () =>
          copyList(verified, () => {
            setCopyingVerified(true);
            setTimeout(() => setCopyingVerified(false), 1100);
          }),
      }),
      h(GeneratedPanel, {
        generated,
        copyLabel: copyingGenerated ? "Copied!" : "Copy generated list",
        onCopy: () =>
          copyList(generated, () => {
            setCopyingGenerated(true);
            setTimeout(() => setCopyingGenerated(false), 1100);
          }),
      })
    )
  );
};

render(h(App), document.getElementById("app"));
