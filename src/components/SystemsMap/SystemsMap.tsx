import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { profile } from '@/content/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cx } from '@/lib/cx';
import { buildGraph } from './graph';
import { readPalette, rgba } from './palette';
import styles from './SystemsMap.module.css';

/** Interface chrome only; every concept, group and description comes from `profile.systemsMap`. */
const UI = {
  sectionLabel: 'Interactive map of the AI systems I build',
  expand: 'Expand',
  collapse: 'Collapse',
} as const;

const STAGE_ID = 'nucleus-stage';
const ASSEMBLE_MS = 1900;
const PULSE_S = 4.2;
const HOLD_MS = 2600;
const AUTO_FOCUS_MS = 2800;
const PULSE_BAND = 22;
const DPR_MAX = 2;
const RESIZE_DEBOUNCE_MS = 120;
const REINIT_DELAYS_MS = [720, 1200] as const;
const PIN_QUERY = '(max-width: 640px)';
const PIN_WIDTH = 640;
const DEFAULT_CALLOUT_WIDTH = 200;
const TAP_SLOP_PX = 6;

interface Projected {
  x: number;
  y: number;
  z: number;
  sc: number;
}

const noop = () => undefined;

/**
 * The "AI systems map" band under the hero: a canvas constellation of the concepts in
 * `profile.systemsMap`, assembled on first view, slowly rotating, draggable, with a DOM
 * callout describing the focused node and an Expand/Collapse control.
 */
