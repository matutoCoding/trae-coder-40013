import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Input, ScrollView, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import RecordItem from '@/components/RecordItem';
import { useRecords } from '@/hooks/useSpringStore';
import { ProcessKey, ProcessStatus } from '@/types';

type ProcessFilter = 'all' | ProcessKey;
type StatusFilter = 'all' | ProcessStatus;

const processFilters: Array<{ key: ProcessFilter; label: string }> = [
  { key: 'all', label: '全部工序' },
  { key: 'wire_incoming', label: '线材进厂' },
  { key: 'coiling', label: '卷簧成型' },
  { key: 'stress_relief', label: '去应力' },
  { key: 'end_grinding', label: '端面磨削' },
  { key: 'setting', label: '立定处理' },
  { key: 'load_test', label: '负荷检测' },
  { key: 'surface_treatment', label: '表面处理' }
];

const statusFilters: Array<{ key: StatusFilter; label: string }> = [
  { key: 'all', label: '全部状态' },
  { key: 'done', label: '已完成' },
  { key: 'active', label: '进行中' },
  { key: 'pending', label: '待开始' }
];

const RecordsPage: React.FC = () => {
  const { records, refresh } = useRecords();
  const [searchText, setSearchText] = useState('');
  const [activeProcess, setActiveProcess] = useState<ProcessFilter>('all');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filterRef = useRef({ searchText, activeProcess, activeStatus, dateStart, dateEnd });
  filterRef.current = { searchText, activeProcess, activeStatus, dateStart, dateEnd };

  useDidShow(() => {
    refresh();
  });

  const filteredRecords = useMemo(() => {
    let list = [...records];

    if (activeProcess !== 'all') {
      list = list.filter(r => r.processKey === activeProcess);
    }

    if (activeStatus !== 'all') {
      list = list.filter(r => r.status === activeStatus);
    }

    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      list = list.filter(
        r =>
          (r.batchNo || '').toLowerCase().includes(keyword) ||
          (r.springModel || '').toLowerCase().includes(keyword) ||
          (r.operator || '').toLowerCase().includes(keyword)
      );
    }

    if (dateStart) {
      list = list.filter(r => (r.startTime || '') >= dateStart);
    }
    if (dateEnd) {
      const endWithTime = dateEnd.length === 10 ? dateEnd + ' 23:59' : dateEnd;
      list = list.filter(r => (r.startTime || '') <= endWithTime);
    }

    return list;
  }, [searchText, activeProcess, activeStatus, dateStart, dateEnd, records]);

  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const done = filteredRecords.filter(r => r.status === 'done').length;
    const totalQty = filteredRecords.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const totalFailed = filteredRecords.reduce((sum, r) => sum + (r.failed || 0), 0);
    return { total, done, totalQty, totalFailed };
  }, [filteredRecords]);

  const hasActiveFilters = activeProcess !== 'all' || activeStatus !== 'all' || dateStart || dateEnd;

  const handleRefresh = () => {
    refresh();
    Taro.showToast({ title: '刷新成功', icon: 'success' });
    Taro.stopPullDownRefresh();
  };

  const clearFilters = () => {
    setActiveProcess('all');
    setActiveStatus('all');
    setDateStart('');
    setDateEnd('');
    setSearchText('');
  };

  const onDateStartChange = (e) => {
    setDateStart(e.detail.value);
  };

  const onDateEndChange = (e) => {
    setDateEnd(e.detail.value);
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresh={handleRefresh}
    >
      <View className={styles.container}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索批号、型号、操作人"
            placeholderClass={styles.searchInputPlaceholder}
            value={searchText}
            onInput={e => setSearchText(e.detail.value)}
          />
          <View
            className={classnames(styles.filterToggle, showFilters && styles.filterToggleActive)}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Text className={styles.filterToggleText}>筛选</Text>
          </View>
        </View>

        {showFilters && (
          <View className={styles.filterPanel}>
            <View className={styles.filterSection}>
              <Text className={styles.filterLabel}>工序类型</Text>
              <View className={styles.filterChips}>
                {processFilters.map(f => (
                  <View
                    key={f.key}
                    className={classnames(
                      styles.chip,
                      activeProcess === f.key && styles.chipActive
                    )}
                    onClick={() => setActiveProcess(f.key)}
                  >
                    {f.label}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.filterSection}>
              <Text className={styles.filterLabel}>记录状态</Text>
              <View className={styles.filterChips}>
                {statusFilters.map(f => (
                  <View
                    key={f.key}
                    className={classnames(
                      styles.chip,
                      activeStatus === f.key && styles.chipActive
                    )}
                    onClick={() => setActiveStatus(f.key)}
                  >
                    {f.label}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.filterSection}>
              <Text className={styles.filterLabel}>日期范围</Text>
              <View className={styles.dateRow}>
                <Picker mode="date" onChange={onDateStartChange} value={dateStart || undefined}>
                  <View className={styles.dateInput}>
                    <Text className={classnames(!dateStart && styles.datePlaceholder)}>
                      {dateStart || '开始日期'}
                    </Text>
                  </View>
                </Picker>
                <Text className={styles.dateSeparator}>至</Text>
                <Picker mode="date" onChange={onDateEndChange} value={dateEnd || undefined}>
                  <View className={styles.dateInput}>
                    <Text className={classnames(!dateEnd && styles.datePlaceholder)}>
                      {dateEnd || '结束日期'}
                    </Text>
                  </View>
                </Picker>
              </View>
            </View>

            {hasActiveFilters && (
              <View className={styles.clearRow} onClick={clearFilters}>
                <Text className={styles.clearText}>清除所有筛选</Text>
              </View>
            )}
          </View>
        )}

        <View className={styles.statsOverview}>
          <View className={styles.overviewHeader}>
            <Text className={styles.overviewTitle}>数据概览</Text>
            {hasActiveFilters && (
              <Text className={styles.filteredHint}>已筛选</Text>
            )}
          </View>
          <View className={styles.overviewGrid}>
            <View className={styles.overviewItem}>
              <Text className={styles.overviewValue}>{stats.total}</Text>
              <Text className={styles.overviewLabel}>记录数</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text className={classnames(styles.overviewValue, styles.overviewSuccess)}>
                {stats.done}
              </Text>
              <Text className={styles.overviewLabel}>已完成</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text className={classnames(styles.overviewValue, styles.overviewPrimary)}>
                {stats.totalQty}
              </Text>
              <Text className={styles.overviewLabel}>总数量</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text className={classnames(styles.overviewValue, stats.totalFailed > 0 ? styles.overviewWarning : styles.overviewSuccess)}>
                {stats.totalFailed}
              </Text>
              <Text className={styles.overviewLabel}>不合格</Text>
            </View>
          </View>
        </View>

        {filteredRecords.length > 0 ? (
          filteredRecords.map(r => (
            <RecordItem key={r.id} record={r} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>暂无匹配记录</Text>
            <Text style={{ fontSize: '24rpx', color: '#CBD5E1', marginTop: '8rpx', display: 'block' }}>
              试试调整搜索条件或筛选范围
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecordsPage;
