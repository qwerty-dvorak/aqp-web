'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useMemo } from 'react';

interface TimeAccuracyCurveProps {
  samplingRate: number;
}

// Generate curve data points
function generateSpeedData(): { x: number; y: number }[] {
  // Speed line: at low accuracy → fast, at high accuracy → slow (exponential)
  const points: { x: number; y: number }[] = [];
  for (let acc = 60; acc <= 100; acc += 1) {
    const t = (acc - 60) / 40; // 0 to 1
    const time = 20 + 480 * Math.pow(t, 2.5);
    points.push({ x: acc, y: time });
  }
  return points;
}

function generateAccuracyData(): { x: number; y: number }[] {
  // Accuracy line: inverse — starts high time at low accuracy, drops
  const points: { x: number; y: number }[] = [];
  for (let acc = 60; acc <= 100; acc += 1) {
    const t = (acc - 60) / 40; // 0 to 1
    const time = 450 - 430 * Math.pow(t, 0.6);
    points.push({ x: acc, y: time });
  }
  return points;
}

const CHART_WIDTH = 800;
const CHART_HEIGHT = 300;
const PADDING = { top: 30, right: 40, bottom: 50, left: 60 };

function scaleX(value: number): number {
  return PADDING.left + ((value - 60) / 40) * (CHART_WIDTH - PADDING.left - PADDING.right);
}

function scaleY(value: number): number {
  return CHART_HEIGHT - PADDING.bottom - (value / 500) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);
}

function pointsToPath(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x).toFixed(1)} ${scaleY(p.y).toFixed(1)}`)
    .join(' ');
}

export function TimeAccuracyCurve({ samplingRate }: TimeAccuracyCurveProps) {
  const speedData = useMemo(() => generateSpeedData(), []);
  const accuracyData = useMemo(() => generateAccuracyData(), []);

  // Current operating point based on sampling rate
  const currentAccuracy = useMemo(() => {
    // Map sampling rate 1-100 to accuracy 60-100
    return 60 + (samplingRate / 100) * 40;
  }, [samplingRate]);

  const currentSpeedPoint = useMemo(() => {
    const t = (currentAccuracy - 60) / 40;
    return { x: currentAccuracy, y: 20 + 480 * Math.pow(t, 2.5) };
  }, [currentAccuracy]);

  const speedPath = useMemo(() => pointsToPath(speedData), [speedData]);
  const accuracyPath = useMemo(() => pointsToPath(accuracyData), [accuracyData]);

  // Calculate path length for animation
  const speedPathRef = useRef<SVGPathElement>(null);
  const accuracyPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const animate = (ref: React.RefObject<SVGPathElement | null>) => {
      const el = ref.current;
      if (!el) return;
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
      el.getBoundingClientRect(); // force reflow
      el.style.transition = 'stroke-dashoffset 1.5s ease-out';
      el.style.strokeDashoffset = '0';
    };
    const timer = setTimeout(() => {
      animate(speedPathRef);
      animate(accuracyPathRef);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const xLabels = [60, 70, 80, 90, 95, 100];
  const yLabels = [0, 100, 200, 300, 400, 500];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="mb-4 px-1">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Time vs Accuracy Trade-off
        </h2>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">
          How sampling rate affects speed and accuracy
        </p>
      </div>

      <div className="bg-bg-panel rounded-card p-5 overflow-hidden">
        {/* Legend */}
        <div className="flex items-center gap-6 mb-4 px-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-vivid rounded-full" />
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Speed (ms)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-vivid rounded-full" />
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Accuracy Cost (ms)</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full h-auto min-w-[500px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {yLabels.map((y) => (
              <line
                key={`grid-y-${y}`}
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={scaleY(y)}
                y2={scaleY(y)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}
            {xLabels.map((x) => (
              <line
                key={`grid-x-${x}`}
                x1={scaleX(x)}
                x2={scaleX(x)}
                y1={PADDING.top}
                y2={CHART_HEIGHT - PADDING.bottom}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            <line
              x1={PADDING.left}
              x2={CHART_WIDTH - PADDING.right}
              y1={CHART_HEIGHT - PADDING.bottom}
              y2={CHART_HEIGHT - PADDING.bottom}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <line
              x1={PADDING.left}
              x2={PADDING.left}
              y1={PADDING.top}
              y2={CHART_HEIGHT - PADDING.bottom}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />

            {/* X axis labels */}
            {xLabels.map((x) => (
              <text
                key={`label-x-${x}`}
                x={scaleX(x)}
                y={CHART_HEIGHT - PADDING.bottom + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="11"
                fontFamily="'GeistMono', monospace"
                letterSpacing="0.1em"
              >
                {x}%
              </text>
            ))}

            {/* Y axis labels */}
            {yLabels.map((y) => (
              <text
                key={`label-y-${y}`}
                x={PADDING.left - 10}
                y={scaleY(y) + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.4)"
                fontSize="11"
                fontFamily="'GeistMono', monospace"
                letterSpacing="0.1em"
              >
                {y === 500 ? '500ms' : `${y}`}
              </text>
            ))}

            {/* Axis titles */}
            <text
              x={CHART_WIDTH / 2}
              y={CHART_HEIGHT - 5}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="11"
              fontFamily="'GeistMono', monospace"
              letterSpacing="0.1em"
              textDecoration="uppercase"
            >
              ACCURACY (%)
            </text>

            {/* Speed line (purple) */}
            <path
              ref={speedPathRef}
              d={speedPath}
              fill="none"
              stroke="var(--color-purple-vivid)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Accuracy line (orange) */}
            <path
              ref={accuracyPathRef}
              d={accuracyPath}
              fill="none"
              stroke="var(--color-orange-vivid)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dashed vertical line at current operating point */}
            <line
              x1={scaleX(currentSpeedPoint.x)}
              x2={scaleX(currentSpeedPoint.x)}
              y1={PADDING.top}
              y2={CHART_HEIGHT - PADDING.bottom}
              stroke="rgba(155,89,245,0.4)"
              strokeWidth="1"
              strokeDasharray="6 4"
            />

            {/* Current operating point — glowing dot */}
            <motion.circle
              cx={scaleX(currentSpeedPoint.x)}
              cy={scaleY(currentSpeedPoint.y)}
              r="6"
              fill="var(--color-purple-vivid)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            />
            <motion.circle
              cx={scaleX(currentSpeedPoint.x)}
              cy={scaleY(currentSpeedPoint.y)}
              r="12"
              fill="none"
              stroke="var(--color-purple-vivid)"
              strokeWidth="2"
              opacity="0.3"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* CURRENT label */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <rect
                x={scaleX(currentSpeedPoint.x) - 35}
                y={scaleY(currentSpeedPoint.y) - 30}
                width="70"
                height="18"
                rx="4"
                fill="var(--color-purple-vivid)"
                opacity="0.9"
              />
              <text
                x={scaleX(currentSpeedPoint.x)}
                y={scaleY(currentSpeedPoint.y) - 17}
                textAnchor="middle"
                fill="white"
                fontSize="9"
                fontFamily="'GeistMono', monospace"
                fontWeight="bold"
              >
                CURRENT
              </text>
              {/* Arrow */}
              <polygon
                points={`${scaleX(currentSpeedPoint.x) - 4},${scaleY(currentSpeedPoint.y) - 12} ${scaleX(currentSpeedPoint.x) + 4},${scaleY(currentSpeedPoint.y) - 12} ${scaleX(currentSpeedPoint.x)},${scaleY(currentSpeedPoint.y) - 7}`}
                fill="var(--color-purple-vivid)"
                opacity="0.9"
              />
            </motion.g>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
