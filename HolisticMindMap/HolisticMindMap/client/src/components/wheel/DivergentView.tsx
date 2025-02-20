import { motion } from "framer-motion";
import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Node {
  x: number;
  y: number;
  level: number;
  id: number;
}

interface Connection {
  start: Node;
  end: Node;
}

interface DivergentViewProps {
  nodeCount: number;
}

export function DivergentView({ nodeCount }: DivergentViewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgSize = 500;
  const padding = 60;
  const horizontalSpacing = 50;
  const verticalSpacing = 60;

  // Calculate node positions in a divergent pattern
  const nodes: Node[] = [];
  const connections: Connection[] = [];
  let currentId = 0;

  // Create the initial node (level 1)
  nodes.push({
    x: padding,
    y: svgSize / 2,
    level: 1,
    id: currentId++
  });

  // For each level after the first
  for (let level = 2; level <= nodeCount; level++) {
    const x = padding + (level - 1) * horizontalSpacing;
    const previousLevelNodes = nodes.filter(n => n.level === level - 1);

    // For each node in the previous level
    previousLevelNodes.forEach(prevNode => {
      // Add up and down nodes
      const upNode = {
        x,
        y: prevNode.y - verticalSpacing,
        level,
        id: currentId++
      };
      nodes.push(upNode);
      connections.push({ start: prevNode, end: upNode });

      const downNode = {
        x,
        y: prevNode.y + verticalSpacing,
        level,
        id: currentId++
      };
      nodes.push(downNode);
      connections.push({ start: prevNode, end: downNode });
    });
  }

  const visibleNodes = nodes.filter(node => node.level <= nodeCount);
  const visibleConnections = connections.filter(
    conn =>
      visibleNodes.includes(conn.start) && visibleNodes.includes(conn.end)
  );

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calcular el número de aristas que conectan con la fila anterior
  const connectingEdges = nodeCount <= 1 ? 0 : nodes.filter(n => n.level === nodeCount).length;

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Edge Counter */}
      <div className="absolute bottom-2 left-2 bg-muted/80 backdrop-blur-sm rounded px-2 py-1 z-10">
        <span className="text-sm font-medium text-primary">
          Aristas de conexión: {connectingEdges}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`scale(${zoom}) translate(${pan.x / zoom} ${pan.y / zoom})`}>
          {/* Connections */}
          <g>
            {visibleConnections.map((connection, idx) => (
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
            {visibleNodes.map((node) => (
              <motion.circle
                key={`node-${node.id}`}
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
        </g>
      </svg>
    </div>
  );
}