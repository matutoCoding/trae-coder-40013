import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import ProcessCard from '@/components/ProcessCard';
import RecordItem from '@/components/RecordItem';
import { processList } from '@/data/processes';
import { recordList } from '@/data/records';
import { ProcessKey } from '@/types';

const quickActions: Array<{ key: ProcessKey | 'all'; label: string; icon: string; color: string }> = [
  { key: 'wire_incoming', label: '线材进厂', icon: '⦿', color: '#2563EB' },
  { key: 'coiling', label: '卷簧成型', icon: '◎', color: '#0891B2' },
  { key: 'stress_relief', label: '去应力', icon: '♨', color: '#D97706' },
  { key: 'end_grinding', label: '端面磨削', icon: '◇', color: '#7C3AED' },
  { key: 'setting', label: '立定处理', icon: '⬇', color: '#059669' },
  { key: 'load_test', label: '负荷检测', icon: '⚖', color: '#DC2626' },
  { key: 'surface_treatment', label: '表面处理', icon: '✦', color: '#0891B2' },
  { key: 'all', label: '全部工序', icon: '▦', color: '#2563EB' }
];

const IndexPage: React.FC = () => {
  const [today] = useState(new Date().toLocaleDateString('zh-CN'));

  const handleQuickAction = (key: ProcessKey | 'all') => {
    if (key === 'all') {
      Taro.switchTab({ url: '/pages/process/index' });
    } else {
      Taro.navigateTo({ url: `/pages/process-detail/index?key=${key}` });
    }
  };

  const activeProcesses = processList.filter(p => p.status === 'active');
  const recentRecords = recordList.slice(0, 3);
  const doneCount = processList.filter(p => p.status === 'done').length;
  const todayTotal = processList.reduce((sum, p) => sum + p.todayCount, 0);
  const totalPassRate = '98.2%';

  const steps = processList.map(p => ({
    label: p.shortName,
    status: p.status
  }));

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
        <View className={styles.heroSection}>
          <Text className={styles.greeting}>今天是 {today}</Text>
          <Text className={styles.title}>弹簧生产管理系统</Text>
          <Text className={styles.subtitle}>高效管理 · 精准追溯 · 品质保障</Text>
        </View>

        <View className={styles.statsGrid}>
          <StatCard
            label="今日产量"
            value={todayTotal}
            unit="件"
            trend="up"
            trendValue="12%"
            color="#2563EB"
            icon="◉"
          />
          <StatCard
            label="完成工序"
            value={`${doneCount}/${processList.length}`}
            color="#059669"
            icon="✓"
          />
          <StatCard
            label="进行中"
            value={activeProcesses.length}
            unit="项"
            color="#D97706"
            icon="▶"
          />
          <StatCard
            label="合格率"
            value={totalPassRate}
            trend="up"
            trendValue="0.3%"
            color="#0891B2"
            icon="★"
          />
        </View>

        <SectionHeader title="快捷入口" />
        <View className={styles.quickSection}>
          <View className={styles.quickGrid}>
            {quickActions.map(action => (
              <View
                key={action.key}
                className={styles.quickItem}
                onClick={() => handleQuickAction(action.key)}
              >
                <View
                  className={styles.quickIcon}
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  {action.icon}
                </View>
                <Text className={styles.quickLabel}>{action.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionHeader title="生产进度" />
        <View className={styles.processTimeline}>
          <View className={styles.timelineSteps}>
            {steps.map((step, idx) => (
              <View key={idx} className={styles.timelineStep}>
                <View
                  className={`${styles.stepCircle} ${
                    step.status === 'done' ? styles.stepDone :
                    step.status === 'active' ? styles.stepActive : styles.stepPending
                  }`}
                >
                  {step.status === 'done' ? '✓' : idx + 1}
                </View>
                <Text className={styles.stepLabel}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionHeader
          title="进行中的工序"
          actionText="查看全部"
          onAction={() => Taro.switchTab({ url: '/pages/process/index' })}
        />
        {activeProcesses.map(p => (
          <ProcessCard key={p.key} process={p} />
        ))}

        <SectionHeader
          title="最近记录"
          actionText="更多"
          onAction={() => Taro.switchTab({ url: '/pages/records/index' })}
        />
        {recentRecords.map(r => (
          <RecordItem key={r.id} record={r} />
        ))}
      </View>
    </ScrollView>
  );
};

export default IndexPage;
