import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Alert, Badge, Button } from 'antd'
import {
  GlobalOutlined,
  DatabaseOutlined,
  WarningOutlined,
  SafetyOutlined,
  CloudServerOutlined,
  ReloadOutlined,

} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

// 威胁情报集成中心组件
const ThreatIntelligence: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 威胁类型分布图配置
  const getThreatTypeDistributionOption = () => ({
    title: {
      text: '威胁类型分布',
      left: 'center',
      textStyle: { color: '#333', fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '威胁类型',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      data: [
        {value: 45, name: 'APT攻击', itemStyle: {color: '#f5222d'}},
        {value: 32, name: '恶意软件', itemStyle: {color: '#fa8c16'}},
        {value: 28, name: '钓鱼攻击', itemStyle: {color: '#722ed1'}},
        {value: 23, name: 'DDoS攻击', itemStyle: {color: '#1890ff'}},
        {value: 18, name: '数据泄露', itemStyle: {color: '#13c2c2'}},
        {value: 15, name: '内部威胁', itemStyle: {color: '#52c41a'}}
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        color: '#333'
      }
    }]
  })

  // 威胁情报趋势图配置
  const getThreatTrendOption = () => ({
    title: {
      text: '威胁情报趋势',
      left: 'center',
      textStyle: { color: '#333', fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新发现威胁', '活跃威胁', '已清除威胁'],
      textStyle: { color: '#333' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['12-18', '12-19', '12-20', '12-21', '12-22', '12-23', '12-24'],
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '新发现威胁',
        type: 'line',
        data: [12, 18, 25, 32, 28, 35, 42],
        itemStyle: { color: '#ff4757' },
        smooth: true
      },
      {
        name: '活跃威胁',
        type: 'line',
        data: [85, 78, 82, 88, 92, 89, 95],
        itemStyle: { color: '#ffa502' },
        smooth: true
      },
      {
        name: '已清除威胁',
        type: 'line',
        data: [65, 72, 78, 85, 88, 92, 98],
        itemStyle: { color: '#52c41a' },
        smooth: true
      }
    ]
  })

  // 威胁情报数据
  const threatIntelligenceData = [
    {
      id: 1,
      title: 'APT41组织新活动',
      source: 'FireEye',
      type: 'APT攻击',
      severity: 'critical',
      confidence: 95,
      ioc: 'C2服务器: 45.32.156.78',
      description: '检测到APT41组织针对金融机构的最新攻击活动',
      mitigation: '建议立即检查相关IOCs并加强监控',
      lastSeen: '2025-12-24 14:30:00',
      tags: ['APT41', '金融', '新活动']
    },
    {
      id: 2,
      title: 'Emotet僵尸网络复苏',
      source: 'CISA',
      type: '恶意软件',
      severity: 'high',
      confidence: 88,
      ioc: '恶意域名: malware-update.com',
      description: 'Emotet银行木马出现新的变种，传播速度加快',
      mitigation: '更新威胁情报库并部署防护规则',
      lastSeen: '2025-12-24 13:45:00',
      tags: ['Emotet', '银行木马', '变种']
    },
    {
      id: 3,
      title: '供应链攻击预警',
      source: 'NIST',
      type: '供应链攻击',
      severity: 'critical',
      confidence: 92,
      ioc: '恶意更新包: SolarWinds-Hotfix.exe',
      description: '检测到针对软件供应链的APT攻击活动',
      mitigation: '检查软件更新来源并实施零信任策略',
      lastSeen: '2025-12-24 12:20:00',
      tags: ['供应链', 'SolarWinds', 'APT']
    },
    {
      id: 4,
      title: '钓鱼攻击活动激增',
      source: 'PhishTank',
      type: '钓鱼攻击',
      severity: 'medium',
      confidence: 85,
      ioc: '钓鱼域名: security-alert-gov.net',
      description: '冒充政府机构的钓鱼邮件活动增加',
      mitigation: '加强邮件安全防护和用户培训',
      lastSeen: '2025-12-24 11:15:00',
      tags: ['钓鱼', '政府仿冒', '邮件']
    }
  ]

  // 数据源状态
  const intelligenceSources = [
    {
      id: 1,
      name: 'FireEye CTI',
      status: 'connected',
      lastUpdate: '2025-12-24 14:35:00',
      indicators: 1247,
      confidence: 95.8
    },
    {
      id: 2,
      name: 'CISA Alert',
      status: 'connected',
      lastUpdate: '2025-12-24 14:30:00',
      indicators: 892,
      confidence: 98.2
    },
    {
      id: 3,
      name: 'NIST CVE',
      status: 'connected',
      lastUpdate: '2025-12-24 14:25:00',
      indicators: 2156,
      confidence: 99.1
    },
    {
      id: 4,
      name: 'PhishTank',
      status: 'disconnected',
      lastUpdate: '2025-12-24 12:15:00',
      indicators: 567,
      confidence: 87.3
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'green'
      case 'medium': return 'orange'
      case 'high': return 'red'
      case 'critical': return 'magenta'
      default: return 'default'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return '低危'
      case 'medium': return '中危'
      case 'high': return '高危'
      case 'critical': return '严重'
      default: return '未知'
    }
  }

  // 威胁情报表格列
  const intelligenceColumns = [
    {
      title: '威胁名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <div>
          <div className="font-semibold text-gray-800">{title}</div>
          <div className="text-xs text-gray-500">{record.source}</div>
        </div>
      )
    },
    {
      title: '威胁类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      )
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {getSeverityText(severity)}
        </Tag>
      )
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <Badge 
          count={`${confidence}%`} 
          style={{ backgroundColor: confidence > 90 ? '#52c41a' : confidence > 80 ? '#fa8c16' : '#f5222d' }}
        />
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">查看详情</Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <GlobalOutlined className="mr-3 text-blue-600" />
            威胁情报集成中心
          </h1>
          <p className="text-gray-600">全球威胁情报整合与分析平台</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ReloadOutlined />} 
            type="primary"
            onClick={() => window.location.reload()}
          >
            刷新情报
          </Button>
          <div className="text-right">
            <div className="text-sm text-gray-600">最后更新</div>
            <div className="text-lg font-mono text-gray-800">
              {currentTime.toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </div>

      {/* 威胁情报指标 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="活跃威胁源"
              value={4}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="IOC指标数"
              value={4862}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="实时监控"
              value={247}
              suffix="次/天"
              valueStyle={{ color: '#52c41a' }}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="自动更新"
              value={98.5}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
              prefix={<CloudServerOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 威胁预警 */}
      <Alert
        message="高级威胁情报更新"
        description="检测到APT41组织的新活动，建议立即检查相关IOCs并加强监控。"
        type="error"
        showIcon
        icon={<WarningOutlined />}
        className="mb-6"
      />

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="威胁情报趋势" className="security-card">
            <ReactECharts 
              option={getThreatTrendOption()} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="威胁类型分布" className="security-card">
            <ReactECharts 
              option={getThreatTypeDistributionOption()} 
              style={{ height: '350px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 情报源状态 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="情报源状态" className="security-card">
            <div className="space-y-4">
              {intelligenceSources.map((source) => (
                <div key={source.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800">{source.name}</div>
                    <Badge 
                      status={source.status === 'connected' ? 'success' : 'error'} 
                      text={source.status === 'connected' ? '在线' : '离线'}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    指标数: {source.indicators}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    置信度: {source.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">
                    最后更新: {source.lastUpdate}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="威胁情报列表" className="security-card">
            <Table
              columns={intelligenceColumns}
              dataSource={threatIntelligenceData}
              rowKey="id"
              pagination={{ pageSize: 8 }}
              size="small"
              className="text-gray-800"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ThreatIntelligence