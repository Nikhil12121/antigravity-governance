import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Milestone = {
  id: string;
  name: string;
  year: number;
  swimlane: string;
  position: number; 
  isSelected: boolean;
  barId?: string;
  placement?: 'top' | 'bottom';
};

export type FinancialRow = {
  label: string;
  data: Record<number, string>;
  summaryEPE?: string;
  summaryIPE?: string;
};

export type ResourcingRow = {
  id: string;
  name: string;
  isCategory?: boolean;
  cyFTE?: string[]; // array of 4 strings for Q1, Q2, Q3, Q4
  cyIPE?: string;
  y1FTE?: string; y1IPE?: string; // 2027
  y2FTE?: string; y2IPE?: string; // 2028
  y3FTE?: string; y3IPE?: string; // 2029
  projAlgoFTE?: string; projFnHeadFTE?: string; projIPE?: string;
  priorFTE?: string; priorIPE?: string;
  signOff?: string;
  children?: ResourcingRow[];
};

export type Risk = {
  id: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
};

export type RiskComparatorColumn = {
  id: string;
  assetName: string;
  studyBrand: string;
  population: string;
  enrolment: string;
  randomisation: string;
  treatmentDuration: string;
  endpoint: string;
  otherComparators: string;
};

export type IESRow = {
  id: string;
  pillar: string;
  tppAspect: string;
  stakeholder: string;
  evidenceType: string;
  priority: string;
  functionGenerating: string;
  whenNeeded: string;
};

export type IESData = {
  indication: string;
  tppAlignment: string;
  paltDate: string;
  rows: IESRow[];
};

export type ValueCreationItem = {
  id: string;
  metric: string;
  currentEstimate: string;
  lastGoverned: string;
  comment: string;
};

export type PrimaryIndication = {
  id: string;
  indication: string;
  lineOfTherapy: string;
  targetPopulation: string;
  peakShare: string;
};

export type SlideComment = {
  id: string;
  text: string;
  x: number; // percentage width
  y: number; // percentage height
  width: number; // percentage width
  height: number; // percentage height
  linkedMilestoneId?: string;
};

export type GanttComment = {
  id: string;
  text: string;
  year: number;
  swimlane: string;
  x: number;
  y: number;
};

export type LifecycleGroup = {
  groupName: string;
  swimlanes: string[];
};

export type ScenarioPlan = {
  id: string;
  name: string;
  ptrs: string;
  totalEpe: string;
  bars?: { id: string; name: string; startYear: number; endYear: number }[];
  milestones: Milestone[];
};

export type GovernanceData = {
  projectId: string;
  projectName: string;
  boardHeading: string;
  consultationType: string;
  assetLine: string;
  owner: string;
  date: string;
  consultationText: string;
  consultationPoints: {
    decision: string[];
    input: string[];
    awareness: string[];
  };
  executiveSummary: {
    context: string;
    teamProposal: string;
    keyQuestions: string;
  };
  reasonsToBelieve: {
    unmetNeed: string;
    moa: string;
    preclinical: string;
    clinical: string;
    reasonsNotToBelieve: string;
  };
  valueCreation: {
    items: ValueCreationItem[];
    comments: string;
  };
  valuationInputs: {
    indications: PrimaryIndication[];
    metrics: Record<string, string>; // e.g. { "PTRS": "30%", "eNPV": "£1.2B" }
  };
  slideComments: SlideComment[];
  summaryType: string;
  summaryInstruction: string;
  generatedSummary: string[];
  
  startYear: number;
  endYear: number;
  currentYear: number; 
  swimlanes: string[];
  milestones: Milestone[];
  financials: FinancialRow[];
  ganttComments: GanttComment[];
  lifecycleGroups: LifecycleGroup[];
  lifecycleBars: { id: string; swimlane: string; name: string; startYear: number; endYear: number; colorClass: string; rowIdx: number }[];
  lifecycleMilestones: Milestone[];
  scenarioPlans: ScenarioPlan[];
  resourcingData: ResourcingRow[];
  risks: Risk[];
  riskComparators: RiskComparatorColumn[];
  iesData: IESData;
  keyDependencies: string;
  hioCommentary: {
    actuals: string;
    budget: string;
  };
};

