export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/process/index',
    'pages/records/index',
    'pages/mine/index',
    'pages/process-detail/index',
    'pages/record-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2563EB',
    navigationBarTitleText: '弹簧生产管理',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F1F5F9'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/process/index',
        text: '工序管理'
      },
      {
        pagePath: 'pages/records/index',
        text: '记录查询'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
