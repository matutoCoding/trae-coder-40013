import Taro from '@tarojs/taro';
import { ProductionRecord, ProcessModule } from '@/types';
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
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('[Store] 获取记录成功，共', parsed.length, '条');
      return parsed;
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
      console.log('[Store] 更新记录成功:', id);
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
