import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useProcesses } from '@/hooks/useSpringStore';
import * as store from '@/store';
import { ProductionRecord, ProcessField } from '@/types';
import { getStatusText, generateId, formatDateTime } from '@/utils';

const ProcessDetailPage: React.FC = () => {
  const router = useRouter();
  const processKey = router.params.key as string;
  const { processes, refresh: refreshProcesses, getByKey, setProcessesFromStore } = useProcesses();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useDidShow(() => {
    refreshProcesses();
  });

  const process = useMemo(() => {
    const fromHook = getByKey(processKey);
    if (fromHook) return fromHook;
    return store.getProcessByKey(processKey);
  }, [processKey, processes, getByKey, processKey]);

  if (!process) {
    return (
      <View className={styles.page}>
        <View className={styles.container}>
          <View style={{ padding: '64rpx', textAlign: 'center' }}>
            <Text style={{ fontSize: '48rpx', color: '#CBD5E1', display: 'block', marginBottom: '16rpx' }}>⚠️</Text>
            <Text style={{ fontSize: '32rpx', color: '#94A3B8' }}>工序不存在或已删除</Text>
          </View>
        </View>
      </View>
    );
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSelect = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getFieldValue = (field: ProcessField) => {
    const raw = formData[field.key];
    if (field.type === 'number' && raw !== undefined && raw !== '') {
      const num = Number(raw);
      return isNaN(num) ? raw : num;
    }
    return raw || '';
  };

  const validateForm = (): { ok: boolean; msg?: string } => {
    const requiredFields = process.fields.filter(f => f.required);
    console.log('[ProcessDetail] 必填字段检查:', requiredFields.map(f => f.label));

    for (const field of requiredFields) {
      const value = formData[field.key];
      if (value === undefined || value === null || value.toString().trim() === '') {
        return { ok: false, msg: `请填写【${field.label}】` };
      }
    }

    const numberFields = process.fields.filter(f => f.type === 'number' && formData[f.key] !== undefined && formData[f.key] !== '');
    for (const field of numberFields) {
      const num = Number(formData[field.key]);
      if (isNaN(num)) {
        return { ok: false, msg: `【${field.label}】请输入有效数字` };
      }
    }

    return { ok: true };
  };

  const extractQuantity = (): number => {
    const qtyField = process.fields.find(f => f.key === 'quantity');
    if (qtyField && formData.quantity) {
      const n = Number(formData.quantity);
      if (!isNaN(n) && n > 0) return n;
    }
    const sampleField = process.fields.find(f => f.key === 'sampleCount');
    if (sampleField && formData.sampleCount) {
      const n = Number(formData.sampleCount);
      if (!isNaN(n) && n > 0) return n;
    }
    return 0;
  };

  const extractBatchNo = (): string => {
    if (formData.batchNo) return formData.batchNo;
    if (formData.wireBatch) return formData.wireBatch;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const r = Math.floor(Math.random() * 900 + 100);
    return `B${y}${m}${d}-${r}`;
  };

  const extractSpringModel = (): string => {
    if (formData.springModel) return formData.springModel;
    const od = formData.outerDiameter || formData.wireDiameter || '';
    const fh = formData.freeHeight || '';
    if (od && fh) return `TH-${od}-${fh}`;
    return '未指定型号';
  };

  const extractOperator = (): string => {
    if (formData.operator) return formData.operator;
    return '系统记录';
  };

  const handleSubmit = () => {
    if (submitting) {
      console.log('[ProcessDetail] 正在提交中，忽略重复点击');
      return;
    }

    const validation = validateForm();
    if (!validation.ok) {
      console.log('[ProcessDetail] 校验失败:', validation.msg);
      Taro.showToast({ title: validation.msg || '请完善表单', icon: 'none', duration: 2000 });
      return;
    }

    setSubmitting(true);
    console.log('[ProcessDetail] 开始提交，表单数据:', formData);

    try {
      const now = new Date();
      const nowStr = formatDateTime(now);
      const quantity = extractQuantity();
      const batchNo = extractBatchNo();
      const springModel = extractSpringModel();
      const operator = extractOperator();

      const recordData: Record<string, string | number> = {};
      process.fields.forEach(field => {
        const v = getFieldValue(field);
        if (v !== '' && v !== undefined && v !== null) {
          recordData[field.key] = v;
        }
      });

      const newRecord: ProductionRecord = {
        id: generateId(),
        batchNo,
        springModel,
        processKey: process.key as any,
        processName: process.name,
        operator,
        startTime: nowStr,
        endTime: nowStr,
        status: 'done',
        quantity: quantity,
        passed: recordData.passed !== undefined ? Number(recordData.passed) : quantity,
        failed: recordData.passed !== undefined ? Math.max(0, quantity - Number(recordData.passed)) : 0,
        remark: formData.remark || undefined,
        data: recordData
      };

      console.log('[ProcessDetail] 准备保存记录:', newRecord);

      const updatedRecords = store.addRecord(newRecord);
      console.log('[ProcessDetail] 记录保存成功，当前记录总数:', updatedRecords.length);

      const recalculated = store.recalcAllProcessStats();
      console.log('[ProcessDetail] 从记录重算工序统计完成，避免双计入');

      setProcessesFromStore(recalculated);

      Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        setSubmitting(false);
        console.log('[ProcessDetail] 返回上一页');
        Taro.navigateBack({ delta: 1 });
      }, 1500);

    } catch (err) {
      console.error('[ProcessDetail] 提交异常:', err);
      setSubmitting(false);
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  };

  const handleReset = () => {
    console.log('[ProcessDetail] 重置表单');
    Taro.showModal({
      title: '确认重置',
      content: '重置将清除所有已填写内容，确定继续吗？',
      confirmText: '确定重置',
      cancelText: '取消',
      confirmColor: '#DC2626',
      success: (res) => {
        if (res.confirm) {
          setFormData({});
          Taro.showToast({ title: '已重置', icon: 'none' });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.container}>
        <View className={styles.processHeader}>
          <View className={styles.headerTop}>
            <View className={styles.orderBadge}>
              {String(process.order).padStart(2, '0')}
            </View>
            <View className={styles.headerInfo}>
              <Text className={styles.processName}>{process.name}</Text>
              <Text className={styles.processDesc}>{process.description}</Text>
            </View>
            <View className={styles.statusBadge}>
              {getStatusText(process.status)}
            </View>
          </View>
          <View className={styles.subItemsList}>
            {process.subItems.map((item, idx) => (
              <View key={idx} className={styles.subItemTag}>
                {item}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{process.todayCount || 0}</Text>
            <Text className={styles.statLabel}>今日产量</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{process.progress || 0}%</Text>
            <Text className={styles.statLabel}>完成进度</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{process.totalCount || 0}</Text>
            <Text className={styles.statLabel}>累计产量</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>数据录入</Text>
            <Text style={{ fontSize: '24rpx', color: '#94A3B8', marginLeft: '12rpx', fontWeight: 'normal' }}>
              （带*为必填）
            </Text>
          </View>

          {process.fields.map(field => (
            <View key={field.key} className={styles.formItem}>
              <Text className={styles.formLabel}>
                {field.required && <Text className={styles.required}>*</Text>}
                {field.label}
              </Text>

              {(field.type === 'text' || field.type === 'number') && (
                <View className={field.unit ? styles.inputWithUnit : ''}>
                  <Input
                    className={styles.formInput}
                    type={field.type === 'number' ? 'digit' : 'text'}
                    placeholder={field.placeholder || `请输入${field.label}`}
                    value={formData[field.key] || ''}
                    onInput={e => handleInputChange(field.key, e.detail.value)}
                  />
                  {field.unit && <Text className={styles.unitText}>{field.unit}</Text>}
                </View>
              )}

              {field.type === 'select' && field.options && (
                <View className={styles.selectRow}>
                  {field.options.map(opt => (
                    <View
                      key={opt}
                      className={classnames(
                        styles.selectOption,
                        formData[field.key] === opt && styles.selectOptionActive
                      )}
                      onClick={() => handleSelect(field.key, opt)}
                    >
                      {opt}
                    </View>
                  ))}
                </View>
              )}

              {field.type === 'textarea' && (
                <Textarea
                  className={styles.formTextarea}
                  placeholder={field.placeholder || `请输入${field.label}`}
                  value={formData[field.key] || ''}
                  onInput={e => handleInputChange(field.key, e.detail.value)}
                  maxlength={500}
                />
              )}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleReset}>
          重置
        </Button>
        <Button className={styles.primaryBtn} onClick={handleSubmit}>
          {submitting ? '提交中...' : '提交记录'}
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProcessDetailPage;
