import { h } from "/modules/preact/dist/preact.mjs";

const ResultPanel = ({ verified, error, loading, onCopy, copyLabel }) => {
  const hasVerified = verified && verified.length > 0;
  const listing = loading
    ? "Looking up verified addresses..."
    : hasVerified
    ? verified.join("\n")
    : error
    ? "No verified addresses returned."
    : "No verified addresses yet.";

  return h(
    "section",
    { class: "panel" },
    h(
      "div",
      { class: "panel-title-wrapper" },
      h("h2", null, "Verified results"),
      loading && h("span", { class: "badge" }, "Loading")
    ),
    error &&
      h(
        "div",
        { class: "error", role: "alert", "aria-live": "polite" },
        error
      ),
    h(
      "div",
      { class: "pre-wrapper" },
      h("pre", null, listing)
    ),
    h(
      "button",
      { class: "inline-button", disabled: !hasVerified, onClick: onCopy },
      copyLabel || "Copy verified list"
    )
  );
};

export default ResultPanel;
