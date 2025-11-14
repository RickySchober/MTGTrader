import * as React from "react";

interface BacksplashProps {
  children: React.ReactNode;
  heroHeight?: number;
  bgArt: string;
}

const Backsplash: React.FC<BacksplashProps> = ({
  children,
  heroHeight = 400,
  bgArt,
}) => {
  return (
    <>
      <div
        style={{
          height: heroHeight,
          position: "absolute",
          inset: 0,
          marginTop: 100,
          backgroundImage: `url(${bgArt})`,
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          //Position all following content above bg image
          position: "relative",
          zIndex: 2,
          marginTop: 250,
          marginLeft: 48,
          marginRight: 48,
        }}
      >
        {children}
      </div>
    </>
  );
};
export default Backsplash;
