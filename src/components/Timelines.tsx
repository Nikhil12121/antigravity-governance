import React from 'react';
import type { GovernanceData } from '../context/DeckContext';

type TimelineProps = {
  data: GovernanceData;
  years: number[];
  recalculating?: boolean;
  onMilestoneClick?: (id: string, type: 'lifecycle' | 'scenario') => void;
};

export const Template1 = ({ data, years, recalculating, onMilestoneClick }: TimelineProps) => {
  return (
    <div className="gantt-container template-1" style={{ pointerEvents: onMilestoneClick ? 'auto' : 'none', position: 'relative' }}>
      <div className={`recalc-overlay ${recalculating ? 'active' : ''}`}><span className="spinner"></span></div>
      <div className="gantt-grid t1-grid" style={{ gridTemplateColumns: `80px 20px repeat(${years.length}, 1fr)` }}>
        <div className="hio-cell hio-header-cell border-b border-r"></div>
        <div className="hio-cell hio-header-cell border-b border-r" style={{ padding: 0 }}></div>
        {years.map(year => (
          <div key={year} className="hio-cell hio-header-cell border-b border-r text-center">{year}</div>
        ))}

        {data.lifecycleGroups?.map((group) => {
          const groupBars = group.swimlanes.map(lane => data.lifecycleBars?.find(b => b.swimlane === lane)).filter(Boolean);
          const rowHeight = Math.max(80, groupBars.length * 40 + 20);

          return (
            <div key={group.groupName} className="hio-row-contents" style={{ display: 'contents' }}>
              <div className="hio-cell border-r border-b group-label-cell" style={{ height: `${rowHeight}px` }}>
                <div className="group-text">{group.groupName}</div>
              </div>
              <div className="hio-cell border-b border-r" style={{ width: '20px', height: `${rowHeight}px`, padding: 0 }}></div>
              <div className="hio-cell border-b scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', borderRight: '1px solid var(--border-light)', height: `${rowHeight}px`, padding: '0' }}>
                 {years.map((y, yi) => (
                   <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>
                 ))}
                 
                 {groupBars.map((bar, idx) => {
                   if (!bar) return null;
                   const laneMilestones = data.lifecycleMilestones?.filter(m => m.swimlane === bar.swimlane) || [];
                   const topPos = 15 + (idx * 38);

                   return (
                     <React.Fragment key={bar.id}>
                       <div className={`lifecycle-bar ${bar.colorClass}`} style={{ left: `${Math.max(0, (bar.startYear - years[0]) / years.length * 100)}%`, width: `${Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100)}%`, top: `${topPos}px`, transform: 'none' }}>
                         {bar.name}
                       </div>
                       {laneMilestones.map(m => {
                         const yIdx = years.indexOf(m.year);
                         if (yIdx === -1) return null;
                         const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                         return (
                           <div key={m.id} className="milestone-marker selected t1-marker" style={{ left: `${leftPos}%`, top: `${topPos - 2}px`, transform: 'translate(-50%, -50%)', zIndex: 20, pointerEvents: 'auto' }} onClick={(e) => { if(onMilestoneClick) { e.stopPropagation(); onMilestoneClick(m.id, 'lifecycle'); } }}>
                             ◆
                             <span className="milestone-label" style={{ top: '-18px', left: '50%', transform: 'translateX(-50%)', background: 'transparent' }}>{m.name}</span>
                           </div>
                         );
                       })}
                     </React.Fragment>
                   );
                 })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Template2 = ({ data, years, recalculating, onMilestoneClick }: TimelineProps) => {
  const bars = data.lifecycleBars || [];
  const cmcBars = bars.slice(0, 2);
  const clinicalBars = bars.slice(2);
  const globalMilestoneIds = ['lm2', 'lm3', 'lm5', 'lm6'];
  const dependencyMilestones = (data.lifecycleMilestones || []).filter(m => globalMilestoneIds.includes(m.id));

  return (
    <div className="gantt-container template-2" style={{ pointerEvents: onMilestoneClick ? 'auto' : 'none', position: 'relative' }}>
      <div className={`recalc-overlay ${recalculating ? 'active' : ''}`}><span className="spinner"></span></div>
      
      <div className="gantt-grid t2-unified-grid" style={{ gridTemplateColumns: `160px repeat(${years.length}, 1fr) 80px`, position: 'relative' }}>
        <div className="hio-cell hio-header-cell border-b border-r text-left pl-2" style={{ background: 'var(--bg-surface)' }}></div>
        {years.map(year => (
          <div key={year} className="hio-cell hio-header-cell border-b border-r text-center">{year}</div>
        ))}
        <div className="hio-cell hio-header-cell border-b text-center">Total [£m]</div>

        <div style={{ gridColumn: `2 / span ${years.length}`, gridRow: `4 / span ${clinicalBars.length + 1}`, position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          {dependencyMilestones.map((m, i) => {
               const yIdx = years.indexOf(m.year);
               if (yIdx === -1) return null;
               const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
               return <div key={`dep-${i}`} className="vertical-dependency-line" style={{ left: `${leftPos}%`, top: '22px', bottom: '0', borderLeft: '2px dashed #f97316' }}></div>;
          })}
        </div>

        {cmcBars.map((bar, bIdx) => {
          const laneMilestones = (data.lifecycleMilestones || []).filter(m => m.swimlane === bar.swimlane && !globalMilestoneIds.includes(m.id));
          const isSolid = bar.name.includes('Ph 3') && !bar.name.includes('manufacture');
          const barClass = isSolid ? 'solid-green' : bar.colorClass;

          return (
            <div key={bar.id} className="hio-row-contents" style={{ display: 'contents' }}>
              <div className="hio-cell border-r border-b" style={{ background: bIdx % 2 === 0 ? '#f8fafc' : '#ffffff' }}></div>
              <div className="hio-cell border-b border-r scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '44px', padding: 0 }}>
                 {years.map((y, yi) => <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>)}
                 <div className={`lifecycle-bar t2-bar ${barClass}`} style={{ left: `${Math.max(0, (bar.startYear - years[0]) / years.length * 100)}%`, width: `${Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100)}%`, top: '50%', transform: 'translateY(-50%)' }}>
                   {bar.name}
                 </div>
                 {laneMilestones.map(m => {
                   const yIdx = years.indexOf(m.year);
                   if (yIdx === -1) return null;
                   const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                   return (
                     <div key={m.id} className="milestone-marker selected t1-marker" style={{ left: `${leftPos}%`, top: `6px`, transform: 'translate(-50%, -50%)', zIndex: 20, pointerEvents: 'auto' }} onClick={(e) => { if(onMilestoneClick) { e.stopPropagation(); onMilestoneClick(m.id, 'lifecycle'); } }}>
                       ◆
                       <span className="milestone-label" style={{ top: '-18px', left: '50%', transform: 'translateX(-50%)', background: 'transparent' }}>{m.name}</span>
                     </div>
                   );
                 })}
              </div>
              <div className="hio-cell border-b"></div>
            </div>
          );
        })}

        <div className="hio-row-contents" style={{ display: 'contents' }}>
          <div className="hio-cell border-r border-b"></div>
          <div className="hio-cell border-b border-r scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '44px', padding: 0 }}>
             {years.map((y, yi) => <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>)}
             {dependencyMilestones.map((m, i) => {
               const yIdx = years.indexOf(m.year);
               if (yIdx === -1) return null;
               const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
               return (
                 <div key={`track-m-${i}`} className="milestone-marker selected m-color-2" style={{ left: `${leftPos}%`, top: `50%`, transform: 'translate(-50%, -50%)', zIndex: 20, pointerEvents: 'auto' }} onClick={(e) => { if(onMilestoneClick) { e.stopPropagation(); onMilestoneClick(m.id, 'lifecycle'); } }}>
                   ◆
                   <span className="milestone-label" style={{ top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'transparent', color: '#ef4444', fontWeight: 'bold' }}>{m.name}</span>
                 </div>
               );
             })}
          </div>
          <div className="hio-cell border-b" style={{ background: '#f8fafc' }}></div>
        </div>

        {clinicalBars.map((bar, bIdx) => {
          const laneMilestones = (data.lifecycleMilestones || []).filter(m => m.swimlane === bar.swimlane && !globalMilestoneIds.includes(m.id));
          const isSolid = bar.name.includes('Ph 3') && !bar.name.includes('manufacture');
          const barClass = isSolid ? 'solid-green' : bar.colorClass;

          return (
            <div key={bar.id} className="hio-row-contents" style={{ display: 'contents' }}>
              <div className="hio-cell border-r border-b" style={{ background: bIdx % 2 === 1 ? '#f8fafc' : '#ffffff' }}></div>
              <div className="hio-cell border-b border-r scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '44px', padding: 0 }}>
                 {years.map((y, yi) => <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>)}
                 <div className={`lifecycle-bar t2-bar ${barClass}`} style={{ left: `${Math.max(0, (bar.startYear - years[0]) / years.length * 100)}%`, width: `${Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100)}%`, top: '50%', transform: 'translateY(-50%)' }}>
                   {bar.name}
                 </div>
                 {laneMilestones.map(m => {
                   const yIdx = years.indexOf(m.year);
                   if (yIdx === -1) return null;
                   const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                   return (
                     <div key={m.id} className="milestone-marker selected t1-marker" style={{ left: `${leftPos}%`, top: `6px`, transform: 'translate(-50%, -50%)', zIndex: 20, pointerEvents: 'auto' }} onClick={(e) => { if(onMilestoneClick) { e.stopPropagation(); onMilestoneClick(m.id, 'lifecycle'); } }}>
                       ◆
                       <span className="milestone-label" style={{ top: '-18px', left: '50%', transform: 'translateX(-50%)', background: 'transparent' }}>{m.name}</span>
                     </div>
                   );
                 })}
              </div>
              <div className="hio-cell border-b"></div>
            </div>
          );
        })}

        <div className="hio-row-contents fin-divider" style={{ display: 'contents' }}>
          <div className="hio-cell border-b border-r fin-header text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>Cumulative PTRS / IRR to key inflection points</div>
          {years.map(y => <div key={`ptrs-${y}`} className="hio-cell border-b border-r text-center text-sm text-muted"></div>)}
          <div className="hio-cell border-b text-center text-sm text-muted"></div>
        </div>
        
        <div className="hio-row-contents" style={{ display: 'contents' }}>
          <div className="hio-cell border-r fin-label text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>Gross EPE (£m) by year</div>
          {years.map(year => <div key={`fin1-${year}`} className="hio-cell border-r text-center text-sm">{data.financials?.[0]?.data[year] || '-'}</div>)}
          <div className="hio-cell text-center fw-600">{data.financials?.[0]?.summaryEPE || '-'}</div>
        </div>

        <div className="hio-row-contents" style={{ display: 'contents' }}>
          <div className="hio-cell border-r fin-label text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>IPE (£m) by year</div>
          {years.map(year => <div key={`fin2-${year}`} className="hio-cell border-r text-center text-sm">{data.financials?.[1]?.data[year] || '-'}</div>)}
          <div className="hio-cell text-center fw-600">{data.financials?.[1]?.summaryIPE || '-'}</div>
        </div>

        <div className="hio-row-contents" style={{ display: 'contents' }}>
          <div className="hio-cell border-r fin-label text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>Milestone payments (£m)</div>
          {years.map(year => <div key={`fin3-${year}`} className="hio-cell border-r text-center text-sm">-</div>)}
          <div className="hio-cell text-center fw-600">-</div>
        </div>

        <div className="hio-row-contents" style={{ display: 'contents' }}>
          <div className="hio-cell border-r border-b fin-label text-sm text-muted fw-600 pl-2" style={{ display: 'flex', alignItems: 'center' }}>PTRS %</div>
          {years.map(year => {
             const val = year === 2024 ? '20' : year === 2026 ? '50' : year === 2029 ? '70' : year === 2032 ? '90' : '';
             return <div key={`fin4-${year}`} className="hio-cell border-r border-b text-center text-sm fw-600">{val}</div>
          })}
          <div className="hio-cell border-b text-center fw-600"></div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem' }}>
        <div className="legend-item" style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '2px 8px', borderRadius: '4px' }}>CMC</div>
        <div className="legend-item" style={{ border: '1px solid #3b82f6', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px' }}>Clinical</div>
        <div className="legend-item" style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>Approved/F&A</div>
        <div className="legend-item" style={{ border: '1px solid var(--border-medium)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px' }}>Control</div>
      </div>
    </div>
  );
};

export const Template3 = ({ data, years, recalculating, onMilestoneClick }: TimelineProps) => {
  return (
    <div className="gantt-container template-3" style={{ pointerEvents: onMilestoneClick ? 'auto' : 'none', position: 'relative' }}>
      <div className={`recalc-overlay ${recalculating ? 'active' : ''}`}><span className="spinner"></span></div>

      <div className="gantt-grid t3-grid" style={{ gridTemplateColumns: `200px repeat(${years.length}, 1fr) 80px` }}>
        <div className="hio-cell hio-header-cell border-b border-r text-center">Scenario</div>
        {years.map(year => (
          <div key={year} className="hio-cell hio-header-cell border-b border-r text-center">{year}</div>
        ))}
        <div className="hio-cell hio-header-cell border-b text-center">Total [£m]</div>

        {(data.scenarioPlans || []).map((scen) => (
          <React.Fragment key={scen.id}>
            <div className="hio-row-contents" style={{ display: 'contents' }}>
              <div className="hio-cell border-r border-b scen-label-cell" style={{ display: 'flex', alignItems: 'center' }}>
                <i style={{ fontSize: '13px' }}>{scen.name}</i>
              </div>
              
              <div className="hio-cell border-r border-b scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '110px', padding: 0 }}>
                 {years.map((y, yi) => (
                   <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>
                 ))}
                 
                 {scen.bars && scen.bars.map(bar => {
                    const leftPos = Math.max(0, (bar.startYear - years[0]) / years.length * 100);
                    const width = Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100);
                    return (
                      <div 
                        key={bar.id}
                        className="lifecycle-bar" 
                        style={{ left: `${leftPos}%`, width: `${width}%`, top: '50%', transform: 'translateY(-50%)', height: '24px', lineHeight: '20px', fontSize: '11px', textAlign: 'center', fontWeight: 600, zIndex: 5, border: '2px solid #0284c7', color: '#333' }}
                      >
                        {bar.name}
                      </div>
                    );
                 })}
                 
                 {scen.milestones && scen.milestones.filter(m => !onMilestoneClick || m.isSelected).map(m => {
                    const yIdx = years.indexOf(m.year);
                    if (yIdx === -1) return null;
                    const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                    const isTop = m.placement === 'top';
                    const topOffset = isTop ? '22px' : 'calc(100% - 22px)';
                    const diamondColor = isTop ? '#eab308' : '#0ea5e9';
                    
                    return (
                      <div 
                        key={m.id}
                        className="milestone-marker selected"
                        style={{ left: `${leftPos}%`, top: topOffset, transform: 'translate(-50%, -50%)', zIndex: 20, color: diamondColor, pointerEvents: 'auto' }}
                        onClick={(e) => { if(onMilestoneClick) { e.stopPropagation(); onMilestoneClick(m.id, 'scenario'); } }}
                      >
                        ◆
                        <span className="milestone-label" style={{ top: isTop ? '-18px' : '15px', left: '50%', transform: 'translateX(-50%)', background: 'transparent', color: 'var(--text-main)', fontWeight: 500, fontSize: '10px' }}>{m.name}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="hio-cell border-b text-center fw-600 scen-val-cell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{scen.totalEpe}</div>
            </div>

            <div className="hio-row-contents" style={{ display: 'contents' }}>
              <div className="hio-cell border-r border-b text-center text-sm text-muted" style={{ padding: '4px' }}>Cumulative EPE / IPE (£m)</div>
              {years.map(year => <div key={`fin-${scen.id}-${year}`} className="hio-cell border-r border-b text-center text-sm">{(year % 10)*3}.1/{(year%10)*2}.4</div>)}
              <div className="hio-cell border-b text-center text-sm fw-600">35.4</div>
            </div>
            <div className="hio-row-contents" style={{ display: 'contents' }}>
              <div className="hio-cell border-r border-b text-center text-sm text-muted" style={{ padding: '4px', fontStyle: 'italic' }}>PTRS %</div>
              {years.map(year => <div key={`ptrs-${scen.id}-${year}`} className="hio-cell border-r border-b text-center text-sm">{Math.min(95, 10 + (year - years[0]) * 10)}</div>)}
              <div className="hio-cell border-b text-center text-sm text-muted">{scen.ptrs}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
