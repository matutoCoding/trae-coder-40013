import { useState, useEffect, useCallback } from 'react';
import { useDidShow } from '@tarojs/taro';
import { ProductionRecord, ProcessModule } from '@/types';
import * as store from '@/store';

export const useRecords = () => {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const data = store.getRecords();
    setRecords(data);
    setLoading(false);
    console.log('[useRecords] 刷新记录:', data.length, '条');
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useDidShow(() => {
    refresh();
  });

  const addNewRecord = useCallback((record: ProductionRecord) => {
    const updated = store.addRecord(record);
    setRecords(updated);
    return updated;
  }, []);

  return { records, loading, refresh, addNewRecord };
};

export const useProcesses = () => {
  const [processes, setProcesses] = useState<ProcessModule[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const data = store.getProcesses();
    setProcesses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useDidShow(() => {
    refresh();
  });

  const updateStats = useCallback((
    processKey: string,
    updates: Partial<Pick<ProcessModule, 'todayCount' | 'totalCount' | 'progress' | 'status'>>
  ) => {
    const updated = store.updateProcessStats(processKey, updates);
    setProcesses(updated);
    return updated;
  }, []);

  const getByKey = useCallback((key: string) => {
    return store.getProcessByKey(key);
  }, []);

  const setProcessesFromStore = useCallback((data: ProcessModule[]) => {
    setProcesses(data);
  }, []);

  return { processes, loading, refresh, updateStats, getByKey, setProcessesFromStore };
};
