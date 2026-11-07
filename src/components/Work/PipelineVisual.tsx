import { useId } from 'react';
import type { ProjectVisual } from '@/content/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './Work.module.css';

type PipelineVisualData = Extract<ProjectVisual, { kind: 'pipeline' }>;

/**
 * Where each stage sits on the rail (SVG units in a 520x220 viewBox) and where
 * its name goes: above the node for the top row, below for the last stage.
 */
const SLOTS = [
  { x: 40, y: 60, labelY: -26 },
  { x: 150, y: 60, labelY: -26 },
  { x: 260, y: 60, labelY: -26 },
  { x: 370, y: 60, labelY: -26 },
  { x: 480, y: 60, labelY: -26 },
  { x: 40, y: 160, labelY: 40 },
] as const;

const RAIL_PATH = 'M40 60 H480 M480 60 V160 H40';

/**
 * Six pipeline stages on a rail with a glowing pulse travelling along it.
 * With reduced motion the pulse sits still on the first stage.
 */
export function PipelineVisual({ visual }: { visual: PipelineVisualData }) {
  const reduced = useReducedMotion();
  const id = useId();
  const railId = `pipe-${id.replaceAll(':', '')}-rail`;

  return (
    <div className={styles.pipe}>
      <svg
        className={styles.pipeSvg}
        viewBox="0 0 520 220"
        role="img"
        aria-label={visual.stages.join(', ')}
        focusable="false"
      >
        <path id={railId} className={styles.railLine} d={RAIL_PATH} />
        <g>
          {visual.stages.map((stage, i) => {
            const slot = SLOTS[i];
            if (!slot) return null;
            return (
              <g key={stage} transform={`translate(${String(slot.x)} ${String(slot.y)})`}>
                <circle className={styles.node} r="14" />
                <circle className={styles.nodeCore} r="4" />
                <text className={styles.stname} x="0" y={slot.labelY} textAnchor="middle">
                  {stage}
                </text>
              </g>
            );
          })}
        </g>
        {reduced ? (
          <circle className={styles.pulse} r="5" cx="40" cy="60" />
        ) : (
          <circle className={styles.pulse} r="5">
            <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
              <mpath href={`#${railId}`} />
            </animateMotion>
          </circle>
        )}
      </svg>
    </div>
  );
}
