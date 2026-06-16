import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getRecordById } from '@/data/records';
import { getProcessByKey } from '@/data/processes';
import { getStatusText, calculatePassRate } from '@/utils';

const RecordDetailPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params.id;
  const record = useMemo(() => getRecordById(recordId || ''), [recordId]);
  const process = useMemo(
    () => (record ? getProcessByKey(record.processKey) : undefined),
    [record]
  );

  if (!record) {
    return (
      <View className={styles.page}>
        <View className={styles.container}>
          <Text>记录不存在</Text>
        </View>
      </View>
    );
  }

  const passRate = record.status === 'done' ? calculatePassRate(record.passed, record.quantity) : '-';
  const fieldLabels = process?.fields || [];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        <View className={styles.headerCard}>
          <View className={styles.headerTop}>
            <View className={styles.batchInfo}>
              <Text className={styles.batchNo}>{record.batchNo}</Text>
              <Text className={styles.springModel}>型号：{record.springModel}</Text>
            </View>
            <View className={styles.statusBadge}>
              {getStatusText(record.status)}
            </View>
          </View>
          <View className={styles.processTagRow}>
            <View className={styles.processTag}>{record.processName}</View>
            <Text className={styles.operatorTag}>操作人：{record.operator}</Text>
          </View>
        </View>

        <View className={styles.metricsGrid}>
          <View className={styles.metricItem}>
            <Text className={styles.metricValue}>{record.quantity}</Text>
            <Text className={styles.metricLabel}>数量</Text>
          </View>
          <View className={styles.metricItem}>
            <Text className={classnames(styles.metricValue, styles.metricSuccess)}>
              {record.status === 'done' ? record.passed : '-'}
            </Text>
            <Text className={styles.metricLabel}>合格</Text>
          </View>
          <View className={styles.metricItem}>
            <Text className={classnames(styles.metricValue, styles.metricWarning)}>
              {record.status === 'done' ? record.failed : '-'}
            </Text>
            <Text className={styles.metricLabel}>不合格</Text>
          </View>
          <View className={styles.metricItem}>
            <Text className={classnames(styles.metricValue, styles.metricSuccess)}>
              {passRate}
            </Text>
            <Text className={styles.metricLabel}>合格率</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>详细数据</Text>
          </View>
          {fieldLabels.map(field => {
            const value = record.data[field.key];
            if (value === undefined || value === null || value === '') return null;
            return (
              <View key={field.key} className={styles.dataRow}>
                <Text className={styles.dataLabel}>{field.label}</Text>
                <View className={styles.dataValueWithUnit}>
                  <Text className={styles.dataValue}>{String(value)}</Text>
                  {field.unit && <Text className={styles.dataUnit}>{field.unit}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {record.remark && (
          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleBar} />
              <Text>备注信息</Text>
            </View>
            <View className={styles.remarkSection}>
              <Text className={styles.remarkLabel}>备注说明</Text>
              <Text className={styles.remarkText}>{record.remark}</Text>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>时间信息</Text>
          </View>
          <View className={styles.timeInfo}>
            <View className={styles.timeItem}>
              <Text className={styles.timeLabel}>开始时间</Text>
              <Text className={styles.timeValue}>{record.startTime}</Text>
            </View>
            {record.endTime && (
              <View className={styles.timeItem}>
                <Text className={styles.timeLabel}>结束时间</Text>
                <Text className={styles.timeValue}>{record.endTime}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RecordDetailPage;
