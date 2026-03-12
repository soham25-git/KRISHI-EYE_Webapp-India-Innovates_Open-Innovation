'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tractor, Info, Clock, CheckCircle2 } from 'lucide-react';

type HealthClass = 'Healthy' | 'Fungi' | 'Bacteria' | 'Virus' | 'Phytophthora' | 'Pests' | 'Nematodes';
type PlotState = 'unscanned' | 'scanned' | 'treated';

const HEALTH_COLORS: Record<HealthClass, string> = {
  Healthy: '#10B981',       // Emerald
  Fungi: '#F59E0B',         // Amber (Stress)
  Bacteria: '#F59E0B',      // Amber (Stress)
  Virus: '#EC4899',         // Pink (Infected)
  Phytophthora: '#EC4899',  // Pink (Infected)
  Pests: '#EF4444',         // Red (Infected)
  Nematodes: '#EF4444',     // Red (Infected)
};

// For the simplified 3-state legend
const CORE_STATES = {
    HEALTHY: { label: 'Healthy', color: '#10B981' },
    STRESS: { label: 'Suspected Stress', color: '#F59E0B' },
    INFECTED: { label: 'Infected / Requires Treatment', color: '#EF4444' }
};

interface Plot {
  id: string;
  x: number;
  y: number;
  health: HealthClass;
  state: PlotState;
}

