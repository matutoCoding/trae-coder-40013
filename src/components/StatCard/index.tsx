import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  trend,
  trendValue,
  color = '#2563EB',
  icon
}) => {
  return (
    <View className={styles.statCard}>
      <View className={styles.iconCircle} style={{ backgroundColor: `${color}15` }}>
        <Text className={styles.iconText} style={{ color }}>{icon || '◆'}</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.label}>{label}</Text>
        <View className={styles.valueRow}>
          <Text className={styles.value} style={{ color }}>{value}</Text>
          {unit && <Text className={styles.unit}>{unit}</Text>}
        </View>
        {trendValue && (
          <View className={styles.trendRow}>
            <Text className={classnames(styles.trend, trend === 'up' ? styles.trendUp : styles.trendDown)}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StatCard;
