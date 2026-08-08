"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useSound } from "@/hooks/useSound";
import { PATTERN_METADATA, getPatternsByCategory } from "@/data/patterns";
import { PatternCategory, PatternStatus } from "@/types/pattern";

interface TreeNode {
  slug: string;
  name: string;
  category: PatternCategory;
  x: number;
  y: number;
  status: PatternStatus;
}

interface TreeConnection {
  from: string;
  to: string;
}

function buildTreeLayout(): { nodes: TreeNode[]; connections: TreeConnection[] } {
  const nodes: TreeNode[] = [];
  const connections: TreeConnection[] = [];

  const categories: PatternCategory[] = ["creational", "structural", "behavioral"];
  const columnXPositions = [150, 400, 650];

  categories.forEach((category, colIndex) => {
    const patterns = getPatternsByCategory(category);
    const baseX = columnXPositions[colIndex];
    const startY = 60;
    const spacing = 120;

    patterns.forEach((pattern, rowIndex) => {
      nodes.push({
        slug: pattern.slug,
        name: pattern.name,
        category,
        x: baseX,
        y: startY + rowIndex * spacing,
        status: "available",
      });

      if (rowIndex > 0) {
        connections.push({
          from: patterns[rowIndex - 1].slug,
          to: pattern.slug,
        });
      }
    });
  });

  const crossConnections: [string, string][] = [
    ["factory-method", "abstract-factory"],
    ["abstract-factory", "builder"],
    ["adapter", "bridge"],
    ["decorator", "proxy"],
    ["facade", "mediator"],
    ["strategy", "state"],
    ["template-method", "factory-method"],
    ["observer", "mediator"],
  ];

  for (const [from, to] of crossConnections) {
    const fromNode = nodes.find((n) => n.slug === from);
    const toNode = nodes.find((n) => n.slug === to);
    if (fromNode && toNode && fromNode.category !== toNode.category) {
      connections.push({ from, to });
    }
  }

  return { nodes, connections };
}

const STATUS_COLORS: Record<PatternStatus, string> = {
  locked: "#1e2a3e",
  available: "#00d4aa",
  "in-progress": "#4af0cc",
  completed: "#00e846",
};

const CATEGORY_COLORS: Record<PatternCategory, string> = {
  creational: "#ff8844",
  structural: "#44aaff",
  behavioral: "#cc44ff",
};

export function SkillTree() {
  const router = useRouter();
  const { getStatus, isHydrated } = useGameStore();
  const { play } = useSound();

  const { nodes, connections } = buildTreeLayout();

  const nodesWithStatus = nodes.map((node) => ({
    ...node,
    status: isHydrated ? getStatus(node.slug) : node.status,
  }));

  const handleNodeClick = (slug: string, status: PatternStatus) => {
    if (status !== "locked") {
      play("click");
      router.push(`/quest/${slug}`);
    }
  };

  const svgWidth = 800;
  const svgHeight = 1300;

  return (
    <div className="w-full overflow-x-auto scrollbar-thin" data-hydrated="true">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[600px] max-w-4xl mx-auto"
        aria-label="Design Patterns Skill Tree"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Category Labels */}
        <text x={150} y={30} textAnchor="middle" fill={CATEGORY_COLORS.creational} fontSize="14" fontWeight="bold">
          Creational
        </text>
        <text x={400} y={30} textAnchor="middle" fill={CATEGORY_COLORS.structural} fontSize="14" fontWeight="bold">
          Structural
        </text>
        <text x={650} y={30} textAnchor="middle" fill={CATEGORY_COLORS.behavioral} fontSize="14" fontWeight="bold">
          Behavioral
        </text>

        {/* Layer 1: Connections (behind everything) */}
        <g className="skill-tree-connections">
          {connections.map(({ from, to }) => {
            const fromNode = nodesWithStatus.find((n) => n.slug === from);
            const toNode = nodesWithStatus.find((n) => n.slug === to);
            if (!fromNode || !toNode) return null;

            const isCrossConnection = fromNode.category !== toNode.category;
            const isActive = fromNode.status === "completed";

            return (
              <line
                key={`${from}-${to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isActive ? STATUS_COLORS.completed : "#1e2a3e"}
                strokeWidth={isCrossConnection ? 1 : 2}
                strokeDasharray={isCrossConnection ? "4 4" : undefined}
                opacity={isActive ? 0.8 : 0.3}
              />
            );
          })}
        </g>

        {/* Layer 2: Node circles */}
        <g className="skill-tree-circles">
          {nodesWithStatus.map((node) => {
            const isClickable = node.status !== "locked";
            const nodeColor = STATUS_COLORS[node.status];

            return (
              <g
                key={node.slug}
                onClick={() => handleNodeClick(node.slug, node.status)}
                className={isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                role="button"
                aria-label={`${node.name} - ${node.status}`}
                tabIndex={isClickable ? 0 : -1}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill="var(--color-surface-light)"
                  stroke={nodeColor}
                  strokeWidth={2.5}
                  filter={node.status === "available" ? "url(#glow)" : undefined}
                  opacity={node.status === "locked" ? 0.4 : 1}
                />
                {node.status === "completed" && (
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#00e846" fontSize="16">
                    ✓
                  </text>
                )}
                {node.status === "locked" && (
                  <g transform={`translate(${node.x - 6}, ${node.y - 7})`}>
                    <rect x="2" y="6" width="8" height="7" rx="1" fill="#5c6e84" />
                    <path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="#5c6e84" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                )}
                {node.status === "available" && (
                  <circle cx={node.x} cy={node.y} r={6} fill={nodeColor} opacity={0.6}>
                    <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Layer 3: Labels and descriptions (on top of lines) */}
        <g className="skill-tree-labels">
          {nodesWithStatus.map((node) => {
            const patternMeta = PATTERN_METADATA.find((p) => p.slug === node.slug);

            return (
              <g key={`label-${node.slug}`}>
                <text
                  x={node.x}
                  y={node.y + 38}
                  textAnchor="middle"
                  fill={node.status === "locked" ? "#5c6e84" : "#e8edf5"}
                  fontSize="10"
                  fontWeight="500"
                >
                  {node.name}
                </text>
                {patternMeta && node.status !== "locked" && (
                  <foreignObject
                    x={node.x - 70}
                    y={node.y + 44}
                    width={140}
                    height={40}
                  >
                    <p style={{
                      fontSize: "9px",
                      lineHeight: "1.4",
                      color: "#8a9cb4",
                      textAlign: "center",
                      fontWeight: 400,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical" as const,
                    }}>
                      {patternMeta.skillEffect}
                    </p>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
