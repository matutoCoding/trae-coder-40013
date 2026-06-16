import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const menuGroups = [
  {
    title: '生产管理',
    items: [
      { icon: '📋', label: '我的工单', color: '#2563EB' },
      { icon: '🔧', label: '设备管理', color: '#0891B2' },
      { icon: '📊', label: '产量统计', color: '#059669' }
    ]
  },
  {
    title: '质量管理',
    items: [
      { icon: '✅', label: '质量报告', color: '#059669' },
      { icon: '⚠️', label: '异常记录', color: '#D97706' },
      { icon: '📝', label: '检验标准', color: '#7C3AED' }
    ]
  },
  {
    title: '系统',
    items: [
      { icon: '⚙️', label: '系统设置', color: '#64748B' },
      { icon: '❓', label: '帮助中心', color: '#64748B' },
      { icon: 'ℹ️', label: '关于我们', color: '#64748B' }
    ]
  }
];

const MinePage: React.FC = () => {
  const handleMenuClick = (label: string) => {
    Taro.showToast({ title: `${label}功能开发中`, icon: 'none' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>张</Text>
          </View>
          <View className={styles.userDetail}>
            <Text className={styles.userName}>张工程师</Text>
            <Text className={styles.userRole}>生产主管 · 技术部</Text>
            <Text className={styles.userId}>工号: EMP2024001</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>156</Text>
          <Text className={styles.statLabel}>今日处理</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>2,840</Text>
          <Text className={styles.statLabel}>本月产量</Text>
        </View>
        <View className={styles.statDivider} />
        <View className={styles.statItem}>
          <Text className={styles.statValue}>98.2%</Text>
          <Text className={styles.statLabel}>合格率</Text>
        </View>
      </View>

      {menuGroups.map(group => (
        <View key={group.title}>
          <Text style={{ padding: '0 32rpx', fontSize: '24rpx', color: '#94A3B8', marginBottom: '8rpx' }}>
            {group.title}
          </Text>
          <View className={styles.menuGroup}>
            {group.items.map((item, idx) => (
              <View
                key={item.label}
                className={styles.menuItem}
                onClick={() => handleMenuClick(item.label)}
              >
                <View
                  className={styles.menuIcon}
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  {item.icon}
                </View>
                <Text className={styles.menuText}>{item.label}</Text>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text className={styles.versionText}>弹簧生产管理系统 v1.0.0</Text>
    </ScrollView>
  );
};

export default MinePage;
