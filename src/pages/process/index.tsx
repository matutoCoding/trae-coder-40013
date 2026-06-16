import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import ProcessCard from '@/components/ProcessCard';
import { processList } from '@/data/processes';
import { ProcessStatus } from '@/types';

type FilterType = 'all' | ProcessStatus;

const filters: Array<{ key: FilterType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '进行中' },
  { key: 'done', label: '已完成' },
  { key: 'pending', label: '待开始' }
];

const ProcessPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredProcesses = useMemo(() => {
    if (activeFilter === 'all') return processList;
    return processList.filter(p => p.status === activeFilter);
  }, [activeFilter]);

  const summary = useMemo(() => ({
    total: processList.length,
    done: processList.filter(p => p.status === 'done').length,
    active: processList.filter(p => p.status === 'active').length,
    pending: processList.filter(p => p.status === 'pending').length
  }), []);

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
        <View className={styles.filterTabs}>
          {filters.map(f => (
            <View
              key={f.key}
              className={classnames(
                styles.filterTab,
                activeFilter === f.key && styles.filterTabActive
              )}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </View>

        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryValue, styles.colorPrimary)}>
              {summary.total}
            </Text>
            <Text className={styles.summaryLabel}>总工序</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryValue, styles.colorSuccess)}>
              {summary.done}
            </Text>
            <Text className={styles.summaryLabel}>已完成</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryValue, styles.colorWarning)}>
              {summary.active}
            </Text>
            <Text className={styles.summaryLabel}>进行中</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryValue, styles.colorTertiary)}>
              {summary.pending}
            </Text>
            <Text className={styles.summaryLabel}>待开始</Text>
          </View>
        </View>

        {filteredProcesses.length > 0 ? (
          filteredProcesses.map(p => (
            <ProcessCard key={p.key} process={p} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无工序数据</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProcessPage;
