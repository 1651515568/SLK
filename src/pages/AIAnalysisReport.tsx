import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Button, Table, Tag, Progress, Alert, Descriptions, Badge, Modal } from 'antd'
import {
  ProjectOutlined as BrainOutlined,
  FileTextOutlined,
  LineChartOutlined as TrendingUpOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

// AI智能分析报告组件
const AIAnalysisReport: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // 详情弹窗状态
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // AI预测趋势图配置
  const getPredictionTrendOption = () => ({
    title: {
      text: 'AI威胁预测趋势',
      left: 'center',
      top: 10,
      textStyle: { 
        color: '#333', 
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['实际威胁', 'AI预测', '置信区间'],
      top: 40,
      textStyle: { 
        color: '#333',
        fontSize: 12
      },
      itemGap: 20
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '25%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['12-20', '12-21', '12-22', '12-23', '12-24', '12-25', '12-26'],
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { 
        color: '#666',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { 
        color: '#666',
        fontSize: 12
      },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '实际威胁',
        type: 'line',
        data: [65, 78, 85, 92, 88, 95, 102],
        itemStyle: { color: '#ff4757' },
        smooth: true,
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: 'AI预测',
        type: 'line',
        data: [68, 75, 88, 89, 91, 93, 98],
        itemStyle: { color: '#52c41a' },
        smooth: true,
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '置信区间',
        type: 'line',
        data: [60, 70, 80, 85, 87, 90, 95],
        itemStyle: { color: 'rgba(82, 196, 26, 0.1)' },
        areaStyle: {
          color: 'rgba(82, 196, 26, 0.1)'
        },
        smooth: true,
        lineStyle: { width: 1, type: 'dashed' },
        symbol: 'none'
      }
    ]
  })

  // AI模型性能雷达图
  const getModelPerformanceRadarOption = () => ({
    title: {
      text: 'AI模型性能指标',
      left: 'center',
      top: 10,
      textStyle: { 
        color: '#333', 
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    radar: {
      indicator: [
        { name: '精确率', max: 100 },
        { name: '召回率', max: 100 },
        { name: 'F1分数', max: 100 },
        { name: '准确率', max: 100 }
      ],
      center: ['50%', '60%'],
      radius: '65%',
      splitArea: {
        areaStyle: {
          color: ['rgba(24, 144, 255, 0.1)', 'rgba(24, 144, 255, 0.05)', 'rgba(24, 144, 255, 0.01)']
        }
      },
      axisName: {
        color: '#333',
        fontSize: 12
      }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [92.3, 89.1, 91.2, 94.7],
          name: '威胁检测模型',
          itemStyle: { color: '#1890ff' },
          areaStyle: { color: 'rgba(24, 144, 255, 0.2)' }
        },
        {
          value: [85.2, 91.4, 88.2, 87.6],
          name: '异常检测模型',
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: 'rgba(82, 196, 26, 0.2)' }
        }
      ]
    }]
  })

  // 异常检测热力图配置
  const getAnomalyHeatmapOption = () => ({
    title: {
      text: '异常行为检测热力图',
      left: 'center',
      top: 10,
      textStyle: { 
        color: '#333', 
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      position: 'top',
      formatter: function(params: any) {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        const times = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24']
        return `${days[params.data[0]]} ${times[params.data[1]]}<br/>异常指数: ${params.data[2]}`
      }
    },
    grid: {
      height: '50%',
      top: '20%',
      left: '12%',
      right: '8%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      splitArea: {
        show: true
      },
      axisLabel: { 
        color: '#333',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'category',
      data: ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'],
      splitArea: {
        show: true
      },
      axisLabel: { 
        color: '#333',
        fontSize: 12
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      },
      textStyle: { 
        color: '#333',
        fontSize: 12
      }
    },
    series: [{
      name: '异常指数',
      type: 'heatmap',
      data: [
        [0, 0, 5], [1, 0, 8], [2, 0, 12], [3, 0, 15], [4, 0, 8], [5, 0, 3], [6, 0, 2],
        [0, 1, 3], [1, 1, 6], [2, 1, 9], [3, 1, 18], [4, 1, 25], [5, 1, 15], [6, 1, 8],
        [0, 2, 8], [1, 2, 15], [2, 2, 35], [3, 2, 45], [4, 2, 38], [5, 2, 22], [6, 2, 12],
        [0, 3, 12], [1, 3, 25], [2, 3, 48], [3, 3, 65], [4, 3, 58], [5, 3, 35], [6, 3, 18],
        [0, 4, 15], [1, 4, 28], [2, 4, 42], [3, 4, 55], [4, 4, 48], [5, 4, 32], [6, 4, 20],
        [0, 5, 8], [1, 5, 18], [2, 5, 32], [3, 5, 45], [4, 5, 38], [5, 5, 25], [6, 5, 15]
      ],
      label: {
        show: true,
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  // AI分析洞察数据
  const aiInsights = [
    {
      id: 1,
      type: '威胁预测',
      title: '基于机器学习的威胁预测分析',
      confidence: 92.5,
      description: 'AI模型预测未来24小时内可能出现APT攻击，置信度92.5%',
      action: '建议立即加强监控'
    },
    {
      id: 2,
      type: '异常检测',
      title: '用户行为异常分析',
      confidence: 87.3,
      description: '检测到用户"admin@company.com"行为模式异常，可能存在内部威胁',
      action: '建议进行深度审计'
    },
    {
      id: 3,
      type: '风险评估',
      title: '网络设备风险评估',
      confidence: 95.8,
      description: 'RTU-003设备存在高危漏洞，建议立即修复',
      action: '已自动生成修复计划'
    },
    {
      id: 4,
      type: '关联分析',
      title: '威胁情报关联分析',
      confidence: 89.7,
      description: '当前攻击与已知APT组织TTPs匹配度89.7%',
      action: '已更新威胁情报库'
    }
  ]

  // 分析报告列表
  const reportColumns = [
    {
      title: '报告类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      )
    },
    {
      title: '报告标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'AI置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <Progress percent={confidence} size="small" />
      )
    },
    {
      title: '建议措施',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_record: any) => {
        const statusConfig = {
          '分析中': { status: 'processing', color: '#1890ff' },
          '已完成': { status: 'success', color: '#52c41a' },
          '失败': { status: 'error', color: '#f5222d' }
        }
        const config = statusConfig['分析中']
        return (
          <div className="whitespace-nowrap">
            <Badge status={config.status as any} />
            <span className="text-xs text-gray-600">分析中</span>
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (record: any) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedReport(record)
            setReportModalVisible(true)
          }}
          className="p-0 h-auto text-blue-600"
        >
          查看详情
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <BrainOutlined className="mr-3 text-blue-600" />
            AI智能分析报告
          </h1>
          <p className="text-gray-600">机器学习驱动的安全威胁分析</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">最后更新</div>
          <div className="text-lg font-mono text-gray-800">
            {currentTime.toLocaleString('zh-CN')}
          </div>
        </div>
      </div>

      {/* AI分析指标 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="AI模型准确率"
              value={94.7}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="分析事件数"
              value={2847}
              suffix="次"
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="预测准确率"
              value={89.3}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<TrendingUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="处理延迟"
              value={0.3}
              suffix="秒"
              valueStyle={{ color: '#722ed1' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* AI洞察建议 */}
      <Alert
        message="AI系统检测到新的威胁模式"
        description="基于深度学习算法的威胁检测系统已识别出3个新的攻击模式，建议立即关注。"
        type="warning"
        showIcon
        icon={<AlertOutlined />}
        className="mb-6"
      />

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="AI威胁预测趋势" className="security-card">
            <ReactECharts 
              option={getPredictionTrendOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="异常行为检测热力图" className="security-card">
            <ReactECharts 
              option={getAnomalyHeatmapOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* AI模型性能雷达图 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="AI模型性能指标" className="security-card">
            <ReactECharts 
              option={getModelPerformanceRadarOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="模型实时状态" className="security-card">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-800">威胁检测模型</span>
                  <Badge status="processing" text="运行中" />
                </div>
                <div className="text-sm text-blue-600 mb-2">
                  处理速度: 1,247 事件/秒
                </div>
                <div className="text-sm text-blue-600">
                  准确率: 94.7% | 延迟: 0.3s
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-800">异常检测模型</span>
                  <Badge status="success" text="运行中" />
                </div>
                <div className="text-sm text-green-600 mb-2">
                  处理速度: 856 事件/秒
                </div>
                <div className="text-sm text-green-600">
                  准确率: 87.6% | 延迟: 0.5s
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-orange-800">行为分析模型</span>
                  <Badge status="warning" text="训练中" />
                </div>
                <div className="text-sm text-orange-600 mb-2">
                  训练进度: 78%
                </div>
                <div className="text-sm text-orange-600">
                  预计完成: 2025-12-25 10:30:00
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* AI分析洞察 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="AI分析洞察" className="security-card">
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <BrainOutlined className="text-blue-600 mr-2" />
                      <Tag color="blue">{insight.type}</Tag>
                    </div>
                    <Badge status="processing" text={`${insight.confidence}%`} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{insight.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <Progress percent={insight.confidence} size="small" className="flex-1 mr-4" />
                    <Button type="primary" size="small">
                      {insight.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="分析报告列表" className="security-card">
            <Table
              columns={reportColumns}
              dataSource={aiInsights}
              rowKey="id"
              pagination={{ pageSize: 4 }}
              size="small"
              className="text-gray-800"
              scroll={{ x: 800 }}
              onRow={(record) => ({
                onClick: () => {
                  console.log('点击行:', record)
                }
              })}
            />
          </Card>
        </Col>
      </Row>

      {/* 模型性能评估 */}
      <Card title="AI模型性能评估" className="security-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Descriptions title="威胁检测模型" bordered column={1} className="text-gray-800">
              <Descriptions.Item label="模型版本">v2.4.1</Descriptions.Item>
              <Descriptions.Item label="训练数据量">50万+ 样本</Descriptions.Item>
              <Descriptions.Item label="精确率">
                <Progress percent={94.7} strokeColor="#52c41a" />
              </Descriptions.Item>
              <Descriptions.Item label="召回率">
                <Progress percent={91.3} strokeColor="#1890ff" />
              </Descriptions.Item>
              <Descriptions.Item label="F1-Score">
                <Progress percent={92.9} strokeColor="#fa8c16" />
              </Descriptions.Item>
              <Descriptions.Item label="推理延迟">0.3秒</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} md={12}>
            <Descriptions title="异常检测模型" bordered column={1} className="text-gray-800">
              <Descriptions.Item label="模型版本">v1.8.2</Descriptions.Item>
              <Descriptions.Item label="算法类型">Isolation Forest + LSTM</Descriptions.Item>
              <Descriptions.Item label="准确率">
                <Progress percent={87.6} strokeColor="#52c41a" />
              </Descriptions.Item>
              <Descriptions.Item label="误报率">
                <Progress percent={2.3} strokeColor="#f5222d" />
              </Descriptions.Item>
              <Descriptions.Item label="处理能力">
                <Progress percent={98.5} strokeColor="#1890ff" />
              </Descriptions.Item>
              <Descriptions.Item label="模型更新时间">2025-12-23 14:30:00</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
      
      {/* AI分析报告详情弹窗 */}
      <Modal
        title="AI分析报告详情"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedReport && (
          <div className="space-y-4">
            <Alert
              message={selectedReport.title}
              description={selectedReport.description}
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />
            
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="报告类型" span={1}>
                <Tag color="blue">{selectedReport.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="AI置信度" span={1}>
                <div className="flex items-center space-x-2">
                  <Progress percent={selectedReport.confidence} size="small" className="flex-1" />
                  <span className="font-bold text-blue-600">{selectedReport.confidence}%</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="分析结果" span={2}>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-700">{selectedReport.description}</p>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="建议措施" span={2}>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-800 font-medium">{selectedReport.action}</p>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="报告ID" span={1}>
                AI-RPT-{selectedReport.id.toString().padStart(4, '0')}
              </Descriptions.Item>
              <Descriptions.Item label="分析时间" span={1}>
                {new Date().toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="模型版本" span={1}>
                v2.4.1
              </Descriptions.Item>
              <Descriptions.Item label="数据源" span={1}>
                多源融合分析
              </Descriptions.Item>
            </Descriptions>
            
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2 flex items-center">
                <BrainOutlined className="mr-2 text-blue-600" />
                AI分析洞察
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">威胁等级:</span>
                  <Tag color={selectedReport.confidence > 90 ? 'red' : selectedReport.confidence > 80 ? 'orange' : 'yellow'} className="ml-2">
                    {selectedReport.confidence > 90 ? '高' : selectedReport.confidence > 80 ? '中' : '低'}
                  </Tag>
                </div>
                <div>
                  <span className="text-gray-600">优先级:</span>
                  <Tag color={selectedReport.type === '威胁预测' ? 'red' : 'blue'} className="ml-2">
                    {selectedReport.type === '威胁预测' ? '紧急' : '重要'}
                  </Tag>
                </div>
                <div>
                  <span className="text-gray-600">自动化程度:</span>
                  <span className="ml-2 text-green-600">完全自动化</span>
                </div>
                <div>
                  <span className="text-gray-600">处理状态:</span>
                  <span className="ml-2 text-blue-600">已执行</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AIAnalysisReport