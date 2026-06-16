import { ProcessModule, ProcessKey } from '@/types';

export const processList: ProcessModule[] = [
  {
    key: 'wire_incoming',
    name: '线材进厂',
    shortName: '线材',
    description: '弹簧钢丝进厂检验与入库管理',
    order: 1,
    status: 'done',
    progress: 100,
    todayCount: 156,
    totalCount: 2840,
    subItems: ['弹簧钢丝进厂', '线径硬度检验'],
    fields: [
      { key: 'wireBatch', label: '钢丝批次号', type: 'text', placeholder: '请输入批次号', required: true },
      { key: 'wireDiameter', label: '钢丝直径', type: 'number', placeholder: '请输入', unit: 'mm', required: true },
      { key: 'hardness', label: '硬度值', type: 'number', placeholder: '请输入HRC值', unit: 'HRC', required: true },
      { key: 'material', label: '材质牌号', type: 'select', options: ['65Mn', '60Si2Mn', '50CrVA', 'SWC', 'SWP-B'], required: true },
      { key: 'quantity', label: '进厂数量', type: 'number', placeholder: '请输入', unit: 'kg', required: true },
      { key: 'supplier', label: '供应商', type: 'text', placeholder: '请输入供应商名称' },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  },
  {
    key: 'coiling',
    name: '卷簧成型',
    shortName: '卷簧',
    description: '弹簧卷绕成型，节距与自由高度控制',
    order: 2,
    status: 'active',
    progress: 68,
    todayCount: 89,
    totalCount: 1520,
    subItems: ['卷簧节距设置', '自由高度控制'],
    fields: [
      { key: 'springModel', label: '弹簧型号', type: 'text', placeholder: '请输入型号', required: true },
      { key: 'outerDiameter', label: '弹簧外径', type: 'number', placeholder: '请输入', unit: 'mm', required: true },
      { key: 'freeHeight', label: '自由高度', type: 'number', placeholder: '请输入', unit: 'mm', required: true },
      { key: 'pitch', label: '节距', type: 'number', placeholder: '请输入', unit: 'mm', required: true },
      { key: 'totalCoils', label: '总圈数', type: 'number', placeholder: '请输入', unit: '圈', required: true },
      { key: 'activeCoils', label: '有效圈数', type: 'number', placeholder: '请输入', unit: '圈', required: true },
      { key: 'wireDirection', label: '旋向', type: 'select', options: ['左旋', '右旋'], required: true },
      { key: 'quantity', label: '成型数量', type: 'number', placeholder: '请输入数量', required: true },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  },
  {
    key: 'stress_relief',
    name: '去应力',
    shortName: '去应力',
    description: '去应力回火处理，消除卷簧内应力',
    order: 3,
    status: 'active',
    progress: 45,
    todayCount: 72,
    totalCount: 1280,
    subItems: ['去应力回火'],
    fields: [
      { key: 'batchNo', label: '生产批号', type: 'text', placeholder: '请输入批号', required: true },
      { key: 'temperature', label: '回火温度', type: 'number', placeholder: '请输入', unit: '℃', required: true },
      { key: 'duration', label: '保温时间', type: 'number', placeholder: '请输入', unit: 'min', required: true },
      { key: 'furnaceNo', label: '炉号', type: 'text', placeholder: '请输入炉号' },
      { key: 'quantity', label: '处理数量', type: 'number', placeholder: '请输入数量', required: true },
      { key: 'operator', label: '操作工', type: 'text', placeholder: '请输入姓名' },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  },
  {
    key: 'end_grinding',
    name: '端面磨削',
    shortName: '磨端面',
    description: '弹簧端面磨平加工，保证垂直度',
    order: 4,
    status: 'pending',
    progress: 0,
    todayCount: 0,
    totalCount: 960,
    subItems: ['端面磨平'],
    fields: [
      { key: 'batchNo', label: '生产批号', type: 'text', placeholder: '请输入批号', required: true },
      { key: 'grindingAmount', label: '磨削量', type: 'number', placeholder: '请输入', unit: 'mm', required: true },
      { key: 'surfaceRoughness', label: '表面粗糙度', type: 'text', placeholder: '如Ra1.6', unit: 'μm' },
      { key: 'verticality', label: '垂直度', type: 'number', placeholder: '请输入', unit: 'mm' },
      { key: 'quantity', label: '磨削数量', type: 'number', placeholder: '请输入数量', required: true },
      { key: 'passed', label: '合格数', type: 'number', placeholder: '请输入合格数' },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  },
  {
    key: 'setting',
    name: '立定处理',
    shortName: '立定',
    description: '立定强压处理，提高弹簧尺寸稳定性',
    order: 5,
    status: 'pending',
    progress: 0,
    todayCount: 0,
    totalCount: 820,
    subItems: ['立定强压处理'],
    fields: [
      { key: 'batchNo', label: '生产批号', type: 'text', placeholder: '请输入批号', required: true },
      { key: 'settingLoad', label: '立定载荷', type: 'number', placeholder: '请输入', unit: 'N', required: true },
      { key: 'settingTime', label: '保压时间', type: 'number', placeholder: '请输入', unit: 's', required: true },
      { key: 'settingCycles', label: '强压次数', type: 'number', placeholder: '请输入', unit: '次', required: true },
      { key: 'heightAfter', label: '处理后高度', type: 'number', placeholder: '请输入', unit: 'mm' },
      { key: 'quantity', label: '处理数量', type: 'number', placeholder: '请输入数量', required: true },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  },
  {
    key: 'load_test',
    name: '负荷检测',
    shortName: '检测',
    description: '弹簧负荷测试与尺寸精度检验',
    order: 6,
    status: 'pending',
    progress: 0,
    todayCount: 0,
    totalCount: 750,
    subItems: ['弹簧负荷测试', '垂直度检验', '外径节距检查'],
    fields: [
      { key: 'batchNo', label: '生产批号', type: 'text', placeholder: '请输入批号', required: true },
      { key: 'testLoad', label: '试验载荷', type: 'number', placeholder: '请输入', unit: 'N', required: true },
      { key: 'deflection', label: '对应变形量', type: 'number', placeholder: '请输入', unit: 'mm', required: true },
      { key: 'stiffness', label: '刚度', type: 'number', placeholder: '自动计算', unit: 'N/mm' },
      { key: 'verticality', label: '垂直度误差', type: 'number', placeholder: '请输入', unit: 'mm' },
      { key: 'outerDiameterCheck', label: '外径检查', type: 'select', options: ['合格', '不合格'], required: true },
      { key: 'pitchCheck', label: '节距检查', type: 'select', options: ['合格', '不合格'], required: true },
      { key: 'sampleCount', label: '抽检数量', type: 'number', placeholder: '请输入' },
      { key: 'passed', label: '合格数', type: 'number', placeholder: '请输入合格数' },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  },
  {
    key: 'surface_treatment',
    name: '表面处理',
    shortName: '表面',
    description: '喷丸强化和发黑防锈处理',
    order: 7,
    status: 'pending',
    progress: 0,
    todayCount: 0,
    totalCount: 640,
    subItems: ['喷丸强化', '发黑防锈'],
    fields: [
      { key: 'batchNo', label: '生产批号', type: 'text', placeholder: '请输入批号', required: true },
      { key: 'treatmentType', label: '处理类型', type: 'select', options: ['喷丸强化', '发黑防锈', '喷丸+发黑'], required: true },
      { key: 'shotSize', label: '钢丸直径', type: 'number', placeholder: '喷丸时填写', unit: 'mm' },
      { key: 'shotTime', label: '喷丸时间', type: 'number', placeholder: '请输入', unit: 'min' },
      { key: 'blackeningTemp', label: '发黑温度', type: 'number', placeholder: '请输入', unit: '℃' },
      { key: 'blackeningTime', label: '发黑时间', type: 'number', placeholder: '请输入', unit: 'min' },
      { key: 'appearanceCheck', label: '外观检查', type: 'select', options: ['合格', '不合格'], required: true },
      { key: 'quantity', label: '处理数量', type: 'number', placeholder: '请输入数量', required: true },
      { key: 'remark', label: '备注', type: 'textarea', placeholder: '其他说明' }
    ]
  }
];

export const getProcessByKey = (key: ProcessKey): ProcessModule | undefined => {
  return processList.find(p => p.key === key);
};
