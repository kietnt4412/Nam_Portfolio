import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./styles/Logo.css";

const Logo: React.FC = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const sigRef  = useRef<HTMLDivElement>(null);
  const p1 = useRef<SVGPathElement>(null);
  const p2 = useRef<SVGPathElement>(null);
  const p3 = useRef<SVGPathElement>(null);
  const p4 = useRef<SVGPathElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const name = "Nam Dang Thanh";

  useEffect(() => {
    const paths = [p1, p2, p3, p4].map(r => r.current!);
    if (paths.some(p => !p)) return;

    const chars = textRef.current?.querySelectorAll(".char");

    paths.forEach(p => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    tl.current = gsap.timeline({ paused: true });
    tl.current
      // 1. Text Exit
      .to(chars || [], {
        opacity: 0,
        y: -10,
        filter: "blur(4px)",
        stagger: { each: 0.03, from: "random" },
        duration: 0.4,
        ease: "power2.in"
      })
      .to(sigRef.current, { opacity: 1, duration: 0.2 }, "-=0.2")
      
      // 2. "Writing Performance" - More aggressive eases and offsets
      .to(paths[0], { 
        strokeDashoffset: 0, 
        duration: 0.5, 
        ease: "power2.inOut" 
      }, "-=0.1")
      
      .to(paths[1], { 
        strokeDashoffset: 0, 
        duration: 0.4, 
        ease: "power1.inOut" 
      }, "-=0.15")
      
      .to(paths[2], { 
        strokeDashoffset: 0, 
        duration: 0.45, 
        ease: "back.out(1.8)" // High overshoot for the cross-back
      }, "-=0.1")
      
      .to(paths[3], { 
        strokeDashoffset: 0, 
        duration: 0.55, 
        ease: "power4.out" 
      }, "-=0.2");

  }, []);

  const handleMouseEnter = () => tl.current?.play();
  const handleMouseLeave = () => tl.current?.reverse();

  return (
    <a
      href="/#"
      className="logo-container"
      data-cursor="disable"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="logo-text" ref={textRef}>
        {name.split("").map((char, i) => (
          <span key={i} className="char" style={{ display: "inline-block" }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <div className="signature-container" ref={sigRef}>
        {/*
          Truly "Hand-drawn" signature:
          - Multiple control points per line for organic "wobble"
          - Imperfect start/end points that don't quite meet perfectly
          - Slightly varied line weights simulated via opacity/blur in CSS
        */}
        <svg
          viewBox="0 0 100 100"
          width="110"
          height="55"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          {/* P1: Upward - has a little 'hook' at the start and a slight sway */}
          <path ref={p1} className="signature-path" 
            d="M 28,88 C 28,88 32,70 34,55 C 36,40 46,20 52,10" />

          {/* P2: Downward - slightly heavier lean and a bit of 'drag' */}
          <path ref={p2} className="signature-path" 
            d="M 52,10 C 55,30 65,65 72,82" />

          {/* P3: Cross-back - fast, slightly arched, doesn't start exactly at P2 end */}
          <path ref={p3} className="signature-path" 
            d="M 74,80 C 60,75 35,60 12,42" />

          {/* P4: Horizontal - long confident stroke with a natural hand-curve */}
          <path ref={p4} className="signature-path" 
            d="M 8,45 C 30,40 65,38 95,43" />
        </svg>
      </div>
    </a>
  );
};

export default Logo;
