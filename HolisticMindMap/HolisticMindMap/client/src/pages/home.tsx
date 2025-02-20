import { HolisticWheel } from "@/components/wheel/HolisticWheel";
import { DivergentView } from "@/components/wheel/DivergentView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWheel } from "@/hooks/use-wheel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const wheel = useWheel();

  return (
    <div className="min-h-screen w-full bg-background p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-primary mt-4">
        Visualización Holística
      </h1>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vista Interconectada */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vista Interconectada</h2>
            <div className="aspect-square w-full">
              <HolisticWheel {...wheel} />
            </div>
          </CardContent>
        </Card>

        {/* Vista Divergente */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vista Divergente</h2>
            <div className="aspect-square w-full">
              <DivergentView nodeCount={wheel.nodeCount} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles centrales */}
      <div className="mt-8 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={wheel.retreat}
          disabled={wheel.nodeCount <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="w-[400px]">
          <div className="relative h-12 bg-muted rounded-lg p-2 flex items-center justify-between">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center"
              >
                <span className={`text-sm font-medium ${
                  i + 1 === wheel.nodeCount ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={wheel.advance}
          disabled={wheel.nodeCount >= 10}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}