export function FarmHeatmap() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [tractorPos, setTractorPos] = useState({ x: 0, y: 0 });
  const [hoveredPlot, setHoveredPlot] = useState<Plot | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Grid Constants for exactly matching the visual reference
  // 3 crop rows | 1 road row | 3 crop rows
  const ROWS = 7;
  const COLS = 16;
  const ROAD_ROW = 3;
  const TICK_MS = 600;

  // Initialize farm grid
  useEffect(() => {
    const initialPlots: Plot[] = [];
    const classes: HealthClass[] = ['Healthy', 'Healthy', 'Healthy', 'Healthy', 'Fungi', 'Bacteria', 'Pests', 'Nematodes', 'Phytophthora', 'Virus'];
    
    for (let y = 0; y < ROWS; y++) {
      const isRoad = y === ROAD_ROW;
      for (let x = 0; x < COLS; x++) {
        if (isRoad) {
           // We don't need explicit road plots if we use CSS grid gaps or transparent plots, 
           // but we'll keep them for structure
          initialPlots.push({ id: `${x}-${y}`, x, y, health: 'Healthy', state: 'scanned' });
          continue;
        }

        const isAnomaly = Math.random() > 0.85;
        const randomClass = isAnomaly ? classes[Math.floor(Math.random() * classes.length)] : 'Healthy';
        initialPlots.push({ id: `${x}-${y}`, x, y, health: randomClass, state: 'unscanned' });
      }
    }
    setPlots(initialPlots);
    // Start at left side of road
    setTractorPos({ x: 0, y: ROAD_ROW });
  }, []);

  // Tractor movement & Scanning Logic
  useEffect(() => {
    if (plots.length === 0) return;

    const interval = setInterval(() => {
      setTractorPos(prev => {
        let { x, y } = prev;
        x += 1;
        
        // simple loop for demo purposes since there's only 1 road in this constrained view
        if (x >= COLS) {
          x = 0; 
        }

        return { x, y };
      });
      setLastUpdated(new Date());

      // Update plot states based on tractor position
      setPlots(currentPlots => {
        return currentPlots.map(plot => {
          let newState = plot.state;
          
          // Boom Treatment & Scan: Affects 3 rows ABOVE and 3 rows BELOW
          const dy = plot.y - tractorPos.y;
          const isInBoomSwath = plot.x === tractorPos.x && Math.abs(dy) <= 3 && dy !== 0;

          if (isInBoomSwath) {
             newState = plot.health !== 'Healthy' ? 'treated' : 'scanned';
          }

          // Trail Reveal behind tractor
          const isInHorizontalPath = Math.abs(dy) <= 3;
          if (isInHorizontalPath && plot.y !== tractorPos.y) {
             if (plot.x <= tractorPos.x) {
                 newState = newState === 'treated' ? 'treated' : 'scanned';
             }
          }

          return { ...plot, state: newState };
        });
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [tractorPos, plots.length]);

  const scannedCount = plots.filter(p => p.state !== 'unscanned' && p.y !== ROAD_ROW).length;
  const treatedCount = plots.filter(p => p.state === 'treated').length;
  const totalCropPlots = plots.filter(p => p.y !== ROAD_ROW).length;

  return (
    <Card className="border-[#2A2D35] bg-[#181A20] text-white w-full overflow-hidden flex flex-col h-full shadow-lg">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-[#2A2D35]/50 gap-4">
        <div>
          <CardTitle className="text-xl font-bold text-[#F1F3F5] flex items-center gap-2">
            Field Scan & Boom Progress
            <span className="inline-flex items-center rounded-full border border-[#10B981] bg-[#10B981]/10 px-2 py-0.5 text-xs font-semibold text-[#10B981]">
              LIVE (Simulated Feed)
            </span>
          </CardTitle>
          <CardDescription className="text-[#A0AAB5] mt-1">Row-based detection and automated spray treatment</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center text-[#A0AAB5] bg-[#22252C] px-3 py-1.5 rounded-full border border-[#2A2D35]">
            <span className="text-white font-mono mr-1">{scannedCount}/{totalCropPlots}</span> Scanned
          </div>
          <div className="flex items-center text-[#A0AAB5] bg-[#22252C] px-3 py-1.5 rounded-full border border-[#2A2D35]">
            <span className="text-[#10B981] font-mono mr-1">{treatedCount}</span> Treated
          </div>
          <div className="flex items-center text-[#A0AAB5] bg-[#22252C] px-3 py-1.5 rounded-full border border-[#2A2D35]">
            <Clock className="w-3 h-3 mr-1.5" />
            {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col md:flex-row h-full">
        {/* Heatmap Grid */}
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center bg-[#0F1115] relative overflow-hidden min-h-[400px]">
          <div 
            className="grid gap-1 w-full max-w-4xl" 
            style={{ 
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              aspectRatio: `${COLS}/${ROWS}`
            }}
          >
            {plots.map(plot => {
              const hasTractor = plot.x === tractorPos.x && plot.y === tractorPos.y;
              const isRoad = plot.y === ROAD_ROW;
              
              let bgColor = '#181A20'; // Base unscanned
              if (isRoad) {
                bgColor = 'transparent'; // Road color
              } else if (plot.state === 'scanned') {
                bgColor = HEALTH_COLORS[plot.health];
              } else if (plot.state === 'treated') {
                bgColor = '#92400E'; // Dark brown for treated/anomaly to simulate soil/spray
              }

              return (
                <div
                  key={plot.id}
                  onMouseEnter={() => setHoveredPlot(plot)}
                  onMouseLeave={() => setHoveredPlot(null)}
                  className={`
                    relative w-full h-full cursor-pointer flex items-center justify-center
                    transition-all duration-700
                    ${isRoad ? 'rounded-none border-t border-b border-[#22252C]/30' : 'rounded-full scale-95'}
                    ${plot.state === 'unscanned' && !isRoad ? 'opacity-30' : 'opacity-100'}
                  `}
                  style={{ backgroundColor: bgColor }}
                >
                  {hasTractor && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center overflow-visible z-50">
                        {/* Vertical Boom Line matched to screenshot */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[750%] w-1 bg-sky-400 shadow-[0_0_20px_#38BDF8] z-40 opacity-80" />
                        
                        {/* Tractor Icon enclosed in a box */}
                        <div className="bg-[#181A20]/80 border-2 border-slate-600 rounded p-1 z-50 relative ml-[-100%] shadow-lg shadow-black/50">
                            <Tractor className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend & Details Sidebar */}
        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-[#2A2D35] p-6 flex flex-col gap-6 bg-[#181A20] z-10 shrink-0">
          
          <div className="space-y-4">
            <div>
               <h4 className="text-sm font-semibold text-[#F1F3F5]">Detected Threats</h4>
               <p className="text-xs text-[#A0AAB5] mt-1 mb-3">Found by camera, awaiting boom path.</p>
            </div>
            
            <div className="space-y-3">
              {Object.values(CORE_STATES).map((state) => (
                 <div key={state.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full blur-[1px]" style={{ backgroundColor: state.color, boxShadow: `0 0 8px ${state.color}80` }} />
                      <span className="text-sm text-[#F1F3F5]">{state.label}</span>
                    </div>
                 </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
             <h4 className="text-sm font-semibold text-[#A0AAB5] uppercase tracking-wider">Map Overlay</h4>
             <div className="grid gap-3 text-sm">
                 <div className="flex items-center gap-3">
                     <div className="w-4 h-4 bg-[#1E2128] border border-[#2A2D35] rounded-sm shrink-0" />
                     <span className="text-[#A0AAB5]">Unscanned Area</span>
                 </div>
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 bg-sky-400 rounded-sm shrink-0" />
                     <span className="text-[#A0AAB5]">Boom Coverage Area</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 bg-[#EF4444] rounded-sm shrink-0" />
                     <span className="text-[#A0AAB5]">Detected Anomaly</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 bg-[#EF4444]/40 border border-[#2A2D35]/50 rounded-sm flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-white/50" />
                     </div>
                     <span className="text-[#A0AAB5]">Treated Swath</span>
                  </div>
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-[#2A2D35]">
            <h4 className="text-sm font-semibold text-[#A0AAB5] uppercase tracking-wider mb-2">Plot Inspector</h4>
            {hoveredPlot ? (
              <div className="space-y-3 bg-[#22252C] p-3 rounded-lg border border-[#2A2D35]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#A0AAB5]">Location</span>
                  <span className="text-xs font-mono text-white px-2 py-0.5 bg-[#1E2128] rounded border border-[#2A2D35]">R{hoveredPlot.y + 1} &times; C{hoveredPlot.x + 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#A0AAB5]">Diagnosis</span>
                  {hoveredPlot.state === 'unscanned' ? (
                     <span className="text-xs text-[#A0AAB5] font-semibold tracking-wide">PENDING SCAN</span>
                  ) : (
                     <span style={{ borderColor: HEALTH_COLORS[hoveredPlot.health], color: hoveredPlot.state === 'treated' ? '#A0AAB5' : HEALTH_COLORS[hoveredPlot.health] }} className="inline-flex items-center rounded-full border bg-transparent bg-opacity-10 px-2 py-0.5 text-xs font-semibold">
                      {hoveredPlot.health} {hoveredPlot.state === 'treated' && '(Treated)'}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[#A0AAB5] italic bg-[#22252C] p-3 rounded-lg border border-[#2A2D35] border-dashed">
                <Info className="w-4 h-4" />
                Hover over map to inspect
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
