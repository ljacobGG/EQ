import { useRef, useState, useCallback, useMemo } from "react";

interface Node {
  x: number;
  y: number;
}

interface Connection {
  start: Node;
  end: Node;
}

export function useWheel() {
  const wheelRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [nodeCount, setNodeCount] = useState(1);

  const svgSize = 500;
  const radius = svgSize * 0.35;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;


  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i * (360 / nodeCount) + rotation) * (Math.PI / 180);
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [nodeCount, rotation, radius, centerX, centerY]);

  const connections = useMemo(() => {
    const result: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        result.push({
          start: nodes[i],
          end: nodes[j],
        });
      }
    }
    return result;
  }, [nodes]);

  const handlePanStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  }, []);

  const handlePan = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
    const delta = clientX - startX;
    setRotation(prev => prev + delta * 0.5);
    setStartX(clientX);
  }, [isDragging, startX]);

  const handlePanEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const advance = useCallback(() => {
    if (nodeCount < 10) {
      setNodeCount(prev => prev + 1);
      setRotation(prev => prev + 36);
    }
  }, [nodeCount]);

  const retreat = useCallback(() => {
    if (nodeCount > 1) {
      setNodeCount(prev => prev - 1);
      setRotation(prev => prev - 36);
    }
  }, [nodeCount]);

  return {
    wheelRef,
    nodes,
    connections,
    rotation,
    nodeCount,
    handlePanStart,
    handlePan,
    handlePanEnd,
    advance,
    retreat,
    svgSize,
    radius,
  };
}