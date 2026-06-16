export type ProcessStatus = 'pending' | 'active' | 'done';

export type ProcessKey =
  | 'wire_incoming'
  | 'coiling'
  | 'stress_relief'
  | 'end_grinding'
  | 'setting'
  | 'load_test'
  | 'surface_treatment';

export interface ProcessModule {
  key: ProcessKey;
  name: string;
  shortName: string;
  description: string;
  order: number;
  status: ProcessStatus;
  progress: number;
  todayCount: number;
  totalCount: number;
  subItems: string[];
  fields: ProcessField[];
}

export interface ProcessField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  unit?: string;
  options?: string[];
}

export interface ProductionRecord {
  id: string;
  batchNo: string;
  springModel: string;
  processKey: ProcessKey;
  processName: string;
  operator: string;
  startTime: string;
  endTime?: string;
  status: ProcessStatus;
  quantity: number;
  passed: number;
  failed: number;
  remark?: string;
  data: Record<string, string | number>;
}

export interface StatItem {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
}
