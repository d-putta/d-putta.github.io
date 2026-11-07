import type { Profile } from '@/content/types';

/** A point in the unit-sphere space the map is laid out in. */
export type Vec3 = readonly [number, number, number];

export interface MapNode {
  readonly name: string;
  readonly description: string;
  /** Group label drawn on the canvas for hubs; empty for the core node. */
  readonly group: string;
  /** Rest position once assembled. */
  readonly p: Vec3;
  /** Scatter position the node flies in from. */
  readonly sp: Vec3;
  readonly hub: boolean;
  readonly core: boolean;
  /** Group index, -1 for the core. */
  readonly gi: number;
  /** Index of the node this one hangs off; -1 for the core. */
  readonly parent: number;
}

export interface MapEdge {
  readonly a: number;
  readonly b: number;
  /** Base opacity weight. */
  readonly w: number;
}

export interface MapGraph {
  readonly nodes: readonly MapNode[];
  readonly edges: readonly MapEdge[];
  /** The seeded generator, shared with the scene so auto-focus stays deterministic. */
  readonly rnd: () => number;
}

/** Park–Miller LCG; the prototype seeds it with 7. */
export function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const ORIGIN: Vec3 = [0, 0, 0];

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * Builds the node graph from the profile content: the core in the middle, one hub per
 * group on a golden-angle spiral, and each group's remaining concepts scattered near its
 * hub. Random draws happen in the same order as the prototype so the layout matches.
 */
export function buildGraph(map: Profile['systemsMap'], seed = 7): MapGraph {
  const rnd = createRng(seed);
  const drafts: Omit<MapNode, 'sp'>[] = [
    {
      name: map.core.name,
      description: map.core.description,
      group: '',
      p: ORIGIN,
      hub: true,
      core: true,
      gi: -1,
      parent: -1,
    },
  ];

  const spread = Math.max(1, map.groups.length - 1);
  for (const [gi, group] of map.groups.entries()) {
    const hubConcept = group.concepts[0];
    if (!hubConcept) continue;
    const y = (1 - (gi / spread) * 2) * 0.82;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * gi + 0.7;
    const hubPosition: Vec3 = [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
    const hubIndex = drafts.length;
    drafts.push({
      name: hubConcept.name,
      description: hubConcept.description,
      group: group.group,
      p: hubPosition,
      hub: true,
      core: false,
      gi,
      parent: 0,
    });
    for (const concept of group.concepts.slice(1)) {
      const position = normalize([
        hubPosition[0] + (rnd() - 0.5) * 0.9,
        hubPosition[1] + (rnd() - 0.5) * 0.9,
        hubPosition[2] + (rnd() - 0.5) * 0.9,
      ]);
      drafts.push({
        name: concept.name,
        description: concept.description,
        group: group.group,
        p: position,
        hub: false,
        core: false,
        gi,
        parent: hubIndex,
      });
    }
  }

  const nodes: MapNode[] = drafts.map((draft) => {
    const a = rnd() * Math.PI * 2;
    const b = (rnd() - 0.5) * Math.PI;
    const r = 2.4 + rnd() * 1.2;
    const sp: Vec3 = [
      Math.cos(a) * Math.cos(b) * r,
      Math.sin(b) * r,
      Math.sin(a) * Math.cos(b) * r,
    ];
    return { ...draft, sp };
  });

  const edges: MapEdge[] = [];
  for (const [i, node] of nodes.entries()) {
    if (node.core) continue;
    edges.push(node.hub ? { a: 0, b: i, w: 1 } : { a: node.parent, b: i, w: 0.9 });
  }
  for (let a = 1; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const na = nodes[a];
      const nb = nodes[b];
      if (!na || !nb) continue;
      if (na.hub && nb.hub) {
        edges.push({ a, b, w: 0.35 });
        continue;
      }
      const d = distance(na.p, nb.p);
      if (na.gi === nb.gi && d < 0.62 && !na.hub && !nb.hub) edges.push({ a, b, w: 0.45 });
      else if (na.gi !== nb.gi && d < 0.42) edges.push({ a, b, w: 0.22 });
    }
  }

  return { nodes, edges, rnd };
}