export function SystemsMap() {
  const reduced = useReducedMotion();
  const graph = useMemo(() => buildGraph(profile.systemsMap), []);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const calloutWidthRef = useRef(DEFAULT_CALLOUT_WIDTH);
  const initRef = useRef<() => void>(noop);
  const redrawRef = useRef<() => void>(noop);
  const bigRef = useRef(false);

  const [big, setBig] = useState(false);
  const [focusIndex, setFocusIndex] = useState(1);

  const focused = graph.nodes[focusIndex] ?? graph.nodes[0];

  const toggleBig = useCallback(
    (force?: boolean) => {
      const next = typeof force === 'boolean' ? force : !bigRef.current;
      if (next === bigRef.current) return;
      bigRef.current = next;
      setBig(next);
      window.dispatchEvent(new CustomEvent<boolean>('map:expanded', { detail: next }));
      if (next) {
        sectionRef.current?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [reduced],
  );

  // Expanded state: flag the body for the floating guide and re-measure the canvas once
  // the stage height transition has settled (a fallback; the ResizeObserver on the stage
  // normally re-measures as soon as the stage changes size).
  useEffect(() => {
    if (big) document.body.dataset.mapExpanded = 'true';
    else delete document.body.dataset.mapExpanded;
    const timers = REINIT_DELAYS_MS.map((delay) =>
      window.setTimeout(() => {
        initRef.current();
      }, delay),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [big]);

  useEffect(() => {
    return () => {
      delete document.body.dataset.mapExpanded;
    };
  }, []);

  // Escape collapses the expanded map.
  useEffect(() => {
    if (!big) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') toggleBig(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [big, toggleBig]);

  // Measure the callout when its text changes, never inside the frame loop.
  useLayoutEffect(() => {
    const element = calloutRef.current;
    if (element) calloutWidthRef.current = element.offsetWidth || calloutWidthRef.current;
    redrawRef.current();
  }, [focusIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const callout = calloutRef.current;
    if (!canvas || !stage || !callout) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, edges, rnd } = graph;
    const labelFlip: boolean[] = nodes.map(() => false);
    const t0 = performance.now();

    let W = 0;
    let H = 0;
    let pinned = false;
    let palette = readPalette();
    let proj: Projected[] = [];

    let rotY = 0;
    let rotX = 0.3;
    let tx = 0;
    let ty = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velY = 0;
    let dragDistance = 0;

    let armed = false;
    let assembleStart = 0;
    let asm = 0;
    let burst = 0;
    let done = false;

    let focus = 1;
    let hover = -1;
    let lastAuto = 0;
    let holdUntil = 0;
    let appliedFocus = -1;
    let calloutOn = false;
    let calloutFlip = false;

    let raf = 0;
    let resizeTimer = 0;

    const applyOn = (on: boolean) => {
      if (on === calloutOn) return;
      calloutOn = on;
      if (on) callout.dataset.on = 'true';
      else delete callout.dataset.on;
    };

    const applyFlip = (flip: boolean) => {
      if (flip === calloutFlip) return;
      calloutFlip = flip;
      if (flip) callout.dataset.flip = 'true';
      else delete callout.dataset.flip;
    };

    const setDragCursor = (on: boolean) => {
      if (on) canvas.dataset.drag = 'true';
      else delete canvas.dataset.drag;
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const R = Math.min(W, H) * 0.4;
      const cx0 = W / 2;
      const cy0 = H / 2;
      const fov = 2.8;

      if (armed) {
        const e0 = Math.min(1, (now - assembleStart) / ASSEMBLE_MS);
        asm = 1 - (1 - e0) ** 3;
        if (e0 >= 1 && !done) {
          done = true;
          burst = 1;
        }
      }
      if (burst > 0) burst = Math.max(0, burst - 0.016);
      if (!dragging) {
        velY *= 0.92;
        rotY += 0.0022 + velY;
      }

      const ay = rotY + tx * 0.5;
      const ax = rotX + ty * 0.35;
      const cyy = Math.cos(ay);
      const syy = Math.sin(ay);
      const cxx = Math.cos(ax);
      const sxx = Math.sin(ax);

      const next: Projected[] = [];
      for (const node of nodes) {
        const px = node.sp[0] + (node.p[0] - node.sp[0]) * asm;
        const py = node.sp[1] + (node.p[1] - node.sp[1]) * asm;
        const pz = node.sp[2] + (node.p[2] - node.sp[2]) * asm;
        const x = px * cyy - pz * syy;
        let z = px * syy + pz * cyy;
        const y = py * cxx - z * sxx;
        z = py * sxx + z * cxx;
        const sc = fov / Math.max(0.7, fov + z);
        next.push({ x: cx0 + x * R * sc, y: cy0 + y * R * sc, z, sc });
      }
      proj = next;

      ctx.clearRect(0, 0, W, H);

      const halo = ctx.createRadialGradient(cx0, cy0, 0, cx0, cy0, R * 1.25);
      halo.addColorStop(0, rgba(palette.accent, 0.16 * asm + 0.04));
      halo.addColorStop(1, rgba(palette.accent, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx0, cy0, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      const pulseR = ((t % PULSE_S) / PULSE_S) * R * 1.45;
      ctx.lineWidth = 1;
      for (const edge of edges) {
        const pa = proj[edge.a];
        const pb = proj[edge.b];
        if (!pa || !pb) continue;
        const mx = (pa.x + pb.x) / 2;
        const my = (pa.y + pb.y) / 2;
        const md = Math.hypot(mx - cx0, my - cy0);
        const pulse = Math.max(0, 1 - Math.abs(md - pulseR) / PULSE_BAND);
        const depth = ((pa.sc + pb.sc) / 2 - 0.55) * 1.6;
        const alpha = Math.max(0, Math.min(1, depth)) * edge.w * asm * 0.55 + pulse * 0.5 * asm;
        if (alpha <= 0.01) continue;
        ctx.strokeStyle = rgba(pulse > 0.2 ? palette.accent2 : palette.accent, alpha);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      for (let j = 0; j < nodes.length; j++) {
        const q = proj[j];
        const node = nodes[j];
        if (!q || !node) continue;
        const alpha = Math.max(0.18, Math.min(1, (q.sc - 0.5) * 1.7));
        const baseRadius = node.core ? 7 : node.hub ? 3.6 : 1.9;
        const radius = Math.max(0.4, baseRadius * q.sc * (1 + (1 - asm) * 0.4));
        const md = Math.hypot(q.x - cx0, q.y - cy0);
        const pulse = Math.max(0, 1 - Math.abs(md - pulseR) / PULSE_BAND);
        const isFocus = j === focus;

        ctx.fillStyle = node.core
          ? rgba(palette.accent2, alpha)
          : rgba(pulse > 0.3 ? palette.accent2 : palette.accent, alpha);
        ctx.beginPath();
        ctx.arc(q.x, q.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (node.hub || isFocus || pulse > 0.5) {
          ctx.fillStyle = rgba(palette.accent, 0.12 + pulse * 0.15);
          ctx.beginPath();
          const haloRadius = radius * (isFocus ? 5 : 3) * (1 + Math.sin(t * 2 + j) * 0.15);
          ctx.arc(q.x, q.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isFocus) {
          ctx.strokeStyle = rgba(palette.signal, 0.9);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(q.x, q.y, radius + 9 + Math.sin(t * 4) * 1.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.arc(q.x, q.y, radius + 16, t * 1.5, t * 1.5 + Math.PI * 1.4);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
        }

        if (node.hub && !node.core && asm > 0.9 && q.sc > 0.72) {
          ctx.font = `500 11px ${palette.fontMono}`;
          ctx.fillStyle = palette.text;
          ctx.globalAlpha = Math.min(1, (q.sc - 0.7) * 3) * 0.9;
          const label = node.group.toUpperCase();
          const labelWidth = ctx.measureText(label).width;
          let flip = labelFlip[j] ?? false;
          if (!flip && q.x + 9 + labelWidth > W - 6) flip = true;
          else if (flip && q.x - 9 - labelWidth > 6 && q.x + 9 + labelWidth < W - 30) flip = false;
          labelFlip[j] = flip;
          ctx.fillText(label, flip ? q.x - 9 - labelWidth : q.x + 9, q.y + 4);
          ctx.globalAlpha = 1;
        }
      }

      if (burst > 0) {
        ctx.strokeStyle = rgba(palette.accent2, burst * 0.9);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx0, cy0, R * (1.05 + (1 - burst) * 0.6), 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = rgba(palette.accent2, burst * 0.18);
        ctx.beginPath();
        ctx.arc(cx0, cy0, R * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      const core = proj[0];
      if (core) {
        const glow = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, R * 0.22);
        glow.addColorStop(0, rgba(palette.accent2, 0.35 * asm));
        glow.addColorStop(1, rgba(palette.accent2, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(core.x, core.y, R * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }

      let on = false;
      if (asm > 0.95) {
        if (hover < 0 && now > holdUntil && now - lastAuto > AUTO_FOCUS_MS) {
          lastAuto = now;
          focus = 1 + Math.floor(rnd() * (nodes.length - 1));
        }
        const target = proj[focus];
        if (target) {
          if (focus !== appliedFocus) {
            appliedFocus = focus;
            setFocusIndex(focus);
          }
          if (pinned) {
            callout.style.left = '';
            callout.style.top = '';
            applyFlip(false);
          } else {
            const width = calloutWidthRef.current || DEFAULT_CALLOUT_WIDTH;
            const flip = target.x + 16 + width > W - 8;
            applyFlip(flip);
            const left = flip ? Math.max(width + 24, target.x) : Math.min(target.x, W - 24 - width);
            const top = Math.max(60, Math.min(H - 60, target.y));
            callout.style.left = `${String(left)}px`;
            callout.style.top = `${String(top)}px`;
          }
          on = true;
        }
      }
      applyOn(on);

      if (!reduced) raf = window.requestAnimationFrame(draw);
    };

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pinned =
        typeof window.matchMedia === 'function'
          ? window.matchMedia(PIN_QUERY).matches
          : W <= PIN_WIDTH;
      palette = readPalette();
      calloutWidthRef.current = callout.offsetWidth || calloutWidthRef.current;
      if (reduced && armed) draw(performance.now());
    };

    const arm = () => {
      if (armed) return;
      armed = true;
      assembleStart = performance.now();
      if (reduced) {
        assembleStart -= ASSEMBLE_MS;
        done = true;
        draw(performance.now());
      }
    };

    const onStageMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      if (rect.width > 0 && rect.height > 0) {
        tx = mx / rect.width - 0.5;
        ty = my / rect.height - 0.5;
      }
      if (dragging) {
        velY = (event.clientX - lastX) * 0.006;
        rotY += velY;
        rotX = Math.max(-1.2, Math.min(1.2, rotX + (event.clientY - lastY) * 0.004));
        dragDistance += Math.abs(event.clientX - lastX) + Math.abs(event.clientY - lastY);
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }
      let best = -1;
      let bestDistance = 18 * 18;
      for (let i = 0; i < proj.length; i++) {
        const q = proj[i];
        if (!q) continue;
        const dx = q.x - mx;
        const dy = q.y - my;
        const d = dx * dx + dy * dy;
        if (d < bestDistance && q.sc > 0.75) {
          bestDistance = d;
          best = i;
        }
      }
      hover = best;
      if (best >= 0) {
        focus = best;
        holdUntil = performance.now() + HOLD_MS;
      }
      if (reduced) draw(performance.now());
    };

    const onStageLeave = () => {
      tx = 0;
      ty = 0;
      hover = -1;
      dragging = false;
      setDragCursor(false);
    };

    const onCanvasDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velY = 0;
      dragDistance = 0;
      setDragCursor(true);
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        /* The pointer may already be gone; dragging still works without capture. */
      }
    };

    const onCanvasUp = () => {
      // Only a press that started on the canvas counts; a press that began on the Expand
      // button and was released over the canvas must not toggle.
      if (!dragging) return;
      const wasDrag = Math.abs(velY) > 0.002 || dragDistance > TAP_SLOP_PX;
      dragging = false;
      setDragCursor(false);
      if (!wasDrag && hover < 0) toggleBig();
    };

    const onCanvasCancel = () => {
      dragging = false;
      setDragCursor(false);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(init, RESIZE_DEBOUNCE_MS);
    };

    const onThemeChange = () => {
      palette = readPalette();
      if (reduced && armed) draw(performance.now());
    };

    stage.addEventListener('pointermove', onStageMove);
    stage.addEventListener('pointerleave', onStageLeave);
    canvas.addEventListener('pointerdown', onCanvasDown);
    canvas.addEventListener('pointerup', onCanvasUp);
    canvas.addEventListener('pointercancel', onCanvasCancel);
    window.addEventListener('resize', onResize);
    // The stage changes size on Expand/Collapse without a window resize; under reduced
    // motion it snaps in one step, so re-measure immediately instead of debouncing.
    const sizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(reduced ? init : onResize)
        : undefined;
    sizeObserver?.observe(stage);

    const themeObserver =
      typeof MutationObserver === 'function' ? new MutationObserver(onThemeChange) : undefined;
    themeObserver?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const schemeQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: light)')
        : undefined;
    schemeQuery?.addEventListener('change', onThemeChange);
    // Keep `pinned` in step with the stylesheet's 640px breakpoint instead of waiting for
    // the debounced resize re-measure.
    const pinQuery =
      typeof window.matchMedia === 'function' ? window.matchMedia(PIN_QUERY) : undefined;
    const onPinChange = (event: MediaQueryListEvent) => {
      pinned = event.matches;
      if (reduced && armed) draw(performance.now());
    };
    pinQuery?.addEventListener('change', onPinChange);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) arm();
        },
        { threshold: 0.2 },
      );
      observer.observe(stage);
    } else {
      arm();
    }

    initRef.current = init;
    redrawRef.current = reduced
      ? () => {
          if (armed) draw(performance.now());
        }
      : noop;

    init();
    if (!reduced) raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      stage.removeEventListener('pointermove', onStageMove);
      stage.removeEventListener('pointerleave', onStageLeave);
      canvas.removeEventListener('pointerdown', onCanvasDown);
      canvas.removeEventListener('pointerup', onCanvasUp);
      canvas.removeEventListener('pointercancel', onCanvasCancel);
      window.removeEventListener('resize', onResize);
      sizeObserver?.disconnect();
      themeObserver?.disconnect();
      schemeQuery?.removeEventListener('change', onThemeChange);
      pinQuery?.removeEventListener('change', onPinChange);
      observer?.disconnect();
      initRef.current = noop;
      redrawRef.current = noop;
      setDragCursor(false);
      applyOn(false);
      applyFlip(false);
      callout.style.left = '';
      callout.style.top = '';
    };
  }, [graph, reduced, toggleBig]);

  return (
    <section
      ref={sectionRef}
      className={cx(styles.nucleus, big && styles.big)}
      id="nucleus"
      aria-label={UI.sectionLabel}
    >
      <div ref={stageRef} className={styles.stage} id={STAGE_ID}>
        <div className={styles.hex} aria-hidden="true" />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.scan} aria-hidden="true" />
        <div className={styles.hud}>
          <div className={styles.orbits} aria-hidden="true">
            <div className={styles.ringx} />
            <div className={styles.ringy} />
          </div>
          <div ref={calloutRef} className={styles.callout}>
            {focused?.group ? <div className={styles.cGroup}>{focused.group}</div> : null}
            <div className={styles.cName}>{focused?.name}</div>
            <div className={styles.cDesc}>{focused?.description}</div>
          </div>
          <button
            type="button"
            className={cx('btn', 'btn-small', styles.expand)}
            aria-expanded={big}
            aria-controls={STAGE_ID}
            onClick={() => {
              toggleBig();
            }}
          >
            {big ? UI.collapse : UI.expand}
          </button>
        </div>
      </div>
      <ul className={styles.srOnly}>
        {profile.systemsMap.groups.map((group) => (
          <li key={group.group}>{group.group}</li>
        ))}
      </ul>
    </section>
  );
}
