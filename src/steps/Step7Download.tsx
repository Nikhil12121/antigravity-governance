import { useState } from 'react';
import { useDeck } from '../context/DeckContext';

const Step6Download = () => {
  const { data, setCurrentStep } = useDeck();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Helper to ensure every table cell is a valid object with a text string
  const safeCell = (text: any, options: any = {}) => ({
    text: text === undefined || text === null ? '' : String(text),
    options: options || {}
  });

  // Helper for Slide Headers (mirrors the Triangle + Orange Text style)
  const addSlideHeader = (slide: any, title: string, subtitle?: string) => {
    // Triangle
    slide.addShape('triangle', {
      x: 0.5, y: 0.5, w: 0.15, h: 0.2,
      fill: { color: 'F04E23' },
      rotate: 90
    });
    // Title
    slide.addText(title || '', {
      x: 0.7, y: 0.45, w: 8, h: 0.4,
      fontSize: 22,
      color: 'F04E23',
      bold: true,
      fontFace: 'Arial'
    });
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.7, y: 0.85, w: 9, h: 0.3,
        fontSize: 14,
        color: '64748B'
      });
    }
    // Logo footer
    slide.addText('GSK', {
      x: 8.8, y: 5.1, w: 1, h: 0.4,
      fontSize: 24,
      bold: true,
      color: 'F04E23',
      align: 'right'
    });
    slide.addText('CSI External Use', {
      x: 8.8, y: 5.4, w: 1, h: 0.2,
      fontSize: 8,
      color: '64748B',
      align: 'right'
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // @ts-ignore
      const PptxGen = window.PptxGenJS || window.pptxgen;
      if (!PptxGen) {
        throw new Error('PowerPoint Engine (PptxGenJS) not found. Please refresh the page and ensure you have an internet connection.');
      }
      
      // @ts-ignore
      let pptx = new PptxGen();
      pptx.layout = 'LAYOUT_16x9';

      // ==========================================
      // SLIDE 1: COVER
      // ==========================================
      let slide1 = pptx.addSlide();
      slide1.background = { color: 'F04E23' };
      slide1.addText(data.boardHeading || 'Governance Deck', { 
        x: 0.5, y: 2.2, w: 9, h: 1,
        fontSize: 44, color: 'FFFFFF', bold: true, align: 'center' 
      });
      slide1.addText(data.projectName || '', { 
        x: 0.5, y: 3.2, w: 9, h: 0.5,
        fontSize: 22, color: 'FFFFFF', align: 'center' 
      });
      slide1.addText(`Prepared for: ${data.owner || 'GSK Board'} | ${new Date(data.date).toLocaleDateString()}`, { 
        x: 0.5, y: 5, w: 9, h: 0.4,
        fontSize: 14, color: 'FFFFFF', opacity: 0.8, align: 'center' 
      });
      slide1.addShape('rect', { x: 8.5, y: 0.2, w: 1, h: 0.6, fill: { color: 'FFFFFF' } });
      slide1.addText('GSK', { x: 8.5, y: 0.2, w: 1, h: 0.6, fontSize: 24, bold: true, color: 'F04E23', align: 'center' });

      // ==========================================
      // SLIDE 2: STRUCTURE
      // ==========================================
      let slide2 = pptx.addSlide();
      addSlideHeader(slide2, 'DRB Governance Material Structure');
      const sHeadOpt = { fill: { color: 'F04E23' }, color: 'FFFFFF', bold: true };
      const structureRows = [
        [safeCell('Slides', sHeadOpt), safeCell('Section', sHeadOpt), safeCell('Core Slides', sHeadOpt)],
        [safeCell('3'), safeCell('1. Introduction'), safeCell('Executive Summary')],
        [safeCell('4-5'), safeCell('2. Asset Potential'), safeCell('Reasons to Believe / Interdependencies')],
        [safeCell('6-9'), safeCell('3. Project Potential'), safeCell('Value Creation / CDP Options / Sensitivities')],
        [safeCell('10-18'), safeCell('4. Delivering Label'), safeCell('TPP / Integrated Evidence / Risks')],
        [safeCell('19-20'), safeCell('5. Investment Plan'), safeCell('Investment Overview (HIO) / Resourcing')]
      ];
      slide2.addTable(structureRows, { x: 0.5, y: 1.2, w: 9, rowH: 0.5, fontSize: 11, border: { pt: 1, color: 'F04E23' } });

      // ==========================================
      // SLIDE 3: EXECUTIVE SUMMARY
      // ==========================================
      let slide3 = pptx.addSlide();
      addSlideHeader(slide3, `Executive Summary: ${data.projectId || ''}`);
      const bandOpt = { fill: { color: 'F04E23' }, color: 'FFFFFF', bold: true, fontSize: 12 };
      const boxOpt = { fontSize: 10, color: '333333', border: { pt: 1, color: 'F04E23' }, align: 'left', valign: 'top' };
      
      slide3.addText('CONTEXT', { x: 0.5, y: 1.2, w: 9, h: 0.3, ...bandOpt });
      slide3.addText(data.executiveSummary?.context || '', { x: 0.5, y: 1.5, w: 9, h: 1, ...boxOpt });
      
      slide3.addText('TEAM PROPOSAL', { x: 0.5, y: 2.7, w: 9, h: 0.3, ...bandOpt });
      slide3.addText(data.executiveSummary?.teamProposal || '', { x: 0.5, y: 3.0, w: 9, h: 1, ...boxOpt });
      
      slide3.addText('KEY QUESTIONS', { x: 0.5, y: 4.2, w: 9, h: 0.3, ...bandOpt });
      slide3.addText(data.executiveSummary?.keyQuestions || '', { x: 0.5, y: 4.5, w: 9, h: 0.7, ...boxOpt });

      // ==========================================
      // SLIDE 4: REASONS TO BELIEVE
      // ==========================================
      let slide4 = pptx.addSlide();
      addSlideHeader(slide4, "REASONS TO BELIEVE IN THE ASSET'S POTENTIAL");
      
      const rtbSections = [
        { title: 'UNMET NEED', text: data.reasonsToBelieve?.unmetNeed, x: 0.5, y: 1.2 },
        { title: 'MOA AND DIFFERENTIATION', text: data.reasonsToBelieve?.moa, x: 0.5, y: 2.5 },
        { title: 'BIOLOGICAL / PRECLINICAL DATA', text: data.reasonsToBelieve?.preclinical, x: 5.1, y: 1.2 },
        { title: 'KEY CLINICAL DATA', text: data.reasonsToBelieve?.clinical, x: 5.1, y: 3.5 }
      ];

      rtbSections.forEach(sec => {
        slide4.addText(sec.title || '', { x: sec.x, y: sec.y, w: 4.4, h: 0.25, fontSize: 10, bold: true, color: '111111' });
        slide4.addText(sec.text || '', { x: sec.x, y: sec.y + 0.3, w: 4.4, h: 1, fontSize: 9, color: '333333', fill: { color: 'F1F1F1' } });
      });

      slide4.addText('REASONS NOT TO BELIEVE', { x: 0.5, y: 4.2, w: 4.4, h: 1, fontSize: 9, color: '333333', border: { pt: 2, color: 'F04E23' }, align: 'left', valign: 'top' });
      slide4.addText(data.reasonsToBelieve?.reasonsNotToBelieve || '', { x: 0.6, y: 4.5, w: 4.2, h: 0.6, fontSize: 8, color: '555555' });

      // ==========================================
      // SLIDE 5: VALUE CREATION
      // ==========================================
      let slide5 = pptx.addSlide();
      addSlideHeader(slide5, 'Value Creation Evolution');
      
      const vH1 = { fill: { color: 'FCE4D6' }, color: '111111', bold: true };
      const vH2 = { fill: { color: 'F04E23' }, color: 'FFFFFF', bold: true };
      const vH3 = { fill: { color: '555555' }, color: 'FFFFFF', bold: true };

      const valHeader = [
        safeCell('Metric', vH1), safeCell('Current Estimate', vH2), safeCell('Last Governed', vH3), safeCell('Comment', vH3)
      ];

      const valRows = (data.valueCreation?.items || []).map(item => [
        safeCell(item.metric, { fill: { color: 'FCE4D6' } }),
        safeCell(item.currentEstimate, { align: 'center' }),
        safeCell(item.lastGoverned, { align: 'center' }),
        safeCell(item.comment, { fontSize: 8 })
      ]);

      slide5.addTable([valHeader, ...valRows], { x: 0.5, y: 1.5, w: 9, rowH: 0.3, fontSize: 10, border: { pt: 0.5, color: '999999' } });

      const tlYears = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];
      const startX = 1.0;
      const endX = 9.5;
      const tWidth = endX - startX;

      // ==========================================
      // SLIDE 6A: TIMELINE - LIFECYCLE INNOVATION
      // ==========================================
      let slide6a = pptx.addSlide();
      addSlideHeader(slide6a, 'CDP Timeline', 'Lifecycle Innovation');
      
      tlYears.forEach((y, i) => {
         const xPos = startX + (i / tlYears.length) * tWidth;
         slide6a.addText(y.toString(), { x: xPos, y: 1.2, w: tWidth / tlYears.length, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });
      });

      let currentY = 1.6;
      (data.lifecycleGroups || []).forEach(group => {
         const groupBars = group.swimlanes.map(lane => data.lifecycleBars?.find(b => b.swimlane === lane)).filter(Boolean);
         if (groupBars.length === 0) return;
         
         const rowHeight = Math.max(0.8, groupBars.length * 0.4 + 0.2);
         
         slide6a.addText(group.groupName || '', { x: 0.2, y: currentY, w: 0.8, h: rowHeight, fontSize: 8, bold: true, align: 'center', border: { pt: 1, color: 'CCCCCC' } });
         
         tlYears.forEach((_, i) => {
            const xPos = startX + (i / tlYears.length) * tWidth;
            slide6a.addShape('rect', { x: xPos, y: currentY, w: tWidth / tlYears.length, h: rowHeight, fill: { color: 'FFFFFF' }, line: { color: 'EEEEEE', width: 1 } });
         });

         groupBars.forEach((bar, idx) => {
             if(!bar) return;
             const laneMils = data.lifecycleMilestones?.filter(m => m.swimlane === bar.swimlane) || [];
             const bTop = currentY + 0.1 + (idx * 0.4);
             
             const leftPct = Math.max(0, (bar.startYear - tlYears[0]) / tlYears.length);
             const widthPct = Math.max(0.05, (bar.endYear - bar.startYear) / tlYears.length);
             
             let bColor = '3B82F6';
             if (bar.colorClass?.includes('green')) bColor = '10B981';
             else if (bar.colorClass?.includes('red')) bColor = 'EF4444';

             slide6a.addShape('rect', { x: startX + (leftPct * tWidth), y: bTop, w: widthPct * tWidth, h: 0.25, fill: { color: bColor }, line: { color: bColor, width: 1 } });
             slide6a.addText(bar.name, { x: startX + (leftPct * tWidth), y: bTop, w: widthPct * tWidth, h: 0.25, fontSize: 8, color: 'FFFFFF', align: 'center', bold: true });

             laneMils.forEach(m => {
                 const yIdx = tlYears.indexOf(m.year);
                 if(yIdx === -1) return;
                 const mLeftPct = (yIdx / tlYears.length) + (m.position / 100) * (1 / tlYears.length);
                 const mx = startX + (mLeftPct * tWidth);
                 
                 slide6a.addShape('diamond', { x: mx - 0.05, y: bTop - 0.05, w: 0.1, h: 0.1, fill: { color: 'F04E23' } });
                 slide6a.addText(m.name, { x: mx - 0.3, y: bTop - 0.25, w: 0.6, h: 0.2, fontSize: 6, align: 'center', color: '111111' });
             });
         });
         
         currentY += rowHeight;
      });

      // ==========================================
      // SLIDE 6B: TIMELINE - PLAN W/ FINANCIALS
      // ==========================================
      let slide6b = pptx.addSlide();
      addSlideHeader(slide6b, 'CDP Timeline', 'Plan with Financials');
      
      const bars = data.lifecycleBars || [];
      const cmcBars = bars.slice(0, 2);
      const clinicalBars = bars.slice(2);
      
      slide6b.addText('SWIMLANE', { x: 0.2, y: 1.2, w: 1.0, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });
      tlYears.forEach((y, i) => {
         const xPos = startX + 0.2 + (i / tlYears.length) * (tWidth - 0.8);
         slide6b.addText(y.toString(), { x: xPos, y: 1.2, w: (tWidth - 0.8) / tlYears.length, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });
      });
      slide6b.addText('Total [£m]', { x: startX + 0.2 + (tWidth - 0.8), y: 1.2, w: 0.6, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });

      currentY = 1.6;
      [...cmcBars, { id: 'spacer' }, ...clinicalBars].forEach((bar: any, bIdx) => {
         const rowHeight = 0.5;
         const gridW = tWidth - 0.8;
         const gridX = startX + 0.2;
         
         if (bar.id === 'spacer') {
             slide6b.addShape('rect', { x: 0.2, y: currentY, w: gridW + 1.6, h: rowHeight, fill: { color: 'F8FAFC' } });
             currentY += rowHeight;
             return;
         }

         tlYears.forEach((_, i) => {
            const xPos = gridX + (i / tlYears.length) * gridW;
            slide6b.addShape('rect', { x: xPos, y: currentY, w: gridW / tlYears.length, h: rowHeight, fill: { color: bIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF' }, line: { color: 'EEEEEE', width: 1 } });
         });
         
         const leftPct = Math.max(0, (bar.startYear - tlYears[0]) / tlYears.length);
         const widthPct = Math.max(0.05, (bar.endYear - bar.startYear) / tlYears.length);
         const bTop = currentY + 0.125;
         
         let bColor = '3B82F6';
         if (bar.colorClass?.includes('green') || bar.name.includes('Ph 3')) bColor = '10B981';
         else if (bar.colorClass?.includes('red')) bColor = 'EF4444';

         slide6b.addShape('rect', { x: gridX + (leftPct * gridW), y: bTop, w: widthPct * gridW, h: 0.25, fill: { color: bColor }, line: { color: bColor, width: 1 } });
         slide6b.addText(bar.name, { x: gridX + (leftPct * gridW), y: bTop, w: widthPct * gridW, h: 0.25, fontSize: 8, color: 'FFFFFF', align: 'center', bold: true });
         
         currentY += rowHeight;
      });

      // ==========================================
      // SLIDE 6C: TIMELINE - SCENARIO PLANS
      // ==========================================
      let slide6c = pptx.addSlide();
      addSlideHeader(slide6c, 'CDP Timeline', 'Scenario Plans');
      
      slide6c.addText('Scenario', { x: 0.2, y: 1.2, w: 1.0, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });
      tlYears.forEach((y, i) => {
         const xPos = startX + 0.2 + (i / tlYears.length) * (tWidth - 0.8);
         slide6c.addText(y.toString(), { x: xPos, y: 1.2, w: (tWidth - 0.8) / tlYears.length, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });
      });
      slide6c.addText('Total [£m]', { x: startX + 0.2 + (tWidth - 0.8), y: 1.2, w: 0.6, h: 0.3, align: 'center', fontSize: 10, fill: { color: 'F1F5F9' }, border: { pt: 1, color: 'CCCCCC' } });

      currentY = 1.6;
      (data.scenarioPlans || []).forEach(scen => {
         const rowHeight = 1.0;
         const gridW = tWidth - 0.8;
         const gridX = startX + 0.2;
         
         slide6c.addText(scen.name || '', { x: 0.2, y: currentY, w: 1.0, h: rowHeight, fontSize: 9, italic: true, align: 'center', border: { pt: 1, color: 'CCCCCC' } });
         
         tlYears.forEach((_, i) => {
            const xPos = gridX + (i / tlYears.length) * gridW;
            slide6c.addShape('rect', { x: xPos, y: currentY, w: gridW / tlYears.length, h: rowHeight, fill: { color: 'FFFFFF' }, line: { color: 'EEEEEE', width: 1 } });
         });
         
         (scen.bars || []).forEach(bar => {
             const leftPct = Math.max(0, (bar.startYear - tlYears[0]) / tlYears.length);
             const widthPct = Math.max(0.05, (bar.endYear - bar.startYear) / tlYears.length);
             const bTop = currentY + 0.4;
             
             // Blue border logic for Scenario Plans requested by user
             slide6c.addShape('rect', { x: gridX + (leftPct * gridW), y: bTop, w: widthPct * gridW, h: 0.25, fill: { color: 'FFFFFF' }, line: { color: '0284C7', width: 2 } });
             slide6c.addText(bar.name, { x: gridX + (leftPct * gridW), y: bTop, w: widthPct * gridW, h: 0.25, fontSize: 8, color: '333333', align: 'center', bold: true });
         });
         
         (scen.milestones || []).filter(m => m.isSelected).forEach(m => {
             const yIdx = tlYears.indexOf(m.year);
             if(yIdx === -1) return;
             const mLeftPct = (yIdx / tlYears.length) + (m.position / 100) * (1 / tlYears.length);
             const mx = gridX + (mLeftPct * gridW);
             
             const isTop = m.placement === 'top';
             const mTop = isTop ? currentY + 0.2 : currentY + 0.8;
             const diamondColor = isTop ? 'EAB308' : '0EA5E9'; // Yellow or Blue
             
             slide6c.addShape('diamond', { x: mx - 0.05, y: mTop - 0.05, w: 0.1, h: 0.1, fill: { color: diamondColor } });
             slide6c.addText(m.name, { x: mx - 0.3, y: isTop ? mTop - 0.2 : mTop + 0.05, w: 0.6, h: 0.2, fontSize: 6, align: 'center', color: '111111' });
         });

         slide6c.addText(scen.totalEpe || '', { x: gridX + gridW, y: currentY, w: 0.6, h: rowHeight, fontSize: 10, bold: true, align: 'center', border: { pt: 1, color: 'CCCCCC' } });
         
         currentY += rowHeight;
      });

      // ==========================================
      // SLIDE 7: HIO
      // ==========================================
      let slide7 = pptx.addSlide();
      addSlideHeader(slide7, 'High-level Investment Overview', 'Key contact: Project manager / Finance');

      const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];
      const hioHeadOpt = { fill: { color: 'F8FAFC' }, bold: true, align: 'center' };
      const hioHeader = [
        safeCell('SWIMLANE', hioHeadOpt), 
        ...years.map(y => safeCell(y.toString(), hioHeadOpt)), 
        safeCell('EPE', hioHeadOpt), safeCell('IPE', hioHeadOpt), safeCell('PTRS', hioHeadOpt)
      ];
      
      const swimlaneRows = (data.swimlanes || []).map((lane, idx) => [
        safeCell(lane || '', { fill: { color: 'F1F5F9' }, bold: true }), 
        ...years.map(_ => safeCell('')), 
        safeCell(`£${idx*2+1}m`), safeCell(`£${idx}m`), safeCell(`${15 + idx*15}%`)
      ]);

      const finRows = (data.financials || []).map(fin => [
        safeCell(fin.label || '', { fill: { color: 'F8FAFC' }, bold: true, align: 'right' }), 
        ...years.map(y => safeCell(fin.data?.[y] || '')), 
        safeCell(fin.summaryEPE || ''), safeCell(fin.summaryIPE || ''), safeCell('')
      ]);

      slide7.addTable([hioHeader, ...swimlaneRows, ...finRows], { 
        x: 0.5, y: 1.3, w: 9, fontSize: 7, rowH: 0.25, border: { pt: 0.5, color: '999999' }, align: 'center'
      });

      const colWidth = 9 / 14; 
      const lineX = 0.5 + (colWidth * 4.5); 
      slide7.addShape('line', { x: lineX, y: 1.1, w: 0, h: 2.5, line: { color: '333333', width: 2 } });
      slide7.addText('Today', { x: lineX - 0.2, y: 0.9, w: 0.4, h: 0.2, fontSize: 8, color: '333333', align: 'center', bold: true });

      slide7.addText('ACTUALS', { x: 0.5, y: 4.2, w: 4.4, h: 0.2, fill: { color: 'F04E23' }, color: 'FFFFFF', bold: true, fontSize: 9 });
      slide7.addText(data.hioCommentary?.actuals || '', { x: 0.5, y: 4.4, w: 4.4, h: 0.6, fontSize: 8, color: '333333', border: { pt: 1, color: '999999' } });
      slide7.addText('BUDGET', { x: 5.1, y: 4.2, w: 4.4, h: 0.2, fill: { color: 'BBBBBB' }, color: '000000', bold: true, fontSize: 9 });
      slide7.addText(data.hioCommentary?.budget || '', { x: 5.1, y: 4.4, w: 4.4, h: 0.6, fontSize: 8, color: '333333', border: { pt: 1, color: '999999' } });

      // ==========================================
      // SLIDE 8: RESOURCING
      // ==========================================
      let slide8 = pptx.addSlide();
      addSlideHeader(slide8, 'Resourcing estimates shared with Functional Leads', 'Validated from RM System');
      
      const rHeadOpt = { fill: { color: 'F04E23' }, color: 'FFFFFF', bold: true, align: 'center' };
      const resHeader1 = [
        safeCell('R&D FUNCTION', { ...rHeadOpt, align: 'left' }),
        safeCell('CY FTE', { ...rHeadOpt, colSpan: 4 }),
        safeCell('CY IPE', rHeadOpt),
        safeCell('2027', { ...rHeadOpt, colSpan: 2 }),
        safeCell('2028', { ...rHeadOpt, colSpan: 2 }),
        safeCell('2029', { ...rHeadOpt, colSpan: 2 }),
        safeCell('PROJECT TOTAL', { ...rHeadOpt, colSpan: 3 })
      ];
      
      const resRows: any[] = [];
      (data.resourcingData || []).forEach(cat => {
        resRows.push([
          safeCell(cat.name || '', { fill: { color: 'F1F5F9' }, color: 'F04E23', bold: true, colSpan: 15 })
        ]);
        cat.children?.forEach(child => {
          resRows.push([
            safeCell('  ' + (child.name || ''), { align: 'left' }),
            safeCell(child.cyFTE?.[0]), safeCell(child.cyFTE?.[1]), safeCell(child.cyFTE?.[2]), safeCell(child.cyFTE?.[3]),
            safeCell(child.cyIPE),
            safeCell(child.y1FTE), safeCell(child.y1IPE),
            safeCell(child.y2FTE), safeCell(child.y2IPE),
            safeCell(child.y3FTE), safeCell(child.y3IPE),
            safeCell(child.projAlgoFTE), safeCell(child.projFnHeadFTE), safeCell(child.projIPE)
          ]);
        });
      });

      slide8.addTable([resHeader1, ...resRows], { 
        x: 0.25, y: 1.3, w: 9.5, fontSize: 6, rowH: 0.15, border: { pt: 0.5, color: 'E2E8F0' } 
      });

      // ==========================================
      // SLIDE 16: RISKS & STRATEGIES
      // ==========================================
      let slide9 = pptx.addSlide();
      
      // Top left CSI
      slide9.addText('CSI External Use', { x: 0.5, y: 0.2, w: 2, h: 0.2, fontSize: 8, color: '64748B' });
      // Triangle
      slide9.addShape('triangle', { x: 0.2, y: 0.5, w: 0.15, h: 0.2, fill: { color: 'F04E23' }, rotate: 90 });
      // Title
      slide9.addText('Important Risks and Mitigation Strategies', { x: 0.5, y: 0.45, w: 8, h: 0.4, fontSize: 22, color: 'F04E23', bold: false, fontFace: 'Arial' });
      // Subtitle
      slide9.addText('Include up to 5 top risks, their impacts, and strategies to address each', { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 14, color: '333333' });
      
      // Top Right Blue Box
      slide9.addText('Pull directly from Project Risk Tool\nKey contact: Project Manager', { x: 6.5, y: 0, w: 3.5, h: 0.4, fill: { color: '0284C7' }, color: 'FFFFFF', fontSize: 8, italic: true, align: 'right' });

      // Table Header
      const compHeadOpt = { fill: { color: 'C53030' }, color: 'FFFFFF', bold: true, align: 'center', border: { pt: 1, color: 'E2E8F0' } };
      const compHeaders = [
        safeCell('', { border: { pt: 1, color: 'E2E8F0' } }),
        ...(data.riskComparators || []).map(c => safeCell(c.assetName, compHeadOpt))
      ];

      // Table Rows
      const compRows = [
        { field: 'studyBrand', label: 'Study Brand' },
        { field: 'population', label: 'Population' },
        { field: 'enrolment', label: 'Enrolment' },
        { field: 'randomisation', label: 'Randomisation' },
        { field: 'treatmentDuration', label: 'Treatment duration' },
        { field: 'endpoint', label: 'Endpoint' },
        { field: 'otherComparators', label: '<<Other key comparators>>' }
      ].map(r => [
        safeCell(r.label, { bold: true, border: { pt: 1, color: 'E2E8F0' } }),
        ...(data.riskComparators || []).map(c => safeCell(c[r.field as keyof typeof c] || '', { border: { pt: 1, color: 'E2E8F0' } }))
      ]);

      slide9.addTable([compHeaders, ...compRows], { 
        x: 0.5, y: 1.5, w: 9, rowH: 0.4, fontSize: 10, border: { pt: 1, color: 'F04E23' } 
      });



      // Logo footer
      slide9.addText('GSK', { x: 8.8, y: 5.1, w: 1, h: 0.4, fontSize: 24, bold: true, color: 'F04E23', align: 'right' });
      slide9.addText('CSI External Use', { x: 8.8, y: 5.4, w: 1, h: 0.2, fontSize: 8, color: '64748B', align: 'right' });
      slide9.addText('16', { x: 0.5, y: 5.4, w: 0.5, h: 0.2, fontSize: 8, color: '64748B' });

      // ==========================================
      // SLIDE 10: IES Template - Executive Summary
      // ==========================================
      let slide10 = pptx.addSlide();
      
      // Triangle and Title
      slide10.addShape('triangle', { x: 0.2, y: 0.5, w: 0.15, h: 0.2, fill: { color: 'F04E23' }, rotate: 90 });
      slide10.addText('IES Template - Executive Summary', { x: 0.5, y: 0.45, w: 8, h: 0.4, fontSize: 22, color: 'F04E23', bold: false, fontFace: 'Arial' });
      slide10.addText('Key unmet needs & claims overview', { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 14, color: '111111' });

      // Diagram Top Right
      slide10.addText('TPP     →     IES     ↔', { x: 6, y: 0.4, w: 2, h: 0.4, fontSize: 10, bold: true, color: '333333' });
      slide10.addShape('rect', { x: 8, y: 0.2, w: 1.5, h: 0.8, fill: { color: 'FCE4D6' }, line: { color: 'F04E23', width: 1 } });
      slide10.addText('Clinical development plan\nGlobal Epi plan\nData generation plan', { x: 8, y: 0.2, w: 1.5, h: 0.8, fontSize: 7, color: '333333', align: 'center' });

      // Top Table (Indication / TPP Alignment)
      const topHeadOpt = { fill: { color: '004B9B' }, color: 'FFFFFF', bold: true, border: { pt: 1, color: 'FFFFFF' }, fontSize: 10 };
      const topRows = [
        [safeCell('Indication', topHeadOpt), safeCell('TPP alignment', topHeadOpt)],
        [safeCell(data.iesData?.indication || '', { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 10 }), 
         safeCell(data.iesData?.tppAlignment || '', { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 10 })]
      ];
      slide10.addTable(topRows, { x: 0.5, y: 1.4, w: 6, rowH: 0.3 });

      // PALT alignment date
      slide10.addShape('rect', { x: 6.8, y: 1.4, w: 2.7, h: 0.6, fill: { color: 'FCE4D6' } });
      slide10.addText('PALT alignment date: ' + (data.iesData?.paltDate || ''), { x: 6.8, y: 1.4, w: 2.7, h: 0.6, fontSize: 10, align: 'center', color: '111111' });

      // Main Table
      const mainHeadOpt = { fill: { color: '004B9B' }, color: 'FFFFFF', bold: true, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8, align: 'left', valign: 'top' };
      const mainHeader = [
        safeCell('Strategic Pillars', mainHeadOpt),
        safeCell('Which TPP (or SSOs) aspect will the evidence support', mainHeadOpt),
        safeCell('Main stakeholder (who will use the evidence)', mainHeadOpt),
        safeCell('Type of evidence (CT, Observational...)', mainHeadOpt),
        safeCell('Priority (H,M, L)', mainHeadOpt),
        safeCell('Function generating the evidence', mainHeadOpt),
        safeCell('When is it needed to be most effective', mainHeadOpt)
      ];

      const mainRows = (data.iesData?.rows || []).map(row => [
        safeCell(row.pillar, { fill: { color: 'B4B4D5' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8, bold: true }),
        safeCell(row.tppAspect, { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8 }),
        safeCell(row.stakeholder, { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8 }),
        safeCell(row.evidenceType, { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8 }),
        safeCell(row.priority, { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8, align: 'center' }),
        safeCell(row.functionGenerating, { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8 }),
        safeCell(row.whenNeeded, { fill: { color: 'E6E6FA' }, border: { pt: 1, color: 'FFFFFF' }, fontSize: 8 })
      ]);

      slide10.addTable([mainHeader, ...mainRows], { x: 0.8, y: 2.2, w: 8.7, rowH: 0.5, border: { pt: 1, color: 'FFFFFF' } });

      // Rotated text
      slide10.addShape('rect', { x: -0.8, y: 3.5, w: 3, h: 0.3, fill: { color: 'FEF08A' }, border: { pt: 1, color: 'FFFFFF' }, rotate: 270 });
      slide10.addText('Example (illustrative)         Description', { x: -0.8, y: 3.5, w: 3, h: 0.3, fontSize: 8, bold: true, align: 'center', rotate: 270 });

      // Footer
      slide10.addText('GSK', { x: 8.8, y: 5.1, w: 1, h: 0.4, fontSize: 24, bold: true, color: 'F04E23', align: 'right' });
      slide10.addText('CSI External Use', { x: 8.8, y: 5.4, w: 1, h: 0.2, fontSize: 8, color: '64748B', align: 'right' });
      slide10.addText('13', { x: 0.5, y: 5.4, w: 0.5, h: 0.2, fontSize: 8, color: '64748B' });

      await pptx.writeFile({ fileName: `${data.projectId || 'Project'}_Governance_Deck.pptx` });

      setDownloadComplete(true);
    } catch (error: any) {
      console.error('Error generating PPT:', error);
      alert(`Failed to generate PowerPoint: ${error?.message || 'Unknown error'}. Please refresh and try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartNew = () => {
    setCurrentStep(1);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      
      {!downloadComplete ? (
        <>
          <div style={{ 
            width: '80px', height: '80px', 
            background: 'linear-gradient(135deg, #FF7B00 0%, #E63800 100%)', 
            borderRadius: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            marginBottom: '2rem', fontSize: '2rem', color: 'white',
            boxShadow: '0 10px 20px rgba(240, 78, 35, 0.3)'
          }}>
            📥
          </div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 300 }}>Ready to Download</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '450px', lineHeight: 1.6 }}>
            Your governance deck for <strong>{data.projectName || 'Project'}</strong> is ready. The exported PowerPoint mirrors the high-fidelity visuals from your preview.
          </p>

          <button 
            className="btn btn-primary" 
            style={{ 
              fontSize: '1.25rem', padding: '1rem 3rem', 
              background: 'linear-gradient(90deg, #F04E23 0%, #EA580C 100%)',
              border: 'none', borderRadius: '50px', fontWeight: 600
            }}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
               <><span className="loading-indicator" style={{ marginRight: '12px' }}></span> Finalizing Slides...</>
            ) : 'Generate Board Presentation'}
          </button>
        </>
      ) : (
        <div className="animate-fade-in">
          <div style={{ width: '80px', height: '80px', background: '#d1fae5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', fontSize: '2rem', margin: '0 auto 2rem', border: '1px solid #a7f3d0' }}>
            ✓
          </div>
          <h2 style={{ marginBottom: '1rem', color: '#047857' }}>Success!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            <strong>{data.projectId || 'Project'}_Governance_Deck.pptx</strong> has been generated and saved.
          </p>
          
          <button className="btn btn-secondary" onClick={handleStartNew}>
            Start New Deck
          </button>
        </div>
      )}

    </div>
  );
};

export default Step6Download;
