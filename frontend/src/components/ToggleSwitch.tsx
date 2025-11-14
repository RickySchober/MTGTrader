import * as React from "react";

interface ToggleSwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value = false,
  onChange = () => {},
  leftLabel = "On",
  rightLabel = "Off",
  id,
}) => {
  const width = 200;
  const height = 45;
  const padding = 0;
  const knobWidth = width / 2 - padding * 2;
  const knobHeight = height - padding * 2;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        className="no-bob" // Prevent bobbing effect on toggle switch
        id={id}
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onChange(false);
          if (e.key === "ArrowRight") onChange(true);
        }}
        style={{
          width,
          height,
          borderRadius: height / 10,
          background: "rgba(255,255,255,0.02)",
          border: "1x solid rgba(255, 255, 255, 0.48)",
          position: "relative",
          padding: 0,
          cursor: "pointer",
          display: "inline-block",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              fontWeight: 550,
              fontSize: 20,
              width: "50%",
              textAlign: "center",
              color: value ? "var(--text)" : "rgba(8, 183, 241, 1)",
              pointerEvents: "none",
            }}
          >
            {leftLabel}
          </span>
          <span
            style={{
              fontWeight: 550,
              fontSize: 20,
              width: "50%",
              textAlign: "center",
              color: value ? "rgba(8, 183, 241, 1)" : "var(--text)",
              pointerEvents: "none",
            }}
          >
            {rightLabel}
          </span>
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
            transition: "left 380ms cubic-bezier(.2,.9,.2,1), box-shadow 120ms",
            display: "flex",
            alignItems: "center",
            justifyContent: value ? "flex-end" : "flex-start",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        ></div>
      </button>
    </div>
  );
};
export default ToggleSwitch;
