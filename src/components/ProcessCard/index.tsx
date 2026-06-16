import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { ProcessModule } from '@/types';
import { getStatusText, getStatusColor, getStatusBgColor } from '@/utils';

interface ProcessCardProps {
  process: ProcessModule;
  showProgress?: boolean;
}

const iconMap: Record<string, string> = {
  wire_incoming: '⦿',
  coiling: '◎',
  stress_relief: '♨',
  end_grinding: '◇',
  setting: '⬇',
  load_test: '⚖',
  surface_treatment: '✦'
};

const ProcessCard: React.FC<ProcessCardProps> = ({ process, showProgress = true }) => {
  const statusColor = getStatusColor(process.status);
  const statusBg = getStatusBgColor(process.status);

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/process-detail/index?key=${process.key}`
    });
  };

  return (
    <View className={styles.processCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.iconWrap} style={{ backgroundColor: `${statusColor}15` }}>
          <Text className={styles.icon} style={{ color: statusColor }}>
            {iconMap[process.key] || '○'}
          </Text>
        </View>
        <View className={styles.headerInfo}>
          <View className={styles.titleRow}>
            <Text className={styles.orderNo}>{String(process.order).padStart(2, '0')}</Text>
            <Text className={styles.name}>{process.name}</Text>
          </View>
          <Text className={styles.description}>{process.description}</Text>
        </View>
        <View
          className={styles.statusBadge}
          style={{ backgroundColor: statusBg, color: statusColor }}
        >
          {getStatusText(process.status)}
        </View>
      </View>

      <View className={styles.subItems}>
        {process.subItems.map((item, idx) => (
          <View key={idx} className={styles.subItem}>
            <Text className={styles.subItemDot} style={{ backgroundColor: statusColor }} />
            <Text className={styles.subItemText}>{item}</Text>
          </View>
        ))}
      </View>

      {showProgress && (
        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>完成进度</Text>
            <Text className={styles.progressValue} style={{ color: statusColor }}>
              {process.progress}%
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${process.progress}%`, backgroundColor: statusColor }}
            />
          </View>
        </View>
      )}

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>今日产量</Text>
          <Text className={styles.statValue}>{process.todayCount}</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statLabel}>累计产量</Text>
          <Text className={styles.statValue}>{process.totalCount}</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={classnames(styles.statItem, styles.arrowItem)}>
          <Text className={styles.enterText}>进入</Text>
          <Text className={styles.arrow}>→</Text>
        </View>
      </View>
    </View>
  );
};

export default ProcessCard;
