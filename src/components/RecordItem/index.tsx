import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ProductionRecord } from '@/types';
import { getStatusText, getStatusColor, getStatusBgColor, calculatePassRate } from '@/utils';

interface RecordItemProps {
  record: ProductionRecord;
}

const RecordItem: React.FC<RecordItemProps> = ({ record }) => {
  const statusColor = getStatusColor(record.status);
  const statusBg = getStatusBgColor(record.status);
  const passRate = record.status === 'done' && record.quantity > 0
    ? calculatePassRate(record.passed, record.quantity)
    : '-';
  const isHighPassRate = record.status === 'done'
    && record.quantity > 0
    && (record.passed / record.quantity) >= 0.95;
  const safeTime = record.startTime && record.startTime.length >= 16
    ? record.startTime.slice(5, 16)
    : record.startTime || '-';
  const hasRemark = !!(record.remark && record.remark.trim().length > 0);

  const handleClick = () => {
    console.log('[RecordItem] 点击记录:', record.id);
    Taro.navigateTo({
      url: `/pages/record-detail/index?id=${record.id}`
    });
  };

  return (
    <View className={styles.recordItem} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.batchInfo}>
          <Text className={styles.batchNo}>{record.batchNo || '-'}</Text>
          <Text className={styles.springModel}>型号：{record.springModel || '-'}</Text>
        </View>
        <View
          className={styles.statusBadge}
          style={{ backgroundColor: statusBg, color: statusColor }}
        >
          {getStatusText(record.status)}
        </View>
      </View>

      <View className={styles.processRow}>
        <View className={styles.processTag}>
          <Text className={styles.processTagText}>{record.processName || '-'}</Text>
        </View>
        <Text className={styles.operator}>操作人：{record.operator || '-'}</Text>
      </View>

      <View className={styles.metrics}>
        <View className={styles.metric}>
          <Text className={styles.metricLabel}>数量</Text>
          <Text className={styles.metricValue}>{record.quantity ?? 0}</Text>
        </View>
        <View className={styles.metric}>
          <Text className={styles.metricLabel}>合格</Text>
          <Text
            className={classnames(
              styles.metricValue,
              record.status === 'done' && styles.passValue
            )}
          >
            {record.status === 'done' ? (record.passed ?? 0) : '-'}
          </Text>
        </View>
        <View className={styles.metric}>
          <Text className={styles.metricLabel}>合格率</Text>
          <Text
            className={classnames(
              styles.metricValue,
              isHighPassRate && styles.passValue
            )}
          >
            {passRate}
          </Text>
        </View>
        <View className={styles.metric}>
          <Text className={styles.metricLabel}>时间</Text>
          <Text className={styles.metricTime}>{safeTime}</Text>
        </View>
      </View>

      {hasRemark && (
        <View className={styles.remarkRow}>
          <Text className={styles.remarkLabel}>备注：</Text>
          <Text className={styles.remarkText}>{record.remark}</Text>
        </View>
      )}
    </View>
  );
};

export default RecordItem;
