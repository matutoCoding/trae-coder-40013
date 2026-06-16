import Taro from '@tarojs/taro';
import { ProductionRecord, ProcessModule, ProcessKey } from '@/types';
import { processList as mockProcesses } from '@/data/processes';
import { recordList as mockRecordData } from '@/data/records';

const STORAGE_KEY_RECORDS = 'spring_records';
const STORAGE_KEY_PROCESSES = 'spring_processes';
const STORAGE_KEY_INIT = 'spring_init_done';

const initStorage = () => {
  try {
    const initDone = Taro.getStorageSync(STORAGE_KEY_INIT);
    if (!initDone) {
      console.log('[Store] 首次初始化，写入示例数据');
      Taro.setStorageSync(STORAGE_KEY_RECORDS, JSON.stringify(mockRecordData));
      Taro.setStorageSync(STORAGE_KEY_PROCESSES, JSON.stringify(mockProcesses));
      Taro.setStorageSync(STORAGE_KEY_INIT, '1');
    }
  } catch (e) {
    console.error('[Store] 初始化存储失败:', e);
  }
};

initStorage();

export const getRecords = (): ProductionRecord[] => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY_RECORDS);
    if (data) {
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
  } catch (e) {
    console.error('[Store] 获取记录失败:', e);
  }
  return mockRecordData;
};

export const getRecordById = (id: string): ProductionRecord | undefined => {
  const records = getRecords();
  return records.find(r => r.id === id);
};

export const getRecordsByBatchNo = (batchNo: string): ProductionRecord[] => {
  const records = getRecords();
  return records
    .filter(r => r.batchNo === batchNo)
    .sort((a, b) => {
      const processOrder: Record<string, number> = {
        wire_incoming: 1, coiling: 2, stress_relief: 3,
        end_grinding: 4, setting: 5, load_test: 6, surface_treatment: 7
      };
      return (processOrder[a.processKey] || 99) - (processOrder[b.processKey] || 99);
    });
};

export const addRecord = (record: ProductionRecord): ProductionRecord[] => {
  try {
    const records = getRecords();
    records.unshift(record);
    Taro.setStorageSync(STORAGE_KEY_RECORDS, JSON.stringify(records));
    console.log('[Store] 新增记录成功:', record.id, '当前总数:', records.length);
    return records;
  } catch (e) {
    console.error('[Store] 新增记录失败:', e);
    return getRecords();
  }
};

export const updateRecord = (id: string, updates: Partial<ProductionRecord>): ProductionRecord[] => {
  try {
    const records = getRecords();
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) {
      records[idx] = { ...records[idx], ...updates };
      Taro.setStorageSync(STORAGE_KEY_RECORDS, JSON.stringify(records));
    }
    return records;
  } catch (e) {
    console.error('[Store] 更新记录失败:', e);
    return getRecords();
  }
};

export const getProcesses = (): ProcessModule[] => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY_PROCESSES);
    if (data) {
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
  } catch (e) {
    console.error('[Store] 获取工序失败:', e);
  }
  return mockProcesses;
};

export const getProcessByKey = (key: string): ProcessModule | undefined => {
  const processes = getProcesses();
  return processes.find(p => p.key === key);
};

export const updateProcessStats = (
  processKey: string,
  updates: Partial<Pick<ProcessModule, 'todayCount' | 'totalCount' | 'progress' | 'status'>>
): ProcessModule[] => {
  try {
    const processes = getProcesses();
    const idx = processes.findIndex(p => p.key === processKey);
    if (idx >= 0) {
      const current = processes[idx];
      processes[idx] = {
        ...current,
        todayCount: (current.todayCount || 0) + (updates.todayCount || 0),
        totalCount: (current.totalCount || 0) + (updates.totalCount || 0),
        progress: updates.progress !== undefined ? updates.progress : current.progress,
        status: updates.status || current.status
      };
      Taro.setStorageSync(STORAGE_KEY_PROCESSES, JSON.stringify(processes));
      console.log('[Store] 更新工序统计成功:', processKey, processes[idx]);
    }
    return processes;
  } catch (e) {
    console.error('[Store] 更新工序统计失败:', e);
    return getProcesses();
  }
};

export const recalcAllProcessStats = (): ProcessModule[] => {
  try {
    const records = getRecords();
    const processes = getProcesses();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const processOrder: Record<string, number> = {
      wire_incoming: 1, coiling: 2, stress_relief: 3,
      end_grinding: 4, setting: 5, load_test: 6, surface_treatment: 7
    };

    const updated = processes.map(p => {
      const pRecords = records.filter(r => r.processKey === p.key);
      const todayRecords = pRecords.filter(r => (r.startTime || '').startsWith(todayStr));
      const todayCount = todayRecords.reduce((s, r) => s + (r.quantity || 0), 0);
      const totalCount = pRecords.reduce((s, r) => s + (r.quantity || 0), 0);

      const allKeys = Object.keys(processOrder) as ProcessKey[];
      const myOrder = processOrder[p.key] || 99;
      const prevKeys = allKeys.filter(k => (processOrder[k] || 99) < myOrder);
      const prevDone = prevKeys.every(k => {
        const prevRecords = records.filter(r => r.processKey === k && r.status === 'done');
        return prevRecords.length > 0;
      });
      const hasAny = pRecords.length > 0;
      const allDone = pRecords.length > 0 && pRecords.every(r => r.status === 'done');

      let status = p.status;
      if (allDone) status = 'done';
      else if (hasAny) status = 'active';
      else if (prevDone) status = 'active';
      else status = 'pending';

      const progress = totalCount > 0
        ? Math.min(100, Math.round((pRecords.filter(r => r.status === 'done').length / Math.max(1, pRecords.length)) * 100))
        : (prevDone ? 0 : 0);

      return { ...p, todayCount, totalCount, progress, status };
    });

    Taro.setStorageSync(STORAGE_KEY_PROCESSES, JSON.stringify(updated));
    console.log('[Store] 重算所有工序统计完成');
    return updated;
  } catch (e) {
    console.error('[Store] 重算工序统计失败:', e);
    return getProcesses();
  }
};

export const getTodayStatsByProcess = (): Record<string, { count: number; qty: number; failed: number }> => {
  const records = getRecords();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayRecords = records.filter(r => (r.startTime || '').startsWith(todayStr));

  const result: Record<string, { count: number; qty: number; failed: number }> = {};
  todayRecords.forEach(r => {
    if (!result[r.processKey]) {
      result[r.processKey] = { count: 0, qty: 0, failed: 0 };
    }
    result[r.processKey].count += 1;
    result[r.processKey].qty += r.quantity || 0;
    result[r.processKey].failed += r.failed || 0;
  });
  return result;
};

export const getWeeklyTrend = (): Array<{ date: string; qty: number }> => {
  const records = getRecords();
  const result: Array<{ date: string; qty: number }> = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    const dayQty = records
      .filter(r => (r.startTime || '').startsWith(dateStr))
      .reduce((s, r) => s + (r.quantity || 0), 0);
    result.push({ date: dayLabel, qty: dayQty });
  }
  return result;
};

export const clearAllData = () => {
  try {
    Taro.removeStorageSync(STORAGE_KEY_RECORDS);
    Taro.removeStorageSync(STORAGE_KEY_PROCESSES);
    Taro.removeStorageSync(STORAGE_KEY_INIT);
    console.log('[Store] 已清除所有数据');
  } catch (e) {
    console.error('[Store] 清除数据失败:', e);
  }
};
