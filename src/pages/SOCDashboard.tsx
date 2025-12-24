import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Tag, Alert, Badge } from 'antd'
import {
  SafetyCertificateOutlined as ShieldOutlined,
  AlertOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

// 实时威胁监控大屏组件
const SOCDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // 模拟威胁等级变化
      const levels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']
      setThreatLevel(levels[Math.floor(Math.random() * levels.length)])
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  // 威胁趋势图配置
  const getThreatTrendOption = () => ({
    title: {
      text: '威胁趋势分析',
      left: 'center',
      top: 10,
      textStyle: { 
        color: '#333', 
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['恶意软件', 'DDoS攻击', '数据泄露', '钓鱼攻击'],
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
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
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
        name: '恶意软件',
        type: 'line',
        smooth: true,
        data: [12, 23, 45, 32, 65, 45, 78],
        itemStyle: { color: '#ff4757' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: 'DDoS攻击',
        type: 'line',
        smooth: true,
        data: [5, 15, 28, 35, 42, 38, 55],
        itemStyle: { color: '#ffa502' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '数据泄露',
        type: 'line',
        smooth: true,
        data: [8, 12, 18, 25, 32, 28, 42],
        itemStyle: { color: '#ff3742' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '钓鱼攻击',
        type: 'line',
        smooth: true,
        data: [3, 8, 15, 22, 28, 35, 45],
        itemStyle: { color: '#ff6348' },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4
      }
    ]
  })

  // 威胁等级分布图配置
  const getThreatDistributionOption = () => ({
    title: {
      text: '威胁等级分布',
      left: 'center',
      top: 10,
      textStyle: { 
        color: '#333', 
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '威胁等级',
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '58%'],
      data: [
        {value: 45, name: '低风险', itemStyle: {color: '#52c41a'}},
        {value: 32, name: '中风险', itemStyle: {color: '#fa8c16'}},
        {value: 18, name: '高风险', itemStyle: {color: '#f5222d'}},
        {value: 5, name: '严重风险', itemStyle: {color: '#722ed1'}}
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{c}项\n({d}%)',
        color: '#333',
        fontSize: 12,
        lineHeight: 16
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 10,
        lineStyle: {
          color: '#ccc'
        }
      }
    }]
  })

  // 威胁态势热力图配置
  const getThreatHeatmapOption = () => ({
    title: {
      text: '威胁态势热力图',
      left: 'center',
      top: 10,
      textStyle: { 
        color: '#333', 
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>威胁等级: {c}'
    },
    series: [{
      name: '威胁等级',
      type: 'scatter',
      data: [
        {name: '北京', value: [116.4074, 39.9042, 85]},
        {name: '上海', value: [121.4737, 31.2304, 72]},
        {name: '广州', value: [113.2644, 23.1291, 68]},
        {name: '深圳', value: [114.0579, 22.5431, 91]},
        {name: '成都', value: [104.0665, 30.5723, 45]},
        {name: '武汉', value: [114.3055, 30.5928, 65]},
        {name: '西安', value: [108.9398, 34.3416, 55]},
        {name: '杭州', value: [120.1551, 30.2741, 78]},
      ],
      symbolSize: function (val: number[]) {
        return val[2] / 3
      },
      itemStyle: {
        color: function(params: any) {
          const colors = ['#52c41a', '#fa8c16', '#f5222d', '#722ed1']
          const colorIndex = params.value[2] > 80 ? 3 : params.value[2] > 60 ? 2 : params.value[2] > 40 ? 1 : 0
          return colors[colorIndex]
        },
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)'
        }
      }
    }]
  })

  // 实时事件数据
  const realTimeEvents = [
    {
      id: 'rt-1',
      time: '14:25:30',
      type: '恶意软件检测',
      source: '192.168.1.156',
      severity: 'critical',
      description: '检测到WannaCry变种病毒',
      action: '已隔离'
    },
    {
      id: 'rt-2',
      time: '14:24:15',
      type: '异常登录',
      source: 'admin@company.com',
      severity: 'high',
      description: '管理员账户异常登录',
      action: '已阻断'
    },
    {
      id: 'rt-3',
      time: '14:23:45',
      type: 'DDoS攻击',
      source: '外部IP',
      severity: 'medium',
      description: '检测到SYN Flood攻击',
      action: '流量清洗'
    }
  ]

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'green'
      case 'medium': return 'orange'
      case 'high': return 'red'
      case 'critical': return 'magenta'
      default: return 'default'
    }
  }

  const getThreatLevelText = (level: string) => {
    switch (level) {
      case 'low': return '低风险'
      case 'medium': return '中风险'
      case 'high': return '高风险'
      case 'critical': return '严重风险'
      default: return '未知'
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和时间 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <ShieldOutlined className="mr-3 text-blue-600" />
            安全运营中心
          </h1>
          <p className="text-gray-600">实时威胁监控与响应中心</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-gray-800">
            {currentTime.toLocaleTimeString('zh-CN')}
          </div>
          <div className="text-gray-600">
            {currentTime.toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>
      </div>

      {/* 威胁等级预警 */}
      <Alert
        message={`当前威胁等级: ${getThreatLevelText(threatLevel)}`}
        description="系统检测到潜在安全威胁，请保持警惕。"
        type={threatLevel === 'critical' ? 'error' : threatLevel === 'high' ? 'warning' : 'info'}
        showIcon
        icon={<AlertOutlined />}
        className="mb-6"
      />

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="威胁检测数"
              value={1247}
              suffix="次/天"
              valueStyle={{ color: '#ff4757' }}
              prefix={<ShieldOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="阻断攻击"
              value={892}
              suffix="次"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="活跃监控点"
              value={156}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="响应时间"
              value={0.8}
              suffix="秒"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<SecurityScanOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="威胁趋势分析" className="security-card">
            <ReactECharts 
              option={getThreatTrendOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="威胁等级分布" className="security-card">
            <ReactECharts 
              option={getThreatDistributionOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 威胁态势和实时事件 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="威胁态势热力图" className="security-card">
            <ReactECharts 
              option={getThreatHeatmapOption()} 
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="实时安全事件" className="security-card">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {realTimeEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-gray-50 p-3 rounded-lg border-l-4 border-red-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      status={event.severity === 'critical' ? 'error' : 
                             event.severity === 'high' ? 'warning' : 'processing'} 
                    />
                    <span className="text-sm text-gray-500">{event.time}</span>
                  </div>
                  <div className="font-semibold text-gray-800 mb-1">{event.type}</div>
                  <div className="text-sm text-gray-600 mb-2">{event.description}</div>
                  <div className="flex justify-between items-center">
                    <Tag color={getThreatLevelColor(event.severity)}>
                      {getThreatLevelText(event.severity)}
                    </Tag>
                    <span className="text-xs text-green-600">{event.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SOCDashboard