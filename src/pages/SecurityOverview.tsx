import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Timeline, Progress } from 'antd'
import {
  TrophyOutlined,
  AlertOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined as ShieldOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { SecurityOverview as SecurityOverviewType, SecurityEvent, NetworkNode } from '@/types'
import { generateMockSecurityData } from '@/utils/mockData'

const SecurityOverview: React.FC = () => {
  const [securityData, setSecurityData] = useState<SecurityOverviewType | null>(null)
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([])
  const [realTimeEvents, setRealTimeEvents] = useState<SecurityEvent[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())

  useEffect(() => {
    // 模拟数据加载
    const mockData = generateMockSecurityData()
    setSecurityData(mockData.overview)
    setNetworkNodes(mockData.networkNodes)
    setRealTimeEvents(mockData.recentEvents.slice(0, 5)) // 初始化实时事件

    // 添加实时事件流
    const eventTimer = setInterval(() => {
      const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical']
      const newEvent: SecurityEvent = {
        id: `event-${Date.now()}`,
        timestamp: new Date().toLocaleString('zh-CN'),
        type: ['异常登录', '漏洞扫描', '设备接入', '威胁检测', '数据泄露'][Math.floor(Math.random() * 5)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: '实时监控检测到安全事件',
        source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: 'active'
      }
      
      setRealTimeEvents(prev => [newEvent, ...prev.slice(0, 4)]) // 保留最新5条
      setLastUpdateTime(new Date())
    }, 8000) // 每8秒产生一个新事件
    
    return () => clearInterval(eventTimer)
  }, [])

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'green'
      case 'medium': return 'orange'
      case 'high': return 'red'
      case 'critical': return 'magenta'
      default: return 'default'
    }
  }

  // 网络拓扑图配置
  const getNetworkTopologyOption = () => ({
    tooltip: {},
    animation: true,
    series: [{
      type: 'graph',
      layout: 'force',
      data: networkNodes.map(node => ({
        id: node.id,
        name: node.name,
        value: node.riskLevel,
        symbolSize: node.type === 'gateway' ? 80 : node.type === 'server' ? 60 : 40,
        itemStyle: {
          color: node.riskLevel === 'low' ? '#52c41a' : 
                 node.riskLevel === 'medium' ? '#fa8c16' : 
                 node.riskLevel === 'high' ? '#f5222d' : '#8c8c8c'
        }
      })),
      links: networkNodes.flatMap(node => 
        node.connections.map(targetId => ({ source: node.id, target: targetId }))
      ),
      force: {
        repulsion: 1000,
        gravity: 0.1,
        edgeLength: 100
      }
    }]
  })

  // 设备类型分布图配置
  const getDeviceDistributionOption = () => ({
    title: {
      text: '设备类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '70%',
      data: [
        { value: securityData?.trustedDevices || 0, name: '可信设备' },
        { value: securityData?.suspiciousDevices || 0, name: '可疑设备' },
        { value: securityData?.maliciousDevices || 0, name: '恶意设备' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  // 实时事件表配置
  const eventColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getRiskLevelColor(severity)}>{severity.toUpperCase()}</Tag>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'red' : status === 'investigating' ? 'orange' : 'green'}>
          {status}
        </Tag>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 全局安全指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="设备识别准确率"
              value={securityData?.identificationAccuracy || 95}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="非法设备阻断率"
              value={securityData?.blockRate || 92}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ShieldOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="平均响应时间"
              value={securityData?.responseTime || 25}
              suffix="分钟"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="紧急警报"
              value={securityData?.criticalAlerts || 3}
              valueStyle={{ color: '#f5222d' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="网络拓扑" className="security-card">
            <ReactECharts 
              option={getNetworkTopologyOption()} 
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="设备类型分布" className="security-card">
            <ReactECharts 
              option={getDeviceDistributionOption()} 
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 实时事件 */}
      <Card title="实时安全事件" className="security-card">
        <Table
          columns={eventColumns}
          dataSource={realTimeEvents}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          size="small"
        />
        
        {/* 最后更新时间 */}
        <div className="text-center text-xs text-gray-500 mt-2">
          最后更新: {lastUpdateTime.toLocaleTimeString('zh-CN')}
        </div>
      </Card>

      {/* 威胁情报时间线 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="威胁情报动态" className="security-card">
            <Timeline>
              <Timeline.Item color="red">
                <p><strong>检测到异常设备接入</strong></p>
                <p>设备 MAC: 00:1B:44:11:3A:B7</p>
                <p>位置: 办公楼3楼</p>
                <p>时间: 2025-12-23 14:25:30</p>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <p><strong>漏洞扫描完成</strong></p>
                <p>目标: 生产网段 192.168.1.0/24</p>
                <p>发现高危漏洞: 5个</p>
                <p>时间: 2025-12-23 14:20:15</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p><strong>设备身份验证通过</strong></p>
                <p>设备: RTU-001</p>
                <p>验证方式: 数字证书 + 硬件指纹</p>
                <p>时间: 2025-12-23 14:18:45</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统健康状态" className="security-card">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>设备识别引擎</span>
                  <span>98%</span>
                </div>
                <Progress percent={98} status="active" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>威胁检测系统</span>
                  <span>95%</span>
                </div>
                <Progress percent={95} status="active" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>数据融合平台</span>
                  <span>92%</span>
                </div>
                <Progress percent={92} status="active" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>响应引擎</span>
                  <span>97%</span>
                </div>
                <Progress percent={97} status="active" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SecurityOverview