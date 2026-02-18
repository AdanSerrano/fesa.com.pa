"use client";

import { memo, useRef, useMemo } from "react";
import { motion, useInView } from "motion/react";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";

interface MapDot {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
}

interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
}

interface WorldMapProps {
  dots?: MapDot[];
  markers?: MapMarker[];
  lineColor?: string;
}

const map = new DottedMap({ height: 100, grid: "diagonal" });

const lightMapSvg = encodeURIComponent(
  map.getSVG({
    radius: 0.22,
    color: "#00000040",
    shape: "circle",
    backgroundColor: "transparent",
  })
);

const darkMapSvg = encodeURIComponent(
  map.getSVG({
    radius: 0.22,
    color: "#FFFFFF40",
    shape: "circle",
    backgroundColor: "transparent",
  })
);

const SVG_VIEW_BOX = "0 0 210 100";

function projectPoint(lat: number, lng: number) {
  const pin = map.getPin({ lat, lng });
  return { x: pin.x, y: pin.y };
}

function createCurvedPath(
  start: { x: number; y: number },
  end: { x: number; y: number }
) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 12;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

function WorldMapInner({
  dots = [],
  markers = [],
  lineColor = "#3b82f6",
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const svgMap = resolvedTheme === "dark" ? darkMapSvg : lightMapSvg;

  const paths = useMemo(
    () =>
      dots.map((dot) => {
        const startPoint = projectPoint(dot.start.lat, dot.start.lng);
        const endPoint = projectPoint(dot.end.lat, dot.end.lng);
        return {
          d: createCurvedPath(startPoint, endPoint),
          start: { ...startPoint, label: dot.start.label },
          end: { ...endPoint, label: dot.end.label },
        };
      }),
    [dots]
  );

  const projectedMarkers = useMemo(
    () =>
      markers.map((m) => ({
        ...projectPoint(m.lat, m.lng),
        label: m.label,
      })),
    [markers]
  );

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[2/1] rounded-2xl relative font-sans overflow-hidden border border-border/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm"
    >
      <img
        src={`data:image/svg+xml;utf8,${svgMap}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox={SVG_VIEW_BOX}
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {isInView &&
          paths.map((path, i) => (
            <motion.path
              key={`line-${i}`}
              d={path.d}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.3 + 0.4 * i,
                ease: "easeOut",
              }}
            />
          ))}

        {isInView &&
          paths.map((path, i) => (
            <g key={`points-${i}`}>
              <circle
                cx={path.start.x}
                cy={path.start.y}
                r="0.8"
                fill={lineColor}
              />
              <circle
                cx={path.start.x}
                cy={path.start.y}
                r="0.8"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="0.8"
                  to="3"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
              {path.start.label && (
                <text
                  x={path.start.x}
                  y={path.start.y + 5}
                  textAnchor="middle"
                  fontSize="3.5"
                  fontWeight="bold"
                  className="fill-brand-600 dark:fill-brand-300"
                >
                  {path.start.label}
                </text>
              )}

              <circle
                cx={path.end.x}
                cy={path.end.y}
                r="0.6"
                fill={lineColor}
              />
              <circle
                cx={path.end.x}
                cy={path.end.y}
                r="0.6"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="0.6"
                  to="2.5"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
              {path.end.label && (
                <text
                  x={path.end.x}
                  y={path.end.y - 3}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight="600"
                  className="fill-brand-600 dark:fill-brand-300"
                >
                  {path.end.label}
                </text>
              )}
            </g>
          ))}

        {isInView &&
          projectedMarkers.map((marker, i) => (
            <motion.g
              key={`marker-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <circle
                cx={marker.x}
                cy={marker.y}
                r="1"
                fill={lineColor}
              />
              <circle
                cx={marker.x}
                cy={marker.y}
                r="1"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="1"
                  to="4"
                  dur="2s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="2s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={marker.x}
                cy={marker.y}
                r="0.8"
                fill={lineColor}
                opacity="0.3"
              >
                <animate
                  attributeName="r"
                  from="0.8"
                  to="6"
                  dur="2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.3"
                  to="0"
                  dur="2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              {marker.label && (
                <text
                  x={marker.x}
                  y={marker.y + 5}
                  textAnchor="middle"
                  fontSize="3.5"
                  fontWeight="bold"
                  className="fill-brand-600 dark:fill-brand-300"
                >
                  {marker.label}
                </text>
              )}
            </motion.g>
          ))}
      </svg>
    </div>
  );
}

WorldMapInner.displayName = "WorldMap";

export const WorldMap = memo(WorldMapInner);
