import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import RecordItem from '@/components/RecordItem';
import { recordList } from '@/data/records';
import { processList } from '@/data/processes';
import { ProcessKey, ProcessStatus } from '@/types';

type ProcessFilter = 'all' | ProcessKey;

const statusFilters: Array<{ key: ProcessFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'wire_incoming', label: '线材进厂' },
  { key: 'coiling', label: '卷簧成型' },
  { key: 'stress_relief', label: '去应力' },
  { key: 'end_grinding', label: '端面磨削' },
  { key: 'setting', label: '立定处理' },
  { key: 'load_test', label: '负荷检测' },
  { key: 'surface_treatment', label: '表面处理' }
];

const RecordsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<ProcessFilter>('all');

  const filteredRecords = useMemo(() => {
    let list = [...recordList];

    if (activeFilter !== 'all') {
      list = list.filter(r => r.processKey === activeFilter);
    }

    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      list = list.filter(
        r =>
          r.batchNo.toLowerCase().includes(keyword) ||
          r.springModel.toLowerCase().includes(keyword) ||
          r.operator.toLowerCase().includes(keyword)
      );
    }

    return list;
  }, [searchText, activeFilter]);

  const stats = useMemo(() => {
    const total = recordList.length;
    const done = recordList.filter(r => r.status === 'done').length;
    const totalQty = recordList.reduce((sum, r) => sum + r.quantity, 0);
    return { total, done, totalQty };
  }, []);

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresh={() => {
        Taro.showToast({ title: '刷新成功', icon: 'success' });
        Taro.stopPullDownRefresh();
      }}
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
        </View>

        <ScrollView scrollX className={styles.filterRow}>
          {statusFilters.map(f => (
            <View
              key={f.key}
              className={classnames(
                styles.filterChip,
                activeFilter === f.key && styles.filterChipActive
              )}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </ScrollView>

        <View className={styles.statsOverview}>
          <Text className={styles.overviewTitle}>数据概览</Text>
          <View className={styles.overviewGrid}>
            <View className={styles.overviewItem}>
              <Text className={styles.overviewValue}>{stats.total}</Text>
              <Text className={styles.overviewLabel}>记录总数</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text className={classnames(styles.overviewValue, styles.overviewSuccess)}>
                {stats.done}
              </Text>
              <Text className={styles.overviewLabel}>已完成</Text>
            </View>
            <View className={styles.overviewItem}>
              <Text className={classnames(styles.overviewValue, styles.overviewWarning)}>
                {stats.totalQty}
              </Text>
              <Text className={styles.overviewLabel}>总数量</Text>
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
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecordsPage;
