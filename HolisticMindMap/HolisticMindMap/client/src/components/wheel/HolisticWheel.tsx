import { motion } from "framer-motion";
import { type Node, type Connection } from "@/hooks/use-wheel";

interface HolisticWheelProps {
  wheelRef: React.RefObject<SVGSVGElement>;
  nodes: Node[];
  connections: Connection[];
  rotation: number;
  handlePanStart: (e: React.MouseEvent | React.TouchEvent) => void;
  handlePan: (e: React.MouseEvent | React.TouchEvent) => void;
  handlePanEnd: () => void;
  svgSize: number;
  radius: number;
  nodeCount: number;
}

export function HolisticWheel(props: HolisticWheelProps) {
  const {
    wheelRef,
    nodes,
    connections,
    rotation,
    handlePanStart,
    handlePan,
    handlePanEnd,
    svgSize,
    radius,
    nodeCount,
  } = props;

  // Calcular el número total de aristas: n*(n-1)/2
  const totalEdges = (nodeCount * (nodeCount - 1)) / 2;

  return (
    <div className="relative w-full h-full">
      <svg
        ref={wheelRef}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="w-full h-full"
      >
        {/* Main circle */}
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          animate={{ rotate: rotation }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Connections */}
        <g>
          {connections.map((connection, idx) => (
            <motion.line
              key={`connection-${idx}`}
              x1={connection.start.x}
              y1={connection.start.y}
              x2={connection.end.x}
              y2={connection.end.y}
              stroke="hsl(var(--destructive))"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node, idx) => (
            <motion.circle
              key={`node-${idx}`}
              cx={node.x}
              cy={node.y}
              r="6"
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </g>
      </svg>

      {/* Edge Counter */}
      <div className="absolute bottom-2 left-2 bg-muted/80 backdrop-blur-sm rounded px-2 py-1">
        <span className="text-sm font-medium text-primary">
          Aristas: {totalEdges}
        </span>
      </div>

      {/* Interactive area for rotation */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handlePanStart}
        onMouseMove={handlePan}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onTouchStart={handlePanStart}
        onTouchMove={handlePan}
        onTouchEnd={handlePanEnd}
      />
    </div>
  );
}