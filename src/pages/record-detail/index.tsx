import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import * as store from '@/store';
import { getProcessByKey as getProcessByKeyStatic } from '@/data/processes';
import { getStatusText, calculatePassRate } from '@/utils';

const RecordDetailPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params.id;
  const [record, setRecord] = useState<any>(null);

  const loadRecord = () => {
    console.log('[RecordDetail] 加载记录:', recordId);
    if (!recordId) {
      console.warn('[RecordDetail] 缺少记录ID');
      return;
    }
    const r = store.getRecordById(recordId);
    console.log('[RecordDetail] 查询结果:', r);
    setRecord(r || null);
  };

  useEffect(() => {
    loadRecord();
  }, [recordId]);

  useDidShow(() => {
    loadRecord();
  });

  const process = useMemo(() => {
    if (!record) return undefined;
    const p = store.getProcessByKey(record.processKey);
    if (p) return p;
    return getProcessByKeyStatic(record.processKey);
  }, [record]);

  if (!record) {
    return (
      <View className={styles.page}>
        <View className={styles.container}>
          <View style={{ padding: '128rpx 32rpx', textAlign: 'center' }}>
            <Text style={{ fontSize: '100rpx', color: '#CBD5E1', display: 'block', marginBottom: '24rpx' }}>📝</Text>
            <Text style={{ fontSize: '32rpx', color: '#94A3B8', display: 'block', marginBottom: '8rpx' }}>
              记录不存在
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#CBD5E1' }}>
              ID: {recordId || '未指定'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const passRate = record.status === 'done' && record.quantity > 0
    ? calculatePassRate(record.passed, record.quantity)
    : '-';
  const fieldLabels = process?.fields || [];
  const recordDataEntries = Object.entries(record.data || {});

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        <View className={styles.headerCard}>
          <View className={styles.headerTop}>
            <View className={styles.batchInfo}>
              <Text className={styles.batchNo}>{record.batchNo || '-'}</Text>
              <Text className={styles.springModel}>型号：{record.springModel || '-'}</Text>
            </View>
            <View className={styles.statusBadge}>
              {getStatusText(record.status)}
            </View>
          </View>
          <View className={styles.processTagRow}>
            <View className={styles.processTag}>{record.processName || '-'}</View>
            <Text className={styles.operatorTag}>操作人：{record.operator || '-'}</Text>
          </View>
        </View>

        <View className={styles.metricsGrid}>
          <View className={styles.metricItem}>
            <Text className={styles.metricValue}>{record.quantity ?? 0}</Text>
            <Text className={styles.metricLabel}>数量</Text>
          </View>
          <View className={styles.metricItem}>
            <Text className={classnames(styles.metricValue, styles.metricSuccess)}>
              {record.status === 'done' ? (record.passed ?? 0) : '-'}
            </Text>
            <Text className={styles.metricLabel}>合格</Text>
          </View>
          <View className={styles.metricItem}>
            <Text className={classnames(styles.metricValue, styles.metricWarning)}>
              {record.status === 'done' ? (record.failed ?? 0) : '-'}
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

        {recordDataEntries.length > 0 && (
          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleBar} />
              <Text>详细数据</Text>
            </View>
            {recordDataEntries.map(([key, value]) => {
              if (value === '' || value === null || value === undefined) return null;
              const field = fieldLabels.find(f => f.key === key);
              const label = field?.label || key;
              const unit = field?.unit;
              return (
                <View key={key} className={styles.dataRow}>
                  <Text className={styles.dataLabel}>{label}</Text>
                  <View className={styles.dataValueWithUnit}>
                    <Text className={styles.dataValue}>{String(value)}</Text>
                    {unit && <Text className={styles.dataUnit}>{unit}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {record.remark && record.remark.trim() && (
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
              <Text className={styles.timeValue}>{record.startTime || '-'}</Text>
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
