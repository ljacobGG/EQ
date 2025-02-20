import { motion } from "framer-motion";

interface TimelineProps {
  currentNodes: number;
}

export function Timeline({ currentNodes }: TimelineProps) {
  return (
    <div className="relative h-12 bg-muted rounded-lg p-2 flex items-center justify-between">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center"
        >
          <motion.span
            className={`text-sm font-medium ${
              i + 1 <= currentNodes ? 'text-primary' : 'text-muted-foreground'
            }`}
            animate={{
              scale: i + 1 === currentNodes ? 1.2 : 1,
              color: i + 1 === currentNodes ? 'hsl(var(--primary))' : undefined
            }}
          >
            {i + 1}
          </motion.span>
        </div>
      ))}
    </div>
  );
}