const initialData: GovernanceData = {
  projectId: 'GSK4425689',
  projectName: 'Oncology Phase II',
  boardHeading: 'VIDRU Board Review',
  consultationType: 'Decision',
  assetLine: 'Oncology',
  owner: 'Jane Doe',
  date: new Date().toISOString().split('T')[0],
  consultationText: '',
  consultationPoints: { decision: [], input: [], awareness: [] },
  executiveSummary: { 
    context: 'The Asset has demonstrated a best-in-class selectivity profile in the T790M resistant population. Recent data highlights a potential for significant label expansion into 1L patients with CNS involvement, representing a £420M incremental opportunity. The competitive landscape remains fluid, but our current First-in-Human (FIH) to Launch trajectory is 12% faster than industry standard.', 
    teamProposal: 'Authorize full funding for the "EXCELSIOR" Phase III program. Pivot the manufacturing scale-up to high-throughput sites in Singapore to mitigate EU supply chain risks identified in Q3.', 
    keyQuestions: '• Does the board approve the strategic pivot to Singapore for CMC primary supply?\n• Is the board comfortable with the 3% PTRS reduction following adjusted hazard ratio projections?' 
  },
  reasonsToBelieve: {
    unmetNeed: '• Significant therapeutic gap in 3rd line oncology treatments where current ORR remains <15%.\n• High CNS relapse rates in standard-of-care patient cohorts.\n• Patient burden with IV regimens necessitates the once-daily oral profile of our asset.',
    moa: '• First-in-class dual-mechanism inhibitor targeting both DNA repair and apoptotic pathways.\n• Superior selectivity minimizes systemic toxicity vs. competitor agents (3x wider therapeutic window).\n• Optimized pharmacokinetic profile supports 24hr target suppression at therapeutic doses.',
    preclinical: '• Demonstrated 100% tumor stagnation in PDX models representing primary resistance markers.\n• Synergistic activity confirmed when paired with current frontline immuno-oncology standards.\n• Safety margins established in non-human primate studies indicate low neurotoxicity risk.',
    clinical: '• Phase II cohort (n=85) showed 42% confirmed ORR in Heavily Pre-treated patients.\n• Duration of response (DoR) exceeded 14 months, significantly outperforming benchmark SoC (8mo).\n• Manageable safety profile with Grade 3/4 AEs below 10% occurrence rate.',
    reasonsNotToBelieve: '• Unknown long-term cardiac safety profile which requires extended Phase III monitoring.\n• Emerging competitor agent in early Phase I showing high potency in similar markers.\n• Complex formulation/encapsulation process may delay launch quantities if site validation fails.'
  },
  valueCreation: {
    items: [
      { id: 'vc1', metric: "(e)NPV (£'M)", currentEstimate: 'n/a', lastGoverned: '£1.4B', comment: 'Driven by improved commercial outlook in European markets.' },
      { id: 'vc2', metric: "(e)ROI", currentEstimate: 'n/a', lastGoverned: '2.2', comment: 'Slight decline due to extended Phase III timelines.' },
      { id: 'vc3', metric: "PTRS (%)", currentEstimate: 'green-up', lastGoverned: '25%', comment: 'Upgraded following robust Phase II safety profile results.' },
      { id: 'vc4', metric: "Total Dev Cost (£'M)", currentEstimate: 'red-up', lastGoverned: '£1.1B', comment: 'Increased clinical supply chain costs in North America.' },
      { id: 'vc5', metric: "Launch Year", currentEstimate: 'similar', lastGoverned: '2027', comment: 'On track for Q4 launch pending regulatory submission.' },
      { id: 'vc6', metric: "2031 Sales (£'M)", currentEstimate: 'n/a', lastGoverned: '£1.6B', comment: 'Reflects higher anticipated peak penetration in oncology.' },
      { id: 'vc7', metric: "PYS (£'M)", currentEstimate: 'n/a', lastGoverned: '£1.8B', comment: 'Projected peak sales adjusted for secondary indications.' },
      { id: 'vc8', metric: "Year of Peak Sales", currentEstimate: 'n/a', lastGoverned: '2033', comment: 'Standard 6-year trajectory from launch year.' },
      { id: 'vc9', metric: "Payback Period", currentEstimate: 'n/a', lastGoverned: '8 yrs', comment: 'Aligns with typical portfolio recovery standards.' }
    ],
    comments: ""
  },
  valuationInputs: {
    indications: [
      { id: 'ind1', indication: 'NSCLC 1st Line', lineOfTherapy: '1L', targetPopulation: '55k (Metastatic)', peakShare: '35%' },
      { id: 'ind2', indication: 'HNSCC (r/m)', lineOfTherapy: '2L', targetPopulation: '22k (PD-L1+)', peakShare: '25%' },
      { id: 'ind3', indication: 'Adjuvant NSCLC', lineOfTherapy: 'Adj', targetPopulation: '15k (Stage III)', peakShare: '15%' }
    ],
    metrics: {
      'PTRS': '28%',
      'eNPV': '£1,420M',
      'eROI': '2.5',
      'Peak Sales': '£1,850M'
    }
  },
  slideComments: [
    { id: 'sc1', text: 'Team to refresh PTRS post-readout', x: 65, y: 70, width: 20, height: 15 }
  ],
  summaryType: 'Executive',
  summaryInstruction: '',
  generatedSummary: [],
  
  startYear: 2023,
  endYear: 2034,
  currentYear: 2026,
  swimlanes: ['Clinical Development', 'Regulatory Affairs', 'CMC & Supply', 'Commercial Strategy'],
  milestones: [
    { id: 'm1', name: 'Phase II Start', year: 2023, isSelected: true, swimlane: 'Clinical Development', position: 20 },
    { id: 'm2', name: 'Phase III Start', year: 2024, isSelected: true, swimlane: 'Clinical Development', position: 60 },
    { id: 'm3', name: 'US Filing (NDA)', year: 2026, isSelected: true, swimlane: 'Regulatory Affairs', position: 30 },
    { id: 'm4', name: 'EU Filing (MAA)', year: 2026, isSelected: true, swimlane: 'Regulatory Affairs', position: 80 },
    { id: 'm5', name: 'Global Launch', year: 2027, isSelected: true, swimlane: 'Commercial Strategy', position: 40 },
    { id: 'm6', name: 'Site Validation', year: 2023, isSelected: true, swimlane: 'CMC & Supply', position: 75 }
  ],
  financials: [
    { label: 'EPE* (£M)', data: { 2023: '£55.0m', 2024: '£85.0m', 2025: '£120.0m', 2026: '£95.0m', 2027: '£45.0m', 2028: '£35.0m', 2029: '£25.0m', 2030: '£20.0m', 2031: '£15.0m', 2032: '£10.0m' }, summaryEPE: '£600M' },
    { label: 'IPE (£M)', data: { 2023: '£25.0m', 2024: '£35.0m', 2025: '£45.0m', 2026: '£30.0m', 2027: '£20.0m', 2028: '£15.0m', 2029: '£12.0m', 2030: '£10.0m', 2031: '£8.0m', 2032: '£5.0m' }, summaryIPE: '£250M' },
    { label: 'FTE (FTEs)', data: { 2023: '45', 2024: '65', 2025: '85', 2026: '75', 2027: '40', 2028: '30', 2029: '20', 2030: '15', 2031: '12', 2032: '10' } },
    { label: 'IPE+EPE vs Act/Budget (£M)', data: { 2023: '-£5.2m', 2024: '+£8.5m', 2025: '-£2.1m', 2026: '-£1.4m', 2027: '+£0.5m', 2028: '+£1.2m' } },
    { label: 'EPE vs Act/Budget (£M)', data: { 2023: '-£3.1m', 2024: '+£6.2m', 2025: '-£1.5m', 2026: '-£0.8m', 2027: '+£0.2m', 2028: '+£0.8m' } }
  ],
  ganttComments: [
    { id: 'gc1', text: 'Consider accelerating Phase III to match competitor timelines', year: 2025, swimlane: 'Clinical Development', x: 20, y: 10 }
  ],
  lifecycleGroups: [
    { groupName: 'CMC & clinical', swimlanes: ['row0', 'row1'] },
    { groupName: 'Primary Indication (Rheumatoid Arthritis)', swimlanes: ['row2', 'row3'] },
    { groupName: 'Osteoarthritis', swimlanes: ['row4', 'row5', 'row6', 'row7', 'row8'] },
    { groupName: 'IBD - UC', swimlanes: ['row9', 'row10'] }
  ],
  lifecycleBars: [
    { id: 'b1', swimlane: 'row0', name: 'CMC development & Ph3 manufacture', startYear: 2023, endYear: 2025, colorClass: 'outline-red', rowIdx: 0 },
    { id: 'b2', swimlane: 'row1', name: 'CMC process characterisation, comms supplies, and registration support', startYear: 2024, endYear: 2027, colorClass: 'outline-red', rowIdx: 1 },
    { id: 'b3', swimlane: 'row2', name: 'RA Ph 2b dose range study', startYear: 2023, endYear: 2025, colorClass: 'outline-blue', rowIdx: 2 },
    { id: 'b4', swimlane: 'row3', name: 'RA Ph 3 studies', startYear: 2025, endYear: 2028, colorClass: 'outline-blue', rowIdx: 3 },
    { id: 'b5', swimlane: 'row4', name: 'HOA Ph 2a study', startYear: 2023, endYear: 2025, colorClass: 'outline-blue', rowIdx: 4 },
    { id: 'b6', swimlane: 'row5', name: 'HOA Ph 2b study', startYear: 2025, endYear: 2027, colorClass: 'outline-blue', rowIdx: 5 },
    { id: 'b7', swimlane: 'row6', name: 'HOA Ph 3 studies', startYear: 2027, endYear: 2030, colorClass: 'outline-blue', rowIdx: 6 },
    { id: 'b8', swimlane: 'row7', name: 'Poly-articular OA Ph 3 studies', startYear: 2027, endYear: 2031, colorClass: 'outline-blue', rowIdx: 7 },
    { id: 'b9', swimlane: 'row9', name: 'Ph 2a POC starts', startYear: 2025, endYear: 2027, colorClass: 'outline-blue', rowIdx: 9 },
    { id: 'b10', swimlane: 'row10', name: 'Ph 2b/3 programme', startYear: 2027, endYear: 2030, colorClass: 'outline-blue', rowIdx: 10 }
  ],
  lifecycleMilestones: [
    { id: 'lm1', name: 'P2 FSFD', year: 2023, isSelected: true, swimlane: 'row2', position: 10 },
    { id: 'lm2', name: 'C2FD', year: 2024, isSelected: true, swimlane: 'row2', position: 80 },
    { id: 'lm3', name: 'P3 FSFD', year: 2025, isSelected: true, swimlane: 'row3', position: 20 },
    { id: 'lm4', name: 'C2FHL', year: 2028, isSelected: true, swimlane: 'row3', position: 10 },
    { id: 'lm5', name: 'File', year: 2029, isSelected: true, swimlane: 'row3', position: 50 },
    { id: 'lm6', name: 'Launch', year: 2030, isSelected: true, swimlane: 'row3', position: 20 },
    { id: 'lm7', name: 'C2RX', year: 2024, isSelected: true, swimlane: 'row4', position: 90 },
    { id: 'lm8', name: 'C2FD', year: 2026, isSelected: true, swimlane: 'row5', position: 80 },
    { id: 'lm9', name: 'C2FD', year: 2024, isSelected: true, swimlane: 'row9', position: 20 },
    { id: 'lm10', name: 'C2RX/3', year: 2027, isSelected: true, swimlane: 'row10', position: 10 }
  ],
  scenarioPlans: [
    {
      id: 'scen1', name: 'Enable RT study early start. Launch 2028', ptrs: '30%', totalEpe: '£850M',
      bars: [
        { id: 'b1', name: 'RA Ph 2b dose range study', startYear: 2023, endYear: 2025 },
        { id: 'b2', name: 'RA Ph 3 studies', startYear: 2026, endYear: 2028 }
      ],
      milestones: [
        { id: 'sm1_1', name: 'P2b FSFD', year: 2023, isSelected: true, swimlane: 'scen1', position: 20, barId: 'b1', placement: 'top' },
        { id: 'sm1_2', name: 'C2FD', year: 2024, isSelected: true, swimlane: 'scen1', position: 10, barId: 'b1', placement: 'top' },
        { id: 'sm1_3', name: 'DPD IA', year: 2024, isSelected: true, swimlane: 'scen1', position: 80, barId: 'b1', placement: 'bottom' },
        { id: 'sm1_4', name: '1° EP', year: 2025, isSelected: true, swimlane: 'scen1', position: 10, barId: 'b1', placement: 'bottom' },
        { id: 'sm1_5', name: 'P3 Start', year: 2026, isSelected: true, swimlane: 'scen1', position: 10, barId: 'b2', placement: 'top' },
        { id: 'sm1_6', name: 'C2FHL', year: 2027, isSelected: true, swimlane: 'scen1', position: 20, barId: 'b2', placement: 'top' },
        { id: 'sm1_7', name: 'Launch', year: 2028, isSelected: true, swimlane: 'scen1', position: 60, barId: 'b2', placement: 'top' }
      ]
    },
    {
      id: 'scen2', name: 'Acceleration plan phase 2b/3 approach. Launch 2027', ptrs: '28%', totalEpe: '£920M',
      bars: [
        { id: 'b3', name: 'Seamless Ph 2b/3 study', startYear: 2023, endYear: 2027 }
      ],
      milestones: [
        { id: 'sm2_1', name: 'P2 FSFD', year: 2023, isSelected: true, swimlane: 'scen2', position: 40, barId: 'b3', placement: 'top' },
        { id: 'sm2_2', name: 'C2FD', year: 2024, isSelected: true, swimlane: 'scen2', position: 20, barId: 'b3', placement: 'top' },
        { id: 'sm2_3', name: 'W52 IDMC', year: 2024, isSelected: true, swimlane: 'scen2', position: 50, barId: 'b3', placement: 'bottom' },
        { id: 'sm2_4', name: 'Launch', year: 2027, isSelected: true, swimlane: 'scen2', position: 80, barId: 'b3', placement: 'top' }
      ]
    },
    {
      id: 'scen3', name: 'Delay indication until futility reached. Launch 2029', ptrs: '25%', totalEpe: '£780M',
      bars: [
        { id: 'b4', name: 'RA Ph 2b dose range study', startYear: 2023, endYear: 2025 },
        { id: 'b5', name: 'RA Ph 3 studies', startYear: 2027, endYear: 2029 }
      ],
      milestones: [
        { id: 'sm3_1', name: 'P2b FSFD', year: 2023, isSelected: true, swimlane: 'scen3', position: 60, barId: 'b4', placement: 'top' },
        { id: 'sm3_2', name: 'Futility', year: 2024, isSelected: true, swimlane: 'scen3', position: 30, barId: 'b4', placement: 'bottom' },
        { id: 'sm3_3', name: 'P3 Start', year: 2027, isSelected: true, swimlane: 'scen3', position: 10, barId: 'b5', placement: 'top' },
        { id: 'sm3_4', name: 'Launch', year: 2029, isSelected: true, swimlane: 'scen3', position: 50, barId: 'b5', placement: 'top' }
      ]
    }
  ],
  resourcingData: [
    {
      id: 'cmo', name: 'Chief Medical Office', isCategory: true,
      children: [
        { id: 'sf', name: 'Safety', cyFTE: ['12.5','12.5','14.0','14.0'], cyIPE: '£2.4m', y1FTE: '15.2', y1IPE: '£3.0m', y2FTE: '15.5', y2IPE: '£3.2m', y3FTE: '10.8', y3IPE: '£2.1m', projAlgoFTE: '14.2', projFnHeadFTE: '14.5', projIPE: '£2.8m', priorFTE: '12.0', priorIPE: '£2.2m', signOff: 'Approved' },
        { id: 'rg', name: 'Regulatory', cyFTE: ['8.2','8.2','8.5','8.5'], cyIPE: '£1.5m', y1FTE: '10.5', y1IPE: '£2.2m', y2FTE: '12.0', y2IPE: '£2.5m', y3FTE: '6.4', y3IPE: '£1.2m', projAlgoFTE: '9.8', projFnHeadFTE: '10.2', projIPE: '£2.0m', priorFTE: '8.0', priorIPE: '£1.5m', signOff: 'Pending' }
      ]
    },
    {
      id: 'do', name: 'Development Operations', isCategory: true,
      children: [
        { id: 'do1', name: 'Global Ops', cyFTE: ['25.0','25.0','28.0','28.0'], cyIPE: '£5.2m', y1FTE: '32.5', y1IPE: '£6.8m', y2FTE: '35.0', y2IPE: '£7.5m', y3FTE: '20.5', y3IPE: '£4.2m', projAlgoFTE: '28.4', projFnHeadFTE: '30.5', projIPE: '£6.2m', priorFTE: '24.5', priorIPE: '£4.8m', signOff: 'Approved' }
      ]
    },
    {
      id: 'tds', name: 'Transformational & Development Services', isCategory: true,
      children: [
        { id: 'ad', name: 'Asia Development', cyFTE: ['15.2','15.2','18.5','18.5'], cyIPE: '£3.2m', y1FTE: '20.8', y1IPE: '£4.5m', y2FTE: '22.4', y2IPE: '£4.8m', y3FTE: '12.0', y3IPE: '£2.5m', projAlgoFTE: '18.5', projFnHeadFTE: '19.8', projIPE: '£4.2m', priorFTE: '14.8', priorIPE: '£3.0m', signOff: 'Approved' },
        { id: 'ep1', name: 'Epidemiology', cyFTE: ['4.2','4.2','4.5','4.5'], cyIPE: '£0.8m', y1FTE: '5.2', y1IPE: '£1.2m', y2FTE: '5.5', y2IPE: '£1.4m', y3FTE: '3.2', y3IPE: '£0.8m', projAlgoFTE: '4.5', projFnHeadFTE: '4.8', projIPE: '£1.1m', priorFTE: '4.0', priorIPE: '£0.7m', signOff: 'Approved' }
      ]
    },
    {
      id: 'dds', name: 'Drug Development and Supply', isCategory: true,
      children: [
        { id: 'ds', name: 'Drug Substance', cyFTE: ['18.5','18.5','22.4','22.4'], cyIPE: '£4.8m', y1FTE: '25.2', y1IPE: '£8.5m', y2FTE: '28.4', y2IPE: '£9.2m', y3FTE: '15.8', y3IPE: '£5.4m', projAlgoFTE: '22.4', projFnHeadFTE: '24.2', projIPE: '£7.8m', priorFTE: '17.5', priorIPE: '£4.2m', signOff: 'Approved' },
        { id: 'dp', name: 'Drug Product', cyFTE: ['12.4','12.4','15.8','15.8'], cyIPE: '£3.2m', y1FTE: '18.5', y1IPE: '£6.4m', y2FTE: '20.2', y2IPE: '£7.0m', y3FTE: '10.4', y3IPE: '£3.8m', projAlgoFTE: '15.5', projFnHeadFTE: '16.8', projIPE: '£5.2m', priorFTE: '11.8', priorIPE: '£2.8m', signOff: 'Approved' },
        { id: 'cs', name: 'Clinical Supply', cyFTE: ['8.5','8.5','10.2','10.2'], cyIPE: '£1.5m', y1FTE: '12.4', y1IPE: '£2.5m', y2FTE: '14.8', y2IPE: '£3.2m', y3FTE: '6.2', y3IPE: '£1.5m', projAlgoFTE: '10.4', projFnHeadFTE: '11.2', projIPE: '£2.2m', priorFTE: '7.5', priorIPE: '£1.2m', signOff: 'Approved' }
      ]
    },
    {
      id: 'ta', name: 'Therapy Area', isCategory: true,
      children: [
        { id: 'bs', name: 'Biostatistics', cyFTE: ['6.2','6.2','6.8','6.8'], cyIPE: '£1.2m', y1FTE: '8.5', y1IPE: '£1.8m', y2FTE: '9.2', y2IPE: '£2.0m', y3FTE: '5.4', y3IPE: '£1.0m', projAlgoFTE: '7.4', projFnHeadFTE: '7.8', projIPE: '£1.6m', priorFTE: '5.8', priorIPE: '£1.0m', signOff: 'Approved' },
        { id: 'csc', name: 'Clinical Science', cyFTE: ['10.5','10.5','12.8','12.8'], cyIPE: '£2.4m', y1FTE: '15.2', y1IPE: '£3.5m', y2FTE: '18.0', y2IPE: '£4.2m', y3FTE: '9.2', y3IPE: '£2.0m', projAlgoFTE: '12.8', projFnHeadFTE: '14.5', projIPE: '£3.2m', priorFTE: '9.5', priorIPE: '£2.1m', signOff: 'Approved' },
        { id: 'ppm', name: 'Pipeline Project Management', cyFTE: ['4.2','4.2','4.5','4.5'], cyIPE: '£0.6m', y1FTE: '5.8', y1IPE: '£0.8m', y2FTE: '6.2', y2IPE: '£1.0m', y3FTE: '3.5', y3IPE: '£0.5m', projAlgoFTE: '4.8', projFnHeadFTE: '5.2', projIPE: '£0.8m', priorFTE: '3.8', priorIPE: '£0.5m', signOff: 'Approved' },
        { id: 'rs', name: 'Research', cyFTE: ['20.4','20.4','24.2','24.2'], cyIPE: '£4.2m', y1FTE: '28.5', y1IPE: '£6.5m', y2FTE: '30.4', y2IPE: '£7.2m', y3FTE: '15.2', y3IPE: '£3.2m', projAlgoFTE: '24.2', projFnHeadFTE: '26.5', projIPE: '£5.8m', priorFTE: '18.5', priorIPE: '£3.5m', signOff: 'Approved' },
        { id: 'xdl', name: 'xDL', cyFTE: ['5.2','5.2','5.8','5.8'], cyIPE: '£1.0m', y1FTE: '7.2', y1IPE: '£1.5m', y2FTE: '8.4', y2IPE: '£1.8m', y3FTE: '4.2', y3IPE: '£0.8m', projAlgoFTE: '6.4', projFnHeadFTE: '6.8', projIPE: '£1.4m', priorFTE: '4.8', priorIPE: '£0.8m', signOff: 'Approved' },
      ]
    }
  ],
  risks: [
    { id: 'r1', description: 'Supply chain delay for API', impact: 'High', mitigation: 'Second source vendor onboarded' },
    { id: 'r2', description: 'Regulatory submission timeline shift', impact: 'Medium', mitigation: 'Early engagement with FDA planned' }
  ],
  riskComparators: [
    { id: 'rc1', assetName: '(asset)', studyBrand: '', population: '', enrolment: '', randomisation: '', treatmentDuration: '', endpoint: '', otherComparators: '' },
    { id: 'rc2', assetName: '(asset)', studyBrand: '', population: '', enrolment: '', randomisation: '', treatmentDuration: '', endpoint: '', otherComparators: '' },
    { id: 'rc3', assetName: '(asset)', studyBrand: '', population: '', enrolment: '', randomisation: '', treatmentDuration: '', endpoint: '', otherComparators: '' },
    { id: 'rc4', assetName: '(asset)', studyBrand: '', population: '', enrolment: '', randomisation: '', treatmentDuration: '', endpoint: '', otherComparators: '' },
    { id: 'rc5', assetName: '(asset)', studyBrand: '', population: '', enrolment: '', randomisation: '', treatmentDuration: '', endpoint: '', otherComparators: '' }
  ],
  iesData: {
    indication: 'NSCLC 1st Line',
    tppAlignment: 'T790M resistant population',
    paltDate: 'XXXX',
    rows: [
      { id: 'ies1', pillar: 'Strategic Pillar 1: Evidence to support use in immunocompromised patients', tppAspect: 'Safety and tolerability in vulnerable pop', stakeholder: 'Regulators, Payers', evidenceType: 'CT, Observational', priority: 'H', functionGenerating: 'Clinical', whenNeeded: 'Phase III Readout' },
      { id: 'ies2', pillar: 'Strategic Pillar 2: Broaden label to early-stage adjuvant setting', tppAspect: 'Improved DFS over SoC', stakeholder: 'Clinicians, Payers', evidenceType: 'CT', priority: 'H', functionGenerating: 'Clinical', whenNeeded: 'Launch + 2 yrs' },
      { id: 'ies3', pillar: 'Strategic Pillar 3: Real-world evidence on CNS metastases prevention', tppAspect: 'CNS efficacy claims', stakeholder: 'Clinicians, Patients', evidenceType: 'Observational', priority: 'M', functionGenerating: 'Epidemiology', whenNeeded: 'Launch + 1 yr' }
    ]
  },
  keyDependencies: 'Dependency on shared resource pool in Asia (Clinical Ops) and regulatory approval of the Phase II protocol amendment.',
  hioCommentary: {
    actuals: 'Strategic investment in early-stage clinical milestones led to marginal overspends in 2024, which have been effectively mitigated by operational cost-savings identified in the North American supply chain.',
    budget: 'The current budget trajectory aligns with the board-approved forecast, with variances primarily driven by phasing shifts in clinical supply and external partner milestones.'
  }
};

type DeckContextType = {
  data: GovernanceData;
  updateData: (updates: Partial<GovernanceData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  error: string | null;
};

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<GovernanceData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching from Snowflake backend
    const fetchData = async () => {
      try {
        // Hardcoded project ID for demonstration
        const projectId = 'GSK4425689'; 
        const response = await fetch(`/api/governance-data/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const backendData = await response.json();
        setData(backendData);
      } catch (err) {
        console.warn('Backend fetch failed, using fallback data:', err);
        setError('Running in offline/fallback mode. Changes will not be saved to Snowflake.');
        // data is already initialData, so we don't need to overwrite it unless we want to.
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = (updates: Partial<GovernanceData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <DeckContext.Provider value={{ data, updateData, currentStep, setCurrentStep, isLoading, error }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};
