import React from "react";

export default function ToggleSwitch({
  value = false,
  onChange = () => {},
  leftLabel = "Off",
  rightLabel = "On",
  id,
  size = "md", // md or sm
}) {
  // track sizing (wider so labels fit inside)
  const width = size === "sm" ? 200 : 200;
  const height = size === "sm" ? 30 : 45;
  const padding = size === "sm" ? 1 : 0;
  const knobWidth = width / 2 - padding * 2;
  const knobHeight = height - padding * 2;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        id={id}
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") onChange(false); if (e.key === "ArrowRight") onChange(true); }}
        style={{
          width,
          height,
          borderRadius: height / 10,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          padding: 0,
          cursor: "pointer",
          display: "inline-block",
          overflow: "hidden",
        }}
      >
        {/* labels inside the track (render above the knob) */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
          <span style={{ fontWeight: 550 , fontSize: 20, width: "50%", textAlign: "center", color: value ? "var(--text)" : "rgba(8, 183, 241, 1)", pointerEvents: "none" }}>{leftLabel}</span>
          <span style={{ fontWeight: 550 , fontSize: 20, width: "50%", textAlign: "center", color: value ? "rgba(8, 183, 241, 1)": "var(--text)" , pointerEvents: "none" }}>{rightLabel}</span>
        </div>

        {/* sliding white box knob */}
        <div
          style={{
            width: knobWidth,
            height: knobHeight,
            borderRadius: knobHeight / 10,
            background: "white",
            zIndex: 1,
            position: "absolute",
            top: padding,
            left: value ? width - knobWidth - padding : padding,
            transition: "left 180ms cubic-bezier(.2,.9,.2,1), box-shadow 120ms",
            boxShadow: value ? "0 6px 18px rgba(20,32,80,0.18)" : "0 3px 8px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: value ? "flex-end" : "flex-start",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {/* subtle marker/icon spot - kept empty so you can add an icon */}
        </div>
      </button>
    </div>
  );
}
