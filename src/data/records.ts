import { ProductionRecord } from '@/types';

export const recordList: ProductionRecord[] = [
  {
    id: 'REC20260616001',
    batchNo: 'B20260616-001',
    springModel: 'TH-25-120',
    processKey: 'wire_incoming',
    processName: '线材进厂',
    operator: '张工',
    startTime: '2026-06-16 08:30',
    endTime: '2026-06-16 09:15',
    status: 'done',
    quantity: 500,
    passed: 500,
    failed: 0,
    remark: '材质合格，硬度HRC45-48',
    data: {
      wireBatch: 'WB-2026-0615',
      wireDiameter: 2.5,
      hardness: 46,
      material: '60Si2Mn',
      quantity: 500,
      supplier: '宝钢特钢'
    }
  },
  {
    id: 'REC20260616002',
    batchNo: 'B20260616-001',
    springModel: 'TH-25-120',
    processKey: 'coiling',
    processName: '卷簧成型',
    operator: '李师傅',
    startTime: '2026-06-16 09:20',
    endTime: '2026-06-16 11:45',
    status: 'done',
    quantity: 480,
    passed: 472,
    failed: 8,
    remark: '自由高度公差±0.5mm',
    data: {
      springModel: 'TH-25-120',
      outerDiameter: 25,
      freeHeight: 120,
      pitch: 8.5,
      totalCoils: 12,
      activeCoils: 10,
      wireDirection: '右旋',
      quantity: 480
    }
  },
  {
    id: 'REC20260616003',
    batchNo: 'B20260616-001',
    springModel: 'TH-25-120',
    processKey: 'stress_relief',
    processName: '去应力',
    operator: '王工',
    startTime: '2026-06-16 13:00',
    status: 'active',
    quantity: 472,
    passed: 0,
    failed: 0,
    data: {
      batchNo: 'B20260616-001',
      temperature: 260,
      duration: 60,
      furnaceNo: 'F-03',
      quantity: 472,
      operator: '王工'
    }
  },
  {
    id: 'REC20260616004',
    batchNo: 'B20260616-002',
    springModel: 'TH-32-150',
    processKey: 'wire_incoming',
    processName: '线材进厂',
    operator: '张工',
    startTime: '2026-06-16 10:00',
    endTime: '2026-06-16 10:45',
    status: 'done',
    quantity: 300,
    passed: 298,
    failed: 2,
    remark: '线径偏差在允许范围内',
    data: {
      wireBatch: 'WB-2026-0616',
      wireDiameter: 3.2,
      hardness: 47,
      material: '50CrVA',
      quantity: 300,
      supplier: '兴澄特钢'
    }
  },
  {
    id: 'REC20260616005',
    batchNo: 'B20260616-002',
    springModel: 'TH-32-150',
    processKey: 'coiling',
    processName: '卷簧成型',
    operator: '李师傅',
    startTime: '2026-06-16 13:30',
    status: 'active',
    quantity: 298,
    passed: 0,
    failed: 0,
    data: {
      springModel: 'TH-32-150',
      outerDiameter: 32,
      freeHeight: 150,
      pitch: 10.2,
      totalCoils: 14,
      activeCoils: 12,
      wireDirection: '右旋',
      quantity: 298
    }
  },
  {
    id: 'REC20260615001',
    batchNo: 'B20260615-001',
    springModel: 'TH-20-80',
    processKey: 'surface_treatment',
    processName: '表面处理',
    operator: '赵师傅',
    startTime: '2026-06-15 14:00',
    endTime: '2026-06-15 16:30',
    status: 'done',
    quantity: 1000,
    passed: 992,
    failed: 8,
    remark: '发黑均匀，喷丸强度合格',
    data: {
      batchNo: 'B20260615-001',
      treatmentType: '喷丸+发黑',
      shotSize: 0.8,
      shotTime: 15,
      blackeningTemp: 140,
      blackeningTime: 30,
      appearanceCheck: '合格',
      quantity: 1000
    }
  },
  {
    id: 'REC20260615002',
    batchNo: 'B20260615-001',
    springModel: 'TH-20-80',
    processKey: 'load_test',
    processName: '负荷检测',
    operator: '陈质检',
    startTime: '2026-06-15 10:00',
    endTime: '2026-06-15 12:00',
    status: 'done',
    quantity: 100,
    passed: 98,
    failed: 2,
    remark: '抽检合格率98%',
    data: {
      batchNo: 'B20260615-001',
      testLoad: 1500,
      deflection: 25,
      stiffness: 60,
      verticality: 0.3,
      outerDiameterCheck: '合格',
      pitchCheck: '合格',
      sampleCount: 100,
      passed: 98
    }
  },
  {
    id: 'REC20260615003',
    batchNo: 'B20260615-001',
    springModel: 'TH-20-80',
    processKey: 'setting',
    processName: '立定处理',
    operator: '孙工',
    startTime: '2026-06-15 08:00',
    endTime: '2026-06-15 09:30',
    status: 'done',
    quantity: 1000,
    passed: 1000,
    failed: 0,
    data: {
      batchNo: 'B20260615-001',
      settingLoad: 3000,
      settingTime: 30,
      settingCycles: 3,
      heightAfter: 79.5,
      quantity: 1000
    }
  }
];

export const getRecordById = (id: string): ProductionRecord | undefined => {
  return recordList.find(r => r.id === id);
};
