import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getProcessByKey } from '@/data/processes';
import { getStatusText, formatDateTime } from '@/utils';

const ProcessDetailPage: React.FC = () => {
  const router = useRouter();
  const processKey = router.params.key as any;
  const process = useMemo(() => getProcessByKey(processKey), [processKey]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!process) {
    return (
      <View className={styles.page}>
        <View className={styles.container}>
          <Text>工序不存在</Text>
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

  const handleSubmit = () => {
    const requiredFields = process.fields.filter(f => f.required);
    const missing = requiredFields.filter(f => !formData[f.key]);
    if (missing.length > 0) {
      Taro.showToast({ title: `请填写${missing[0].label}`, icon: 'none' });
      return;
    }
    Taro.showToast({ title: '提交成功', icon: 'success' });
    console.log('[ProcessDetail] 提交数据:', formData);
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleReset = () => {
    setFormData({});
    Taro.showToast({ title: '已重置', icon: 'none' });
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
            <Text className={styles.statValue}>{process.todayCount}</Text>
            <Text className={styles.statLabel}>今日产量</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{process.progress}%</Text>
            <Text className={styles.statLabel}>完成进度</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{process.totalCount}</Text>
            <Text className={styles.statLabel}>累计产量</Text>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>数据录入</Text>
          </View>

          {process.fields.map(field => (
            <View key={field.key} className={styles.formItem}>
              <Text className={styles.formLabel}>
                {field.required && <Text className={styles.required}>*</Text>}
                {field.label}
              </Text>

              {field.type === 'text' && (
                <View className={field.unit ? styles.inputWithUnit : ''}>
                  <Input
                    className={styles.formInput}
                    placeholder={field.placeholder || `请输入${field.label}`}
                    value={formData[field.key] || ''}
                    onInput={e => handleInputChange(field.key, e.detail.value)}
                  />
                  {field.unit && <Text className={styles.unitText}>{field.unit}</Text>}
                </View>
              )}

              {field.type === 'number' && (
                <View className={field.unit ? styles.inputWithUnit : ''}>
                  <Input
                    className={styles.formInput}
                    type="digit"
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
          提交记录
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProcessDetailPage;
