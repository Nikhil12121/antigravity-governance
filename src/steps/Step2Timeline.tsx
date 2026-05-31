import React, { useState } from 'react';
import { useDeck } from '../context/DeckContext';
import './Step2Timeline.css';

const Step2Timeline = () => {
  const { data, updateData } = useDeck();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  // Comment pin states
  const [activeCommentPopover, setActiveCommentPopover] = useState<{ x: number, y: number } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const years: number[] = [];
  for (let y = data.startYear; y <= data.endYear; y++) {
    years.push(y);
  }

  // Dummy Recalculation Effect
  const triggerRecalculation = () => {
    setRecalculating(true);
    setTimeout(() => {
      setRecalculating(false);
      // In a real app, this would recalculate financials based on the toggled milestones.
      // We will just simulate a data refresh by toggling a visual indicator.
    }, 600);
  };

  const toggleMilestone = (id: string, type: 'standard' | 'lifecycle' | 'scenario') => {
    if (type === 'standard') {
      updateData({ milestones: data.milestones.map(m => m.id === id ? { ...m, isSelected: !m.isSelected } : m) });
    } else if (type === 'lifecycle') {
      updateData({ lifecycleMilestones: data.lifecycleMilestones.map(m => m.id === id ? { ...m, isSelected: !m.isSelected } : m) });
    } else if (type === 'scenario') {
      const updatedScenarios = data.scenarioPlans.map(scen => ({
        ...scen,
        milestones: scen.milestones.map(m => m.id === id ? { ...m, isSelected: !m.isSelected } : m)
      }));
      updateData({ scenarioPlans: updatedScenarios });
    }
    triggerRecalculation();
  };

  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow dropping pins if not clicking a milestone
    if ((e.target as HTMLElement).closest('.milestone-marker') || (e.target as HTMLElement).closest('.comment-pin')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setActiveCommentPopover({ x, y });
  };

  const saveComment = () => {
    if (!newCommentText.trim() || !activeCommentPopover) return;
    const newComment = {
      id: `gc_${Date.now()}`,
      text: newCommentText,
      year: data.currentYear, // arbitrary for now
      swimlane: 'General',
      x: activeCommentPopover.x,
      y: activeCommentPopover.y
    };
    updateData({ ganttComments: [...data.ganttComments, newComment] });
    setNewCommentText('');
    setActiveCommentPopover(null);
  };

  const renderCommentPins = () => {
    return data.ganttComments.map(c => (
      <div 
        key={c.id} 
        className="comment-pin"
        style={{ left: `${c.x}%`, top: `${c.y}%` }}
        title={c.text}
      >
        💬
        <div className="comment-tooltip">{c.text}</div>
      </div>
    ));
  };

  const renderTemplate1 = () => {
    // Template 1: Asset Plan showing Primary indication and Life Cycle Innovation
    return (
      <div className="gantt-container template-1" onClick={handleChartClick}>
        <div className="gantt-grid t1-grid" style={{ gridTemplateColumns: `80px 20px repeat(${years.length}, 1fr)` }}>
          <div className="hio-cell hio-header-cell border-b border-r"></div>
          <div className="hio-cell hio-header-cell border-b border-r" style={{ padding: 0 }}></div>
          {years.map(year => (
            <div key={year} className="hio-cell hio-header-cell border-b border-r text-center">{year}</div>
          ))}

          {data.lifecycleGroups.map((group) => {
            // Find all bars for this group
            const groupBars = group.swimlanes.map(lane => data.lifecycleBars?.find(b => b.swimlane === lane)).filter(Boolean);
            
            // The row needs to be tall enough to hold all bars (approx 40px per bar + padding)
            const rowHeight = Math.max(80, groupBars.length * 40 + 20);

            return (
              <div key={group.groupName} className="hio-row-contents" style={{ display: 'contents' }}>
                {/* Group Label Cell (Left column) */}
                <div className="hio-cell border-r border-b group-label-cell" style={{ height: `${rowHeight}px` }}>
                  <div className="group-text">{group.groupName}</div>
                </div>

                {/* Spacer Column */}
                <div className="hio-cell border-b border-r" style={{ width: '20px', height: `${rowHeight}px`, padding: 0 }}></div>

                {/* Timeline Area for this Group (spanning all years) */}
                <div className="hio-cell border-b scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', borderRight: '1px solid var(--border-light)', height: `${rowHeight}px`, padding: '0' }}>
                   {years.map((y, yi) => (
                     <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}>
                     </div>
                   ))}
                   
                   {/* Render the Bars stacked vertically */}
                   {groupBars.map((bar, idx) => {
                     if (!bar) return null;
                     const laneMilestones = data.lifecycleMilestones.filter(m => m.swimlane === bar.swimlane);
                     const topPos = 15 + (idx * 38); // vertical stacking

                     return (
                       <React.Fragment key={bar.id}>
                         <div 
                           className={`lifecycle-bar ${bar.colorClass}`} 
                           style={{ 
                             left: `${Math.max(0, (bar.startYear - years[0]) / years.length * 100)}%`, 
                             width: `${Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100)}%`,
                             top: `${topPos}px`,
                             transform: 'none'
                           }}
                         >
                           {bar.name}
                         </div>

                         {/* Render Milestones for this bar */}
                         {laneMilestones.map(m => {
                           const yIdx = years.indexOf(m.year);
                           if (yIdx === -1) return null;
                           const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                           
                           return (
                             <div 
                               key={m.id} 
                               className="milestone-marker selected t1-marker"
                               style={{ 
                                 left: `${leftPos}%`,
                                 top: `${topPos - 2}px`, // Place above the 28px bar
                                 transform: 'translate(-50%, -50%)',
                                 zIndex: 20
                               }}
                               onClick={(e) => { e.stopPropagation(); toggleMilestone(m.id, 'lifecycle'); }}
                               title="Click to toggle"
                             >
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
        {renderCommentPins()}
      </div>
    );
  };

  const renderTemplate2 = () => {
    // Template 2: High level project plan to launch with financials
    const bars = data.lifecycleBars || [];
    const cmcBars = bars.slice(0, 2);
    const clinicalBars = bars.slice(2);
    const globalMilestoneIds = ['lm2', 'lm3', 'lm5', 'lm6'];
    const dependencyMilestones = (data.lifecycleMilestones || []).filter(m => globalMilestoneIds.includes(m.id));

    return (
      <div className="gantt-container template-2" onClick={handleChartClick}>
        {renderCommentPins()}
        <div className={`recalc-overlay ${recalculating ? 'active' : ''}`}><span className="spinner"></span> Recalculating Financials...</div>
        
        <div className="gantt-grid t2-unified-grid" style={{ gridTemplateColumns: `160px repeat(${years.length}, 1fr) 80px`, position: 'relative' }}>
          {/* Header Row */}
          <div className="hio-cell hio-header-cell border-b border-r text-left pl-2" style={{ background: 'var(--bg-surface)' }}></div>
          {years.map(year => (
            <div key={year} className="hio-cell hio-header-cell border-b border-r text-center">{year}</div>
          ))}
          <div className="hio-cell hio-header-cell border-b text-center">Total [£m]</div>

          {/* Timeline Area Overlay for Vertical Lines */}
          <div style={{ gridColumn: `2 / span ${years.length}`, gridRow: `4 / span ${clinicalBars.length + 1}`, position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
            {dependencyMilestones.map((m, i) => {
                 const yIdx = years.indexOf(m.year);
                 if (yIdx === -1) return null;
                 const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                 
                 // Drop from the center of Row 4 (22px) down to the bottom of the clinical bars
                 return (
                   <div key={`dep-${i}`} className="vertical-dependency-line" style={{ left: `${leftPos}%`, top: '22px', bottom: '0', borderLeft: '2px dashed #f97316' }}></div>
                 );
            })}
          </div>

          {/* CMC Bars (Rows 2 & 3) */}
          {cmcBars.map((bar, bIdx) => {
            const laneMilestones = (data.lifecycleMilestones || []).filter(m => m.swimlane === bar.swimlane && !globalMilestoneIds.includes(m.id));
            const isSolid = bar.name.includes('Ph 3') && !bar.name.includes('manufacture');
            const barClass = isSolid ? 'solid-green' : bar.colorClass;

            return (
              <div key={bar.id} className="hio-row-contents" style={{ display: 'contents' }}>
                <div className="hio-cell border-r border-b" style={{ background: bIdx % 2 === 0 ? '#f8fafc' : '#ffffff' }}></div>
                
                <div className="hio-cell border-b border-r scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '44px', padding: 0 }}>
                   {/* Background vertical grid lines */}
                   {years.map((y, yi) => (
                     <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>
                   ))}
                   
                   {/* The Bar */}
                   <div 
                     className={`lifecycle-bar t2-bar ${barClass}`} 
                     style={{ 
                       left: `${Math.max(0, (bar.startYear - years[0]) / years.length * 100)}%`, 
                       width: `${Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100)}%`,
                       top: '50%',
                       transform: 'translateY(-50%)'
                     }}
                   >
                     {bar.name}
                   </div>
                   
                   {/* Milestones */}
                   {laneMilestones.map(m => {
                     const yIdx = years.indexOf(m.year);
                     if (yIdx === -1) return null;
                     const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                     return (
                       <div 
                         key={m.id} 
                         className="milestone-marker selected t1-marker"
                         style={{ left: `${leftPos}%`, top: `6px`, transform: 'translate(-50%, -50%)', zIndex: 20 }}
                         onClick={(e) => { e.stopPropagation(); toggleMilestone(m.id, 'lifecycle'); }}
                         title="Click to toggle"
                       >
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

          {/* Dedicated Key Milestones Track (Row 4) */}
          <div className="hio-row-contents" style={{ display: 'contents' }}>
            <div className="hio-cell border-r border-b"></div>
            <div className="hio-cell border-b border-r scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '44px', padding: 0 }}>
               {years.map((y, yi) => (
                 <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>
               ))}
               
               {dependencyMilestones.map((m, i) => {
                 const yIdx = years.indexOf(m.year);
                 if (yIdx === -1) return null;
                 const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                 
                 return (
                   <div 
                     key={`track-m-${i}`} 
                     className="milestone-marker selected m-color-2"
                     style={{ left: `${leftPos}%`, top: `50%`, transform: 'translate(-50%, -50%)', zIndex: 20 }}
                     title={m.name}
                     onClick={(e) => { e.stopPropagation(); toggleMilestone(m.id, 'lifecycle'); }}
                   >
                     ◆
                     <span className="milestone-label" style={{ top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'transparent', color: '#ef4444', fontWeight: 'bold' }}>{m.name}</span>
                   </div>
                 );
               })}
            </div>
            <div className="hio-cell border-b" style={{ background: '#f8fafc' }}></div>
          </div>

          {/* Clinical Bars (Rows 5+) */}
          {clinicalBars.map((bar, bIdx) => {
            const laneMilestones = (data.lifecycleMilestones || []).filter(m => m.swimlane === bar.swimlane && !globalMilestoneIds.includes(m.id));
            const isSolid = bar.name.includes('Ph 3') && !bar.name.includes('manufacture');
            const barClass = isSolid ? 'solid-green' : bar.colorClass;

            return (
              <div key={bar.id} className="hio-row-contents" style={{ display: 'contents' }}>
                <div className="hio-cell border-r border-b" style={{ background: bIdx % 2 === 1 ? '#f8fafc' : '#ffffff' }}></div>
                
                <div className="hio-cell border-b border-r scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '44px', padding: 0 }}>
                   {/* Background vertical grid lines */}
                   {years.map((y, yi) => (
                     <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>
                   ))}
                   
                   {/* The Bar */}
                   <div 
                     className={`lifecycle-bar t2-bar ${barClass}`} 
                     style={{ 
                       left: `${Math.max(0, (bar.startYear - years[0]) / years.length * 100)}%`, 
                       width: `${Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100)}%`,
                       top: '50%',
                       transform: 'translateY(-50%)'
                     }}
                   >
                     {bar.name}
                   </div>
                   
                   {/* Milestones */}
                   {laneMilestones.map(m => {
                     const yIdx = years.indexOf(m.year);
                     if (yIdx === -1) return null;
                     const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                     return (
                       <div 
                         key={m.id} 
                         className="milestone-marker selected t1-marker"
                         style={{ left: `${leftPos}%`, top: `6px`, transform: 'translate(-50%, -50%)', zIndex: 20 }}
                         onClick={(e) => { e.stopPropagation(); toggleMilestone(m.id, 'lifecycle'); }}
                         title="Click to toggle"
                       >
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

          {/* Financials matching Image 2 */}
          <div className="hio-row-contents fin-divider" style={{ display: 'contents' }}>
            <div className="hio-cell border-b border-r fin-header text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>Cumulative PTRS / IRR to key inflection points</div>
            {years.map(y => <div key={`ptrs-${y}`} className="hio-cell border-b border-r text-center text-sm text-muted"></div>)}
            <div className="hio-cell border-b text-center text-sm text-muted"></div>
          </div>
          
          <div className="hio-row-contents" style={{ display: 'contents' }}>
            <div className="hio-cell border-r fin-label text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>Gross EPE (£m) by year</div>
            {years.map(year => <div key={`fin1-${year}`} className="hio-cell border-r text-center text-sm">{data.financials[0]?.data[year] || '-'}</div>)}
            <div className="hio-cell text-center fw-600">{data.financials[0]?.summaryEPE || '-'}</div>
          </div>

          <div className="hio-row-contents" style={{ display: 'contents' }}>
            <div className="hio-cell border-r fin-label text-sm text-muted pl-2" style={{ display: 'flex', alignItems: 'center' }}>IPE (£m) by year</div>
            {years.map(year => <div key={`fin2-${year}`} className="hio-cell border-r text-center text-sm">{data.financials[1]?.data[year] || '-'}</div>)}
            <div className="hio-cell text-center fw-600">{data.financials[1]?.summaryIPE || '-'}</div>
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

  const renderTemplate3 = () => {
    // Template 3: High level plan showing scenarios
    return (
      <div className="gantt-container template-3" onClick={handleChartClick}>
        {renderCommentPins()}
        <div className={`recalc-overlay ${recalculating ? 'active' : ''}`}><span className="spinner"></span> Recalculating Scenarios...</div>

        <div className="gantt-grid t3-grid" style={{ gridTemplateColumns: `200px repeat(${years.length}, 1fr) 80px` }}>
          <div className="hio-cell hio-header-cell border-b border-r text-center">Scenario</div>
          {years.map(year => (
            <div key={year} className="hio-cell hio-header-cell border-b border-r text-center">{year}</div>
          ))}
          <div className="hio-cell hio-header-cell border-b text-center">Total [£m]</div>

          {data.scenarioPlans.map((scen) => (
            <React.Fragment key={scen.id}>
              <div className="hio-row-contents" style={{ display: 'contents' }}>
                {/* Scenario Name */}
                <div className="hio-cell border-r border-b scen-label-cell" style={{ display: 'flex', alignItems: 'center' }}>
                  <i style={{ fontSize: '13px' }}>{scen.name}</i>
                </div>
                
                {/* Timeline spanning all years */}
                <div className="hio-cell border-r border-b scen-timeline-wrapper" style={{ gridColumn: `span ${years.length}`, position: 'relative', height: '110px', padding: 0 }}>
                   {years.map((y, yi) => (
                     <div key={`col-${y}`} className="scen-year-col" style={{ left: `${(yi / years.length) * 100}%`, width: `${100 / years.length}%` }}></div>
                   ))}
                   
                   {/* Render Bars */}
                   {scen.bars && scen.bars.map(bar => {
                      const leftPos = Math.max(0, (bar.startYear - years[0]) / years.length * 100);
                      const width = Math.max(0.5, (bar.endYear - bar.startYear) / years.length * 100);
                      return (
                        <div 
                          key={bar.id}
                          className="lifecycle-bar" 
                          style={{ 
                            left: `${leftPos}%`, 
                            width: `${width}%`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            height: '24px',
                            lineHeight: '20px',
                            fontSize: '11px',
                            textAlign: 'center',
                            fontWeight: 600,
                            zIndex: 5,
                            border: '2px solid #0284c7', // Thick blue border
                            color: '#333' // Dark text
                          }}
                        >
                          {bar.name}
                        </div>
                      );
                   })}
                   
                   {/* Render Milestones */}
                   {scen.milestones && scen.milestones.filter(m => m.isSelected).map(m => {
                      const yIdx = years.indexOf(m.year);
                      if (yIdx === -1) return null;
                      const leftPos = (yIdx / years.length) * 100 + (m.position / 100) * (100 / years.length);
                      
                      const isTop = m.placement === 'top';
                      const topOffset = isTop ? '22px' : 'calc(100% - 22px)';
                      const diamondColor = isTop ? '#eab308' : '#0ea5e9'; // Yellow for top, blue for bottom
                      
                      return (
                        <React.Fragment key={m.id}>
                          {/* The Milestone Diamond */}
                          <div 
                            className="milestone-marker selected"
                            style={{ left: `${leftPos}%`, top: topOffset, transform: 'translate(-50%, -50%)', zIndex: 20, color: diamondColor }}
                            onClick={(e) => { e.stopPropagation(); toggleMilestone(m.id, 'scenario'); }}
                            title="Click to toggle"
                          >
                            ◆
                            <span className="milestone-label" style={{ 
                              top: isTop ? '-18px' : '15px', 
                              left: '50%', 
                              transform: 'translateX(-50%)', 
                              background: 'transparent',
                              color: 'var(--text-main)',
                              fontWeight: 500,
                              fontSize: '10px'
                            }}>{m.name}</span>
                          </div>
                        </React.Fragment>
                      );
                   })}
                </div>

                {/* Total EPE */}
                <div className="hio-cell border-b text-center fw-600 scen-val-cell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{scen.totalEpe}</div>
              </div>
              
              {/* Scenario EPE/IPE Subrow (from visual) */}
              <div className="hio-row-contents" style={{ display: 'contents' }}>
                <div className="hio-cell border-r border-b text-center text-sm text-muted bg-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>Cumulative EPE / IPE (£m)</div>
                {years.map(y => <div key={`epe-${y}`} className="hio-cell border-r border-b text-center text-sm text-muted bg-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>XX.X/XX.X</div>)}
                <div className="hio-cell border-b text-center text-sm text-muted bg-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>XX.X</div>
              </div>

              {/* Scenario PTRS Subrow (from visual) */}
              <div className="hio-row-contents" style={{ display: 'contents' }}>
                <div className="hio-cell border-r border-b text-center text-sm text-muted bg-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>PTRS %</div>
                {years.map(y => <div key={`ptrs-${y}`} className="hio-cell border-r border-b text-center text-sm text-muted bg-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>XX</div>)}
                <div className="hio-cell border-b text-center text-sm text-muted bg-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>{scen.ptrs}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>Asset Plans & Timelines</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Select a visual template to present. You can toggle milestones to preview financial impacts, and click anywhere on the chart to drop a comment pin.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsExpanded(true)}>
              ⤢ Fullscreen
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="template-tabs">
          <button className={`tab-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
            Lifecycle Innovation
          </button>
          <button className={`tab-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>
            Plan w/ Financials
          </button>
          <button className={`tab-btn ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>
            Scenario Plans
          </button>
        </div>

        <div className={`hio-container ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded && (
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <h2 style={{ color: 'var(--accent-primary)' }}>Interactive Project Plan</h2>
               <button className="btn btn-secondary" onClick={() => setIsExpanded(false)}>✕ Close</button>
             </div>
          )}

          <div style={{ position: 'relative' }}>
            {activeTab === 1 && renderTemplate1()}
            {activeTab === 2 && renderTemplate2()}
            {activeTab === 3 && renderTemplate3()}

            {/* Comment Popover */}
            {activeCommentPopover && (
              <div 
                className="comment-popover"
                style={{ left: `${activeCommentPopover.x}%`, top: `${activeCommentPopover.y}%` }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="comment-popover-header">
                  <span>Add Comment Pin</span>
                  <button onClick={() => setActiveCommentPopover(null)}>✕</button>
                </div>
                <textarea 
                  autoFocus
                  placeholder="Type note for PMs or presenters..." 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveComment(); }}}
                />
                <button className="btn btn-primary btn-sm" onClick={saveComment}>Save Pin</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Variance Commentary remains available at the bottom */}
      <section style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Overall Variance Commentary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem', textAlign: 'center', borderRadius: '4px 4px 0 0' }}>Actuals</div>
            <textarea 
              rows={3} 
              value={data.hioCommentary.actuals}
              onChange={(e) => updateData({ hioCommentary: { ...data.hioCommentary, actuals: e.target.value } })}
              style={{ borderRadius: '0 0 4px 4px', borderTop: 'none', background: '#f8fafc', fontSize: '0.85rem' }}
            />
          </div>
          <div>
            <div style={{ background: '#fcece8', color: '#000', padding: '0.5rem', textAlign: 'center', borderRadius: '4px 4px 0 0', border: '1px solid var(--border-medium)', borderBottom: 'none' }}>Budget</div>
            <textarea 
              rows={3} 
              value={data.hioCommentary.budget}
              onChange={(e) => updateData({ hioCommentary: { ...data.hioCommentary, budget: e.target.value } })}
              style={{ borderRadius: '0 0 4px 4px', borderTop: 'none', background: '#f8fafc', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Step2Timeline;
