import React, { useState, useRef, useEffect } from 'react';
import { useDeck } from '../context/DeckContext';
import { Template1, Template2, Template3 } from '../components/Timelines';
import './Step2Timeline.css';


type Interaction = {
  id: string;
  type: 'drag' | 'resize';
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
  initialW: number;
  initialH: number;
};

const Step5Preview = () => {
  const { data, updateData } = useDeck();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [activeInteraction, setActiveInteraction] = useState<Interaction | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!activeInteraction || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - activeInteraction.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - activeInteraction.startY) / rect.height) * 100;

      const newComments = data.slideComments.map(c => {
        if (c.id !== activeInteraction.id) return c;
        
        if (activeInteraction.type === 'drag') {
          return {
            ...c,
            x: Math.min(Math.max(0, activeInteraction.initialX + deltaX), 100 - c.width),
            y: Math.min(Math.max(0, activeInteraction.initialY + deltaY), 100 - c.height)
          };
        } else {
          return {
            ...c,
            width: Math.max(10, activeInteraction.initialW + deltaX),
            height: Math.max(5, activeInteraction.initialH + deltaY)
          };
        }
      });

      updateData({ slideComments: newComments });
    };

    const handleUp = () => {
      setActiveInteraction(null);
    };

    if (activeInteraction) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [activeInteraction, data.slideComments, updateData]);

  const slideStyle: React.CSSProperties = {
    aspectRatio: '16 / 9',
    background: 'white',
    color: '#0F172A',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    border: '1px solid var(--border-medium)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-light)'
  };

  const contentStyle: React.CSSProperties = {
    padding: '2rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const timelineYears = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];

  const slides = [
    // Slide 1: Cover
    (
      <div style={{ ...slideStyle, border: '2px solid #222' }} key="slide1">
        {/* Top White Section */}
        <div style={{ height: '36%', background: 'white', position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '2rem 3rem' }}>
          <div style={{ color: '#F04E23', fontSize: '1rem', fontWeight: 500, fontFamily: 'system-ui, sans-serif' }}>
            {new Date(data.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          {/* Mock GSK Logo top right */}
          <div style={{ 
            width: '100px', height: '100px', 
            background: 'linear-gradient(135deg, #FF7B00 0%, #E63800 100%)', 
            borderRadius: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '2.2rem', letterSpacing: '1px',
            fontFamily: 'system-ui, sans-serif',
            marginTop: '-0.5rem',
            marginRight: '-0.5rem'
          }}>
            GSK
          </div>
        </div>
        
        {/* The Curvy V Shape overlapping top and bottom */}
        <div style={{ position: 'absolute', top: '36%', left: '50%', transform: 'translate(-50%, -1px)', width: '220px', height: '80px', zIndex: 10 }}>
          <svg viewBox="0 0 220 80" style={{ width: '100%', height: '100%', display: 'block' }}>
            <path d="M 0 0 C 80 0, 105 80, 110 80 C 115 80, 140 0, 220 0 Z" fill="white" />
          </svg>
        </div>

        {/* Bottom Orange Gradient Section */}
        <div style={{ height: '64%', background: 'linear-gradient(150deg, #FFA500 0%, #FF5500 50%, #B32400 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <h1 style={{ 
            color: 'white', fontSize: '3rem', fontWeight: 300, 
            letterSpacing: '0.5px', marginTop: '-1rem',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {data.boardHeading}
          </h1>
          
          <div style={{ position: 'absolute', bottom: '2rem', right: '3rem', color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'system-ui, sans-serif', fontWeight: 500 }}>
            <span style={{ display: 'flex', width: '18px', height: '18px', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌐</span>
            gsk.com
          </div>
        </div>
      </div>
    ),
    // Slide 2: DRB Governance Material Structure
    (
      <div style={slideStyle} key="slide_structure">
        {/* Header */}
        <div style={{ ...headerStyle, borderBottom: 'none', padding: '0.75rem 2rem 0.5rem' }}>
          <h2 style={{ margin: 0, color: '#F04E23', fontSize: '1.4rem', fontWeight: 300, display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-block', width: '16px', height: '16px', 
              background: '#F04E23', borderRadius: '50% 0 50% 50%', marginRight: '10px' 
            }}></span>
            DRB Governance Material Structure
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>CSI External Use</span>
        </div>

        <div style={{ padding: '0 2rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem', color: '#333', lineHeight: '1.3' }}>
            <thead>
              <tr style={{ background: '#F04E23', color: 'white' }}>
                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: '500', width: '8%' }}>Slides</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: '500', width: '22%' }}>Section</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: '500', width: '40%' }}>Core slides</th>
                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: '500', width: '30%' }}>Related Appendices</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr style={{ borderBottom: '1px solid #F04E23' }}>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>3</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top', fontWeight: '600' }}>1. Introduction</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}><li>Executive Summary</li></ul>
                </td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}><li>Summary of prior board discussions & External feedback (inc Reg if available)</li></ul>
                </td>
              </tr>
              {/* Row 2 */}
              <tr style={{ borderBottom: '1px solid #F04E23' }}>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>4-5</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top', fontWeight: '600' }}>2. Asset Potential</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}>
                    <li>"Reasons to Believe" in the Asset's Potential</li>
                    <li>Project Interdependencies</li>
                  </ul>
                </td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}></td>
              </tr>
              {/* Row 3 */}
              <tr style={{ borderBottom: '1px solid #F04E23' }}>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>6-9</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top', fontWeight: '600' }}>3. Project Potential</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}>
                    <li style={{ marginBottom: '2px' }}>Value Creation Evolution: Key Changes vs Last Governance</li>
                    <li style={{ marginBottom: '2px' }}>CDP Options and Recommendation</li>
                    <li style={{ marginBottom: '2px' }}>Competitive Landscape and Advantage</li>
                    <li>List of Sensitivities</li>
                  </ul>
                </td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}></td>
              </tr>
              {/* Row 4 */}
              <tr style={{ borderBottom: '1px solid #F04E23' }}>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>10-18</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top', fontWeight: '600' }}>4. CDP to Deliver the Label and Evidence</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}>
                    <li style={{ marginBottom: '2px' }}>TPP / TPL / Reimbursement (US, EU, JP, CN)</li>
                    <li style={{ marginBottom: '2px' }}>Integrated Evidence Summary to deliver the TPL</li>
                    <li style={{ marginBottom: '2px' }}>CDP timelines, study design & comparison to competitors</li>
                    <li style={{ marginBottom: '2px' }}>PTRS</li>
                    <li>Risks & Mitigations</li>
                  </ul>
                </td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}>
                    <li style={{ marginBottom: '2px' }}>Governance Checklist</li>
                    <li style={{ marginBottom: '2px' }}>Key project assumptions</li>
                    <li>Quantitative Medicine / Vaccine Plan</li>
                  </ul>
                </td>
              </tr>
              {/* Row 5 */}
              <tr style={{ borderBottom: '2px solid #333' }}>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>19-20</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top', fontWeight: '600' }}>5. Investment Plan to Deliver the Label and Evidence</td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>
                  <ul style={{ margin: 0, paddingLeft: '12px' }}>
                    <li style={{ marginBottom: '2px' }}>High-level Investment Overview</li>
                    <li>Resourcing (FTEs) estimates shared with functional leads</li>
                  </ul>
                </td>
                <td style={{ padding: '6px 8px', verticalAlign: 'top' }}></td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.65rem', fontStyle: 'italic', color: '#666' }}>
            <p style={{ margin: '0 0 2px 0' }}>PTRS and cost estimates should be available for DRB</p>
            <p style={{ margin: 0 }}>Commercial forecasts and valuations should use last governed numbers (if quantitative), plus a qualitative assessment</p>
          </div>
          
          <div style={{ position: 'absolute', bottom: '0.75rem', right: '2rem', textAlign: 'right' }}>
            <div style={{ color: '#F04E23', fontSize: '1rem', fontWeight: 800, fontFamily: 'system-ui' }}>GSK</div>
            <div style={{ color: '#666', fontSize: '0.55rem' }}>CSI External Use</div>
          </div>
        </div>
      </div>
    ),
    // Slide 3: Executive Summary (Context, Proposal, Questions)
    (
      <div style={slideStyle} key="slide_executive_summary">
        {/* Top left CSI */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '1rem', fontSize: '0.65rem', color: '#666' }}>
          CSI External Use
        </div>

        {/* Container for main content */}
        <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '0.5rem' }}>
            <div style={{ 
              width: 0, height: 0, 
              borderTop: '8px solid transparent', 
              borderBottom: '8px solid transparent', 
              borderLeft: '12px solid #F04E23', 
              marginRight: '12px' 
            }}></div>
            <h2 style={{ margin: 0, color: '#F04E23', fontSize: '1.8rem', fontWeight: 300, fontFamily: 'system-ui, sans-serif' }}>
              Executive Summary: {data.projectName} {data.boardHeading} {new Date(data.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-')}
            </h2>
          </div>

          {/* Request to Governance section */}
          <div style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#F04E23', fontSize: '1.1rem', fontWeight: 400 }}>Request to Governance</h3>
            <div style={{ fontSize: '0.75rem', color: '#333', lineHeight: '1.4' }}>
              <div><strong>For DECISION:</strong> {data.consultationPoints.decision.length > 0 ? data.consultationPoints.decision.join(' / ') : 'Does DRB endorse the development plan design (options, PTRS and costs)?'}</div>
              <div><strong>For INPUT:</strong> {data.consultationPoints.input.length > 0 ? data.consultationPoints.input.join(' / ') : 'The team seeks Board input on... / The Board seeks team input on...'}</div>
            </div>
          </div>

          {/* Three Bands */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, paddingLeft: '1.5rem', paddingRight: '1rem' }}>
            
            {/* CONTEXT */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ background: '#F04E23', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>
                Context
              </div>
              <div style={{ border: '2px solid #F04E23', borderTop: 'none', padding: '0.5rem', fontSize: '0.75rem', color: '#333', flex: 1 }}>
                {data.executiveSummary.context.split('\n').map((p, i) => <p key={i} style={{ margin: '0 0 4px 0' }}>{p}</p>)}
              </div>
            </div>

            {/* TEAM PROPOSAL */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ background: '#F04E23', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>
                Team Proposal
              </div>
              <div style={{ border: '2px solid #F04E23', borderTop: 'none', padding: '0.5rem', fontSize: '0.75rem', color: '#333', flex: 1 }}>
                {data.executiveSummary.teamProposal.split('\n').map((p, i) => <p key={i} style={{ margin: '0 0 4px 0' }}>{p}</p>)}
              </div>
            </div>

            {/* KEY QUESTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ background: '#F04E23', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase' }}>
                Key Questions to be discussed
              </div>
              <div style={{ border: '2px solid #F04E23', borderTop: 'none', padding: '0.5rem', fontSize: '0.75rem', color: '#333', flex: 1 }}>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {data.executiveSummary.keyQuestions.split('\n').map((q, i) => {
                    const cleanQ = q.replace(/^•\s*/, '');
                    return cleanQ ? <li key={i} style={{ marginBottom: '4px', color: '#F04E23' }}><span style={{ color: '#333' }}>{cleanQ}</span></li> : null;
                  })}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Right Logo */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', textAlign: 'right' }}>
          <div style={{ color: '#F04E23', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>GSK</div>
          <div style={{ color: '#666', fontSize: '0.55rem', marginTop: '2px' }}>CSI External Use</div>
        </div>
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          3
        </div>
      </div>
    ),
    // Slide 4: Reasons to Believe
    (
      <div style={slideStyle} key="slide_reasons_to_believe">
        {/* Top left CSI */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '1rem', fontSize: '0.65rem', color: '#666' }}>
          CSI External Use
        </div>

        {/* Container for main content */}
        <div style={{ padding: '1rem 1.5rem 0.5rem', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
            <div style={{ 
              width: 0, height: 0, 
              borderTop: '8px solid transparent', 
              borderBottom: '8px solid transparent', 
              borderLeft: '12px solid #F04E23', 
              marginRight: '12px' 
            }}></div>
            <h2 style={{ margin: 0, color: '#F04E23', fontSize: '1rem', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
              REASONS TO BELIEVE IN THE ASSET'S POTENTIAL
            </h2>
          </div>

          <div style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: '0.1rem 0 0 0', color: '#333', fontSize: '0.85rem', fontWeight: 500 }}>{data.projectName} / {data.projectId}</h3>
          </div>

          {/* Grid Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1, paddingLeft: '1.5rem', paddingRight: '1rem', overflow: 'hidden' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden' }}>
              
              <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 700, fontSize: '0.65rem', color: '#111', marginBottom: '0.1rem' }}>UNMET NEED – KEY DISEASE(S)</div>
                <div style={{ background: '#F1F1F1', padding: '0.25rem 0.5rem', flex: 1, fontSize: '0.55rem', color: '#333', lineHeight: 1.2 }}>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {data.reasonsToBelieve.unmetNeed.split('\n').map((q, i) => {
                      const cleanQ = q.replace(/^•\s*/, '');
                      return cleanQ ? <li key={i} style={{ marginBottom: '2px' }}>{cleanQ}</li> : null;
                    })}
                  </ul>
                </div>
              </div>

              <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 700, fontSize: '0.65rem', color: '#111', marginBottom: '0.1rem' }}>MOA AND DIFFERENTIATION</div>
                <div style={{ background: '#F1F1F1', padding: '0.25rem 0.5rem', flex: 1, fontSize: '0.55rem', color: '#333', lineHeight: 1.2 }}>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {data.reasonsToBelieve.moa.split('\n').map((q, i) => {
                      const cleanQ = q.replace(/^•\s*/, '');
                      return cleanQ ? <li key={i} style={{ marginBottom: '2px' }}>{cleanQ}</li> : null;
                    })}
                  </ul>
                </div>
              </div>

              <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', height: '18%' }}>
                <fieldset style={{ border: '1.5px solid #F04E23', padding: '0.1rem 0.4rem', margin: 0, height: '100%', boxSizing: 'border-box' }}>
                  <legend style={{ color: '#111', fontWeight: 800, fontSize: '0.6rem', margin: '0 auto', padding: '0 0.5rem' }}>REASONS NOT TO BELIEVE</legend>
                  <div style={{ fontSize: '0.52rem', color: '#333', marginTop: '0', lineHeight: 1.05 }}>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      {data.reasonsToBelieve.reasonsNotToBelieve.split('\n').map((q, i) => {
                        const cleanQ = q.replace(/^•\s*/, '');
                        return cleanQ ? <li key={i} style={{ marginBottom: '2px', color: '#F04E23' }}><span style={{ color: '#333' }}>{cleanQ}</span></li> : null;
                      })}
                    </ul>
                  </div>
                </fieldset>
              </div>

            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', height: '100%', overflow: 'hidden' }}>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.62rem', color: '#111', marginBottom: '0.05rem' }}>KEY BIOLOGICAL / PRECLINICAL DATA</div>
                <div style={{ background: '#F1F1F1', padding: '0.2rem 0.4rem', flex: 1, fontSize: '0.52rem', color: '#333', lineHeight: 1.1 }}>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {data.reasonsToBelieve.preclinical.split('\n').map((q, i) => {
                      const cleanQ = q.replace(/^•\s*/, '');
                      return cleanQ ? <li key={i} style={{ marginBottom: '2px' }}>{cleanQ}</li> : null;
                    })}
                  </ul>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.62rem', color: '#111', marginBottom: '0.05rem' }}>KEY CLINICAL DATA</div>
                <div style={{ background: '#F1F1F1', padding: '0.2rem 0.4rem', flex: 1, fontSize: '0.52rem', color: '#333', lineHeight: 1.1 }}>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {data.reasonsToBelieve.clinical.split('\n').map((q, i) => {
                      const cleanQ = q.replace(/^•\s*/, '');
                      return cleanQ ? <li key={i} style={{ marginBottom: '2px' }}>{cleanQ}</li> : null;
                    })}
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Right Logo */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', textAlign: 'right' }}>
          <div style={{ color: '#F04E23', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>GSK</div>
          <div style={{ color: '#666', fontSize: '0.55rem', marginTop: '2px' }}>CSI External Use</div>
        </div>
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          4
        </div>
      </div>
    ),
    // Slide 5: Value Creation Evolution
    (
      <div style={slideStyle} key="slide_value_creation">
        {/* Top left CSI */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '1rem', fontSize: '0.65rem', color: '#666' }}>
          CSI External Use
        </div>

        {/* Container for main content */}
        <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: 0, height: 0, 
                  borderTop: '8px solid transparent', 
                  borderBottom: '8px solid transparent', 
                  borderLeft: '12px solid #F04E23', 
                  marginRight: '12px' 
                }}></div>
                <h2 style={{ margin: 0, color: '#F04E23', fontSize: '1.4rem', fontWeight: 300, fontFamily: 'system-ui, sans-serif' }}>
                  Value Creation Evolution
                </h2>
              </div>
              <div style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#111', fontSize: '1.1rem', fontWeight: 400 }}>Key changes vs last governance/forecast</h3>
              </div>
            </div>
            
            {/* Legend block */}
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.6rem', textAlign: 'center' }}>
              <div style={{ background: '#0284C7', color: 'white', padding: '0.2rem 0.5rem', fontStyle: 'italic', marginBottom: '2px' }}>
                Indicate directional impact in "current base case"
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.2rem 0', fontWeight: 'bold' }}>
                <div>Legend</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.55rem', fontWeight: 'normal' }}>
                  <span>n/a</span>
                  <span style={{ color: '#10B981', fontSize: '0.7rem' }}>⇑</span>
                  <span style={{ color: '#EF4444', fontSize: '0.7rem' }}>⇑</span>
                  <span style={{ fontSize: '0.7rem' }}>⇔</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.55rem', fontWeight: 'normal' }}>
                  <span>Unknown</span>
                  <span>Better</span>
                  <span>Worse</span>
                  <span>Similar</span>
                </div>
              </div>
              <div style={{ background: '#0284C7', color: 'white', padding: '0.4rem 0.5rem', marginTop: '2px', fontStyle: 'italic', textAlign: 'left' }}>
                Key contact: Decision Sciences / Finance Partner
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: '1.5rem', paddingRight: '1rem', paddingBottom: '1rem' }}>
            
            {/* Main Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', height: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  {/* Empty top left corner */}
                  <th style={{ width: '20%', border: 'none' }}></th>
                  <th style={{ width: '25%', background: '#F04E23', color: 'white', padding: '0.2rem', fontWeight: 500, fontSize: '0.75rem', border: '1px solid white' }}>Current Estimate</th>
                  <th style={{ width: '25%', background: '#555', color: 'white', padding: '0.2rem', fontWeight: 500, fontSize: '0.75rem', border: '1px solid white' }}>Last Governed (12-Oct-2023)</th>
                  <th style={{ width: '30%', background: '#555', color: 'white', padding: '0.2rem', fontWeight: 500, fontSize: '0.75rem', border: '1px solid white' }}>Comment</th>
                </tr>
              </thead>
              <tbody>
                {data.valueCreation.items.map((item) => (
                  <tr key={item.id}>
                    {/* Pink metric cell */}
                    <td style={{ background: '#FCE4D6', border: '1px solid #C55A11', padding: '0.1rem 0.4rem', textAlign: 'center', fontSize: '0.65rem', color: '#111' }}>
                      {item.metric}
                    </td>
                    {/* Current Estimate cell */}
                    <td style={{ border: '1px solid #7F7F7F', padding: '0.1rem 0.4rem', textAlign: 'center', background: 'white' }}>
                      {item.currentEstimate === 'green-up' ? <div style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: 800, lineHeight: 1 }}>⇑</div> :
                       item.currentEstimate === 'red-up' ? <div style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: 800, lineHeight: 1 }}>⇑</div> :
                       item.currentEstimate === 'similar' ? <div style={{ color: '#111', fontSize: '0.9rem', fontWeight: 800, lineHeight: 1 }}>⇔</div> :
                       <div style={{ color: '#333', fontSize: '0.65rem' }}>{item.currentEstimate}</div>}
                    </td>
                    {/* Last Governed cell */}
                    <td style={{ border: '1px solid #7F7F7F', padding: '0.1rem 0.4rem', textAlign: 'center', background: 'white', fontSize: '0.65rem' }}>
                      {item.lastGoverned}
                    </td>
                    {/* Comment cell */}
                    <td style={{ border: '1px solid #7F7F7F', padding: '0.1rem 0.4rem', background: 'white', fontSize: '0.6rem', verticalAlign: 'top' }}>
                      {item.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

        {/* Bottom Right Logo */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', textAlign: 'right' }}>
          <div style={{ color: '#F04E23', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>GSK</div>
          <div style={{ color: '#666', fontSize: '0.55rem', marginTop: '2px' }}>CSI External Use</div>
        </div>
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          5
        </div>
      </div>
    ),
    // Slide 6: Key Valuation Inputs & Milestones
    (
      <div 
        ref={containerRef}
        style={{ ...slideStyle, cursor: isAddingComment ? 'crosshair' : 'default' }} 
        key="slide_valuation_inputs"
        onClick={(e) => {
          if (!isAddingComment || !containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          updateData({ 
            slideComments: [
              ...data.slideComments, 
              { id: `sc${Date.now()}`, text: 'New comment...', x, y, width: 20, height: 15 }
            ] 
          });
          setIsAddingComment(false);
        }}
      >
        {/* Top left CSI */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '1rem', fontSize: '0.65rem', color: '#666' }}>
          CSI External Use
        </div>

        {/* Container for main content */}
        <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: 0, height: 0, 
              borderTop: '8px solid transparent', 
              borderBottom: '8px solid transparent', 
              borderLeft: '12px solid #F04E23', 
              marginRight: '12px' 
            }}></div>
            <h2 style={{ margin: 0, color: '#F04E23', fontSize: '1rem', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
              KEY EVALUATION INPUTS - {data.projectName}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingLeft: '1.5rem', paddingRight: '1rem' }}>
            
            {/* Top Grid: Indications and Valuation Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
              
              {/* Indications Table */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#F04E23', color: 'white', padding: '0.15rem 0.4rem', fontSize: '0.65rem', fontWeight: 700 }}>
                  INDICATIONS / TARGET MARKETS
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.6rem', border: '1px solid #F04E23' }}>
                  <thead>
                    <tr style={{ background: '#f1f1f1' }}>
                      <th style={{ padding: '4px', border: '1px solid #F04E23', textAlign: 'left' }}>Indication</th>
                      <th style={{ padding: '4px', border: '1px solid #F04E23', textAlign: 'left' }}>LoT</th>
                      <th style={{ padding: '4px', border: '1px solid #F04E23', textAlign: 'left' }}>Target Patient Pop</th>
                      <th style={{ padding: '4px', border: '1px solid #F04E23', textAlign: 'left' }}>Peak Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.valuationInputs.indications.map(ind => (
                      <tr key={ind.id}>
                        <td style={{ padding: '4px', border: '1px solid #F04E23' }}>{ind.indication}</td>
                        <td style={{ padding: '4px', border: '1px solid #F04E23' }}>{ind.lineOfTherapy}</td>
                        <td style={{ padding: '4px', border: '1px solid #F04E23' }}>{ind.targetPopulation}</td>
                        <td style={{ padding: '4px', border: '1px solid #F04E23' }}>{ind.peakShare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Valuation Summary Table */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#F04E23', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  Valuation metrics
                </div>
                <div style={{ border: '1px solid #F04E23', borderTop: 'none', padding: '0.5rem', flex: 1, background: 'white' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {Object.entries(data.valuationInputs.metrics).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '2px' }}>
                           <span style={{ fontWeight: 600, color: '#333', fontSize: '0.75rem' }}>{key}:</span>
                           <span style={{ color: '#F04E23', fontWeight: 700, fontSize: '0.75rem' }}>{val}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

            </div>

            {/* Middle Section: Milestones Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
               <div style={{ background: '#555', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  Key Project Milestones
               </div>
               <div style={{ border: '1px solid #555', borderTop: 'none', height: '120px', position: 'relative', background: '#f8fafc', padding: '1rem' }}>
                  {/* Years axis */}
                  <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 2rem' }}>
                     {[2023, 2024, 2025, 2026, 2027, 2028].map(y => (
                       <span key={y} style={{ fontSize: '0.65rem', color: '#999' }}>{y}</span>
                     ))}
                  </div>
                  <div style={{ position: 'absolute', bottom: '25px', left: '2rem', right: '2rem', height: '2px', background: '#ddd' }} />
                  
                  {/* Milestones */}
                  {data.milestones.slice(0, 10).map((m, i) => {
                    const leftPos = ((m.year - 2023) / 5) * 85 + 5; // simplified positioning logic
                    return (
                      <div key={m.id} style={{ position: 'absolute', left: `${leftPos}%`, top: i % 2 === 0 ? '20%' : '45%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ background: '#F04E23', width: '10px', height: '10px', transform: 'rotate(45deg)', marginBottom: '4px' }} />
                         <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#333' }}>{m.name}</span>
                         <span style={{ fontSize: '0.6rem', color: '#666' }}>Q{Math.ceil(m.position / 25)} {m.year}</span>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Interactive Comment Layer */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
             {data.slideComments.map(comment => (
               <div 
                 key={comment.id}
                 onClick={(e) => e.stopPropagation()}
                 onMouseDown={(e) => {
                   if (isAddingComment) return;
                   e.stopPropagation();
                   setActiveInteraction({
                     id: comment.id,
                     type: 'drag',
                     startX: e.clientX,
                     startY: e.clientY,
                     initialX: comment.x,
                     initialY: comment.y,
                     initialW: comment.width,
                     initialH: comment.height
                   });
                 }}
                 style={{ 
                   position: 'absolute', 
                   left: `${comment.x}%`, 
                   top: `${comment.y}%`, 
                   width: `${comment.width}%`,
                   height: `${comment.height}%`,
                   background: '#FEF08A', 
                   padding: '0.5rem', 
                   borderLeft: '4px solid #EAB308',
                   boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.2)',
                   pointerEvents: 'auto',
                   fontSize: '0.75rem',
                   color: '#854d0e',
                   borderRadius: '0 4px 4px 0',
                   fontFamily: 'cursive',
                   cursor: 'move',
                   display: 'flex',
                   flexDirection: 'column',
                   zIndex: activeInteraction?.id === comment.id ? 100 : 10
                 }}
               >
                 {/* Drag handle overlay */}
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5rem', cursor: 'move' }} />
                 
                 <textarea
                   value={comment.text}
                   onMouseDown={(e) => e.stopPropagation()} // Allow text selection
                   onChange={(e) => {
                     const newComments = data.slideComments.map(c => c.id === comment.id ? { ...c, text: e.target.value } : c);
                     updateData({ slideComments: newComments });
                   }}
                   style={{ 
                     background: 'transparent', 
                     border: 'none', 
                     width: '100%', 
                     height: '100%',
                     resize: 'none', 
                     outline: 'none',
                     color: 'inherit',
                     fontFamily: 'inherit',
                     fontSize: 'inherit'
                   }}
                 />

                 {/* Resize Handle */}
                 <div 
                   onMouseDown={(e) => {
                     e.stopPropagation();
                     e.preventDefault();
                     setActiveInteraction({
                       id: comment.id,
                       type: 'resize',
                       startX: e.clientX,
                       startY: e.clientY,
                       initialX: comment.x,
                       initialY: comment.y,
                       initialW: comment.width,
                       initialH: comment.height
                     });
                   }}
                   style={{ 
                     position: 'absolute', bottom: '0', right: '0', 
                     width: '12px', height: '12px', 
                     cursor: 'se-resize',
                     background: 'linear-gradient(135deg, transparent 50%, #EAB308 50%)',
                     borderRadius: '0 0 4px 0'
                   }} 
                 />

                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     updateData({ slideComments: data.slideComments.filter(c => c.id !== comment.id) });
                   }}
                   onMouseDown={(e) => e.stopPropagation()}
                   style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', zIndex: 110 }}
                 >✕</button>
               </div>
             ))}
            </div>

          </div>
        </div>

        {/* Bottom Right Logo */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', textAlign: 'right', pointerEvents: 'none' }}>
          <div style={{ color: '#F04E23', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>GSK</div>
          <div style={{ color: '#666', fontSize: '0.55rem', marginTop: '2px' }}>CSI External Use</div>
        </div>
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666', pointerEvents: 'none' }}>
          6
        </div>
      </div>
    ),
    // Slide 6A: Timeline - Lifecycle Innovation
    (
      <div style={{ ...slideStyle, overflow: 'auto', background: '#fafafa' }} key="slide_6a_timeline_1">
         <div style={{ padding: '1.5rem' }}>
           <h2 style={{ color: '#F04E23', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>CDP Timeline - Lifecycle Innovation</h2>
           <Template1 data={data} years={timelineYears} />
         </div>
      </div>
    ),
    // Slide 6B: Timeline - Plan with Financials
    (
      <div style={{ ...slideStyle, overflow: 'auto', background: '#fafafa' }} key="slide_6b_timeline_2">
         <div style={{ padding: '1.5rem' }}>
           <h2 style={{ color: '#F04E23', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>CDP Timeline - Plan with Financials</h2>
           <Template2 data={data} years={timelineYears} />
         </div>
      </div>
    ),
    // Slide 6C: Timeline - Scenario Plans
    (
      <div style={{ ...slideStyle, overflow: 'auto', background: '#fafafa' }} key="slide_6c_timeline_3">
         <div style={{ padding: '1.5rem' }}>
           <h2 style={{ color: '#F04E23', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>CDP Timeline - Scenario Plans</h2>
           <Template3 data={data} years={timelineYears} />
         </div>
      </div>
    ),
    // Slide 7: High-level Investment Overview (Integrated Professional View)
    (
      <div style={{ ...slideStyle, padding: '0.5rem 1rem' }} key="slide_hio_pro">
        <div style={{ transform: 'scale(0.92)', transformOrigin: 'top center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* PPT Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid #F04E23' }} />
               <h1 style={{ margin: 0, color: '#F04E23', fontSize: '1.2rem', fontWeight: 600, fontFamily: 'system-ui' }}>High-level Investment Overview</h1>
            </div>
          </div>
          <div style={{ background: '#0284C7', color: 'white', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 500 }}>
            Key contact: Project manager / Finance
          </div>
        </div>

        {/* The Big HIO Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(100px, 1fr) repeat(10, 1fr) 0.6fr 0.6fr 0.6fr', 
          fontSize: '0.55rem', 
          border: '1px solid #999', 
          background: 'white',
          position: 'relative',
          marginTop: '5px'
        }}>
           {/* Vertical "Today" Marker Line - spans whole grid height */}
           {(() => {
             return null; 
           })()}
           
           {/* Grid Headers */}
           <div style={{ borderRight: '1px solid #999', padding: '4px', fontWeight: 700, background: '#f8fafc' }}>SWIMLANE</div>
           {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => (
             <div key={year} style={{ borderRight: '1px solid #999', padding: '4px', textAlign: 'center', fontWeight: 700, background: '#f8fafc', position: 'relative' }}>
                {year}
                {year === 2026 && (
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.45rem', fontWeight: 700, color: '#333' }}>Today</span>
                     <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid #333' }} />
                     <div style={{ width: '2px', background: '#000', position: 'absolute', top: '16px', height: 'calc(100% + 15px)', zIndex: 20, pointerEvents: 'none' }} />
                  </div>
                )}
             </div>
           ))}
           <div style={{ borderRight: '1px solid #999', padding: '4px', textAlign: 'center', fontWeight: 700, background: '#f8fafc' }}>EPE</div>
           <div style={{ borderRight: '1px solid #999', padding: '4px', textAlign: 'center', fontWeight: 700, background: '#f8fafc' }}>IPE</div>
           <div style={{ padding: '4px', textAlign: 'center', fontWeight: 700, background: '#f8fafc' }}>Cum PTRS</div>

           {/* Swimlane Rows */}
           {data.swimlanes.map((lane, idx) => (
             <React.Fragment key={lane}>
                <div style={{ borderTop: '1px solid #999', borderRight: '1px solid #999', padding: '4px 8px', fontWeight: 600, background: '#f1f5f9' }}>{lane}</div>
                {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => {
                  const ms = data.milestones.filter(m => m.swimlane === lane && m.year === year && m.isSelected);
                  const hasBar = data.milestones.some(m => m.swimlane === lane && m.year === year);
                  return (
                    <div key={year} style={{ borderTop: '1px solid #999', borderRight: '1px solid #999', position: 'relative', minHeight: '12px' }}>
                        {year === 2026 && (
                          <div style={{ width: '2px', background: '#000', position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }} />
                        )}
                       {hasBar && <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', background: '#F04E23', transform: 'translateY(-50%)', opacity: 1 }} />}
                       {ms.map(m => (
                         <div key={m.id} style={{ position: 'absolute', left: `${m.position}%`, top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 6 }}>
                            <span style={{ color: '#000', fontSize: '8px' }}>▲</span>
                            <span style={{ fontSize: '6px', whiteSpace: 'nowrap', fontWeight: 700, background: 'rgba(255,255,255,0.8)', padding: '0 2px' }}>{m.name}</span>
                         </div>
                       ))}
                    </div>
                  );
                })}
                <div style={{ borderTop: '1px solid #999', borderRight: '1px solid #999', padding: '4px', textAlign: 'center' }}>£{idx*2+1}m</div>
                <div style={{ borderTop: '1px solid #999', borderRight: '1px solid #999', padding: '4px', textAlign: 'center' }}>£{idx}m</div>
                <div style={{ borderTop: '1px solid #999', padding: '4px', textAlign: 'center' }}>{15 + idx*15}%</div>
             </React.Fragment>
           ))}

           {/* Financial Table Rows */}
           {data.financials.map(fin => (
             <React.Fragment key={fin.label}>
                <div style={{ borderTop: '2px solid #333', borderRight: '1px solid #999', padding: '2px 6px', fontWeight: 700, textAlign: 'right', background: '#f8fafc' }}>{fin.label}</div>
                {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => {
                  const val = fin.data[year] || '';
                  const color = val.includes('+') ? '#10b981' : val.includes('-') ? '#ef4444' : '#333';
                  return (
                    <div key={year} style={{ borderTop: '2px solid #333', borderRight: '1px solid #999', padding: '4px', textAlign: 'center', color, fontWeight: color !== '#333' ? 700 : 400 }}>{val}</div>
                  );
                })}
                <div style={{ borderTop: '2px solid #333', borderRight: '1px solid #999', padding: '4px', textAlign: 'center', fontWeight: 700 }}>{fin.summaryEPE}</div>
                <div style={{ borderTop: '2px solid #333', borderRight: '1px solid #999', padding: '4px', textAlign: 'center', fontWeight: 700 }}>{fin.summaryIPE}</div>
                <div style={{ borderTop: '2px solid #333', padding: '4px', textAlign: 'center' }}></div>
             </React.Fragment>
           ))}
        </div>

        {/* Variance Commentary Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#F04E23', color: 'white', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 700 }}>Actuals</div>
            <div style={{ border: '1px solid #999', borderTop: 'none', background: '#f1f5f9', padding: '4px', fontSize: '0.55rem', color: '#475569', minHeight: '35px', borderRadius: '0 0 4px 4px', lineHeight: 1.1 }}>
              {data.hioCommentary.actuals}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#eee', color: '#000', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 700, border: '1px solid #999' }}>Budget</div>
            <div style={{ border: '1px solid #999', borderTop: 'none', background: '#f1f5f9', padding: '4px', fontSize: '0.55rem', color: '#475569', minHeight: '35px', borderRadius: '0 0 4px 4px', lineHeight: 1.1 }}>
              {data.hioCommentary.budget}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div style={{ color: '#666', fontSize: '0.5rem', fontStyle: 'italic', maxWidth: '300px', textAlign: 'right' }}>
             * Includes Payment milestones. Shows latest governed amount for past years
           </div>
           <div style={{ color: '#F04E23', fontSize: '1.2rem', fontWeight: 800 }}>GSK</div>
        </div>
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          7
        </div>
        </div>
      </div>
    ),
    // Slide 4: Resourcing Estimates
    (
      <div style={slideStyle} key="slide4">
        {/* Professional PPT Header */}
        <div style={{ ...headerStyle, borderBottom: 'none', padding: '1.5rem 2rem 0.5rem' }}>
          <h2 style={{ margin: 0, color: '#0F172A', fontSize: '1.8rem', fontWeight: 600 }}>
            {data.projectId}: Resourcing estimates shared with Functional Leads
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>Validated from RM System</span>
        </div>
        
        {/* GSK Accent Line */}
        <div style={{ height: '4px', width: '60px', background: '#F04E23', margin: '0 2rem 1.5rem' }}></div>

        <div style={{ ...contentStyle, padding: '0 2rem 2rem' }}>
          <div style={{ flex: 1, background: 'white', border: '1px solid #999', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
             
             <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                   <tr style={{ background: 'linear-gradient(90deg, #F04E23 0%, #EA580C 100%)', color: 'white', fontSize: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                      <th rowSpan={2} style={{ textAlign: 'left', padding: '4px', border: '1px solid rgba(255,255,255,0.2)', width: '15%' }}>R&D FUNCTION</th>
                      <th colSpan={4} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)' }}>CY FTE</th>
                      <th rowSpan={2} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)' }}>CY IPE</th>
                      <th colSpan={2} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)' }}>2027</th>
                      <th colSpan={2} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)' }}>2028</th>
                      <th colSpan={2} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)' }}>2029</th>
                      <th colSpan={3} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)' }}>PROJECT TOTAL</th>
                      <th colSpan={2} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)', background: '#F1F5F9', color: '#475569' }}>PRIOR APPROVAL</th>
                      <th rowSpan={2} style={{ textAlign: 'center', padding: '2px', border: '1px solid rgba(255,255,255,0.2)', background: '#334155' }}>SIGN OFF</th>
                   </tr>
                   <tr style={{ background: 'linear-gradient(90deg, #F04E23 0%, #EA580C 100%)', color: 'white', fontSize: '5.5px' }}>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>1Q</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>2Q</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>3Q</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>4Q</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>FTE</th><th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>IPE</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>FTE</th><th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>IPE</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>FTE</th><th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>IPE</th>
                      <th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>ALGO</th><th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>HEAD</th><th style={{ border: '1px solid rgba(255,255,255,0.2)' }}>IPE</th>
                      <th style={{ border: '1px solid #ccc', background: '#F1F5F9', color: '#475569' }}>FTE</th><th style={{ border: '1px solid #ccc', background: '#F1F5F9', color: '#475569' }}>IPE</th>
                   </tr>
                </thead>
                <tbody>
                   {data.resourcingData.flatMap(cat => [
                      // Category Row
                      <tr key={cat.id} style={{ background: '#f8fafc', height: '14px' }}>
                         <td style={{ paddingLeft: '4px', border: '1px solid #e2e8f0', color: '#F04E23', fontWeight: 800, fontSize: '7px' }}>{cat.name}</td>
                         {[...Array(17)].map((_, i) => <td key={i} style={{ border: '1px solid #e2e8f0' }}></td>)}
                      </tr>,
                      // Child Rows
                      ...(cat.children || []).map(child => (
                         <tr key={child.id} style={{ height: '12px' }}>
                            <td style={{ paddingLeft: '12px', border: '1px solid #e2e8f0', color: '#64748B', fontSize: '6px', position: 'relative' }}>
                               <span style={{ position: 'absolute', left: '4px' }}>└</span> {child.name}
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.cyFTE?.[0]}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.cyFTE?.[1]}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.cyFTE?.[2]}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.cyFTE?.[3]}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.cyIPE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.y1FTE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.y1IPE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.y2FTE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.y2IPE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.y3FTE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px' }}>{child.y3IPE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px', background: '#fef3c7' }}>{child.projAlgoFTE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px', background: '#fef3c7' }}>{child.projFnHeadFTE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px', background: '#fef3c7' }}>{child.projIPE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px', background: '#f1f5f9' }}>{child.priorFTE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px', background: '#f1f5f9' }}>{child.priorIPE}</td>
                            <td style={{ textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '5.5px', color: '#10B981', fontWeight: 700 }}>{child.signOff === 'Approved' ? '✓' : ''}</td>
                         </tr>
                      ))
                   ])}
                </tbody>
             </table>
             
             <div style={{ marginTop: 'auto', padding: '0.5rem 1rem', background: '#f1f5f9', fontSize: '7px', color: '#64748b', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>* FTE estimates are subject to functional lead approval during the Q3 planning cycle.</span>
                <span style={{ fontWeight: 600 }}>Source: Data output from RM as of {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-').toUpperCase()}</span>
             </div>
          </div>
        </div>
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          8
        </div>
      </div>
    ),
    // Slide 9/16: Important Risks and Mitigation Strategies
    (
      <div style={slideStyle} key="slide6">
        {/* Top left CSI and Triangle */}
        <div style={{ position: 'absolute', top: '1rem', left: '0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748B', marginLeft: '1.5rem', marginBottom: '0.2rem' }}>
            CSI External Use
          </div>
          <div style={{ 
            width: 0, height: 0, 
            borderTop: '10px solid transparent', 
            borderBottom: '10px solid transparent', 
            borderLeft: '15px solid #F04E23'
          }}></div>
        </div>

        {/* Top Right Blue Box */}
        <div style={{ position: 'absolute', top: '0', right: '0', background: '#0284C7', color: 'white', padding: '0.5rem 1rem', fontSize: '0.65rem', textAlign: 'right', fontStyle: 'italic' }}>
          <div>Pull directly from Project Risk Tool</div>
          <div>Key contact: Project Manager</div>
        </div>

        {/* Container for main content */}
        <div style={{ padding: '2.5rem 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#F04E23', fontSize: '1.8rem', fontWeight: 300, fontFamily: 'system-ui, sans-serif' }}>
            Important Risks and Mitigation Strategies
          </h2>
          <p style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1.1rem', fontWeight: 300 }}>
            Include up to 5 top risks, their impacts, and strategies to address each
          </p>
          
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', border: '1px solid #F04E23', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: '20%', borderRight: '1px solid #e2e8f0' }}></th>
                  {data.riskComparators.map((col) => (
                    <th key={col.id} style={{ width: '16%', background: '#C53030', color: 'white', borderRight: '1px solid #e2e8f0', padding: '0.25rem', fontWeight: 600, fontSize: '0.8rem' }}>
                      {col.assetName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { field: 'studyBrand', label: 'Study Brand' },
                  { field: 'population', label: 'Population' },
                  { field: 'enrolment', label: 'Enrolment' },
                  { field: 'randomisation', label: 'Randomisation' },
                  { field: 'treatmentDuration', label: 'Treatment duration' },
                  { field: 'endpoint', label: 'Endpoint' },
                  { field: 'otherComparators', label: '<<Other key comparators>>' }
                ].map((row) => (
                  <tr key={row.field}>
                    <td style={{ padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 500, color: '#000', verticalAlign: 'top' }}>
                      {row.label}
                    </td>
                    {data.riskComparators.map((col) => (
                      <td key={col.id} style={{ padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#333', verticalAlign: 'top' }}>
                        {col[row.field as keyof typeof col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>


          </div>
        </div>

        {/* Bottom Right Logo */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', textAlign: 'right' }}>
          <div style={{ color: '#F04E23', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>GSK</div>
          <div style={{ color: '#666', fontSize: '0.55rem', marginTop: '2px' }}>CSI External Use</div>
        </div>
        
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          16
        </div>
      </div>
    ),
    // Slide 10: IES Template - Executive Summary
    (
      <div style={slideStyle} key="slide_ies">
        
        {/* Header Section */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: 0, height: 0, 
                borderTop: '12px solid transparent', 
                borderBottom: '12px solid transparent', 
                borderLeft: '18px solid #F04E23', 
                marginRight: '8px' 
              }}></div>
              <h2 style={{ margin: 0, color: '#F04E23', fontSize: '1.8rem', fontWeight: 300, fontFamily: 'system-ui, sans-serif' }}>
                IES Template - Executive Summary
              </h2>
            </div>
            <h3 style={{ margin: '0.2rem 0 0 1.6rem', color: '#111', fontSize: '1.4rem', fontWeight: 400 }}>
              Key unmet needs & claims overview
            </h3>
          </div>

          {/* Top Right Diagram */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', fontWeight: 600 }}>
            <div style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', color: '#333' }}>TPP</div>
            <div style={{ color: '#F04E23' }}>→</div>
            <div style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', color: '#333' }}>IES</div>
            <div style={{ color: '#F04E23' }}>↔</div>
            <div style={{ background: '#FCE4D6', border: '1px solid #F04E23', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ background: 'white', padding: '0.2rem 0.4rem', textAlign: 'center' }}>Clinical development plan</div>
              <div style={{ background: 'white', padding: '0.2rem 0.4rem', textAlign: 'center' }}>Global Epi plan</div>
              <div style={{ background: 'white', padding: '0.2rem 0.4rem', textAlign: 'center' }}>Data generation plan</div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div style={{ padding: '6rem 1rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          
          {/* Top Table */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
            <table style={{ flex: 1, borderCollapse: 'collapse', fontSize: '0.75rem', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ background: '#004B9B', color: 'white', padding: '0.3rem', textAlign: 'left', border: '1px solid white', width: '30%' }}>Indication</th>
                  <th style={{ background: '#004B9B', color: 'white', padding: '0.3rem', textAlign: 'left', border: '1px solid white' }}>TPP alignment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ background: '#E6E6FA', padding: '0.3rem', border: '1px solid white' }}>{data.iesData.indication}</td>
                  <td style={{ background: '#E6E6FA', padding: '0.3rem', border: '1px solid white' }}>{data.iesData.tppAlignment}</td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ background: '#FCE4D6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem', fontSize: '0.85rem' }}>
              <span>PALT alignment date: <span style={{ background: '#FEF08A', fontWeight: 600 }}>{data.iesData.paltDate}</span></span>
            </div>
          </div>

          {/* Main Table */}
          <div style={{ flex: 1, position: 'relative' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ background: '#004B9B', color: 'white' }}>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left', width: '25%' }}>Strategic Pillars</th>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left' }}>Which TPP (or SSOs) aspect will the evidence support</th>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left' }}>Main stakeholder (who will use the evidence)</th>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left' }}>Type of evidence (CT, Observational...)</th>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left', width: '60px' }}>Priority (H,M, L)</th>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left' }}>Function generating the evidence</th>
                  <th style={{ padding: '0.4rem', border: '1px solid white', textAlign: 'left' }}>When is it needed to be most effective</th>
                </tr>
              </thead>
              <tbody>
                {data.iesData.rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ background: '#B4B4D5', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top', color: '#111', fontWeight: 500 }}>{row.pillar}</td>
                    <td style={{ background: '#E6E6FA', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top' }}>{row.tppAspect}</td>
                    <td style={{ background: '#E6E6FA', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top' }}>{row.stakeholder}</td>
                    <td style={{ background: '#E6E6FA', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top' }}>{row.evidenceType}</td>
                    <td style={{ background: '#E6E6FA', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top', textAlign: 'center' }}>{row.priority}</td>
                    <td style={{ background: '#E6E6FA', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top' }}>{row.functionGenerating}</td>
                    <td style={{ background: '#E6E6FA', padding: '0.4rem', border: '1px solid white', verticalAlign: 'top' }}>{row.whenNeeded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Rotated text */}
            <div style={{ position: 'absolute', left: '-1rem', top: '2rem', height: 'calc(100% - 2rem)', width: '1rem', background: '#FEF08A', border: '1px solid white', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontSize: '0.5rem', fontWeight: 600, padding: '0.5rem 0' }}>
              Example (illustrative) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Description
            </div>
          </div>
        </div>

        {/* Bottom Right Logo */}
        <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', textAlign: 'right' }}>
          <div style={{ color: '#F04E23', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'system-ui', lineHeight: 1 }}>GSK</div>
          <div style={{ color: '#666', fontSize: '0.55rem', marginTop: '2px' }}>CSI External Use</div>
        </div>
        
        {/* Page Number */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', fontSize: '0.65rem', color: '#666' }}>
          13
        </div>
      </div>
    )
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ 
        background: '#1e293b', 
        padding: '3rem', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid #334155',
        boxShadow: 'var(--shadow-lg), inset 0 2px 10px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Subtle Projector Glow */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
          {slides[currentSlideIndex]}
        </div>

        {/* Presenter Footer Simulation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.75rem', gap: '2rem' }}>
          <span>⌨ Use Arrows to Navigate</span>
          <span>Project: {data.projectId}</span>
          <span>{currentSlideIndex + 1} / {slides.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          className="btn btn-secondary" 
          disabled={currentSlideIndex === 0} 
          onClick={() => setCurrentSlideIndex(c => c - 1)}
        >
          Previous Slide
        </button>

        {currentSlideIndex === 5 && (
          <button 
            className={`btn ${isAddingComment ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => setIsAddingComment(!isAddingComment)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isAddingComment ? <span>✕ Cancel Placement</span> : <span>➕ Add Sticky Note</span>}
          </button>
        )}

        <button 
          className="btn btn-secondary" 
          disabled={currentSlideIndex === slides.length - 1} 
          onClick={() => setCurrentSlideIndex(c => c + 1)}
        >
          Next Slide
        </button>
      </div>
    </div>
  );
};

export default Step5Preview;
