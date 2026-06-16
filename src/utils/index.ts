import { ProcessStatus } from '@/types';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

export const getStatusText = (status: ProcessStatus): string => {
  const map: Record<ProcessStatus, string> = {
    pending: '待开始',
    active: '进行中',
    done: '已完成'
  };
  return map[status];
};

export const getStatusColor = (status: ProcessStatus): string => {
  const map: Record<ProcessStatus, string> = {
    pending: '#94A3B8',
    active: '#2563EB',
    done: '#059669'
  };
  return map[status];
};

export const getStatusBgColor = (status: ProcessStatus): string => {
  const map: Record<ProcessStatus, string> = {
    pending: '#F1F5F9',
    active: '#EFF6FF',
    done: '#ECFDF5'
  };
  return map[status];
};

export const generateId = (): string => {
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REC${timestamp}${random}`;
};

export const calculatePassRate = (passed: number, total: number): string => {
  if (total === 0) return '0%';
  return `${((passed / total) * 100).toFixed(1)}%`;
};
