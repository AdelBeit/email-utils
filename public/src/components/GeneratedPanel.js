import { h } from "/modules/preact/dist/preact.mjs";

const GeneratedPanel = ({ generated, onCopy, copyLabel }) => {
  const hasGenerated = generated && generated.length > 0;
  const message = hasGenerated
    ? generated.join("\n")
    : "Run the finder to view every permutation.";

  return h(
    "section",
    { class: "panel" },
    h(
      "div",
      { class: "panel-title-wrapper" },
      h("h2", null, "Generated emails")
    ),
    h("pre", null, message),
    h(
      "button",
      { class: "inline-button", disabled: !hasGenerated, onClick: onCopy },
      copyLabel || "Copy generated list"
    )
  );
};

export default GeneratedPanel;
