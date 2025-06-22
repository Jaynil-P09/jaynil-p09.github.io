import React, { useRef, useEffect } from "react";
import "./GlassCard.css";

export default function GlassCard() {
  const cardRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    function handleMouseMove(e) {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const specular = element.querySelector(".glass-specular");
      if (specular) {
        specular.style.background = `radial-gradient(
          circle at ${x}px ${y}px,
          rgba(255,255,255,0.15) 0%,
          rgba(255,255,255,0.05) 30%,
          rgba(255,255,255,0) 60%
        )`;
      }
    }

    function handleMouseLeave() {
      const specular = element.querySelector(".glass-specular");
      if (specular) {
        specular.style.background = "none";
      }
    }

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="glass-card" ref={cardRef}>
      <div className="glass-filter"></div>
      <div className="glass-distortion-overlay"></div>
      <div className="glass-overlay"></div>
      <div className="glass-specular"></div>
    </div>
  );
}



