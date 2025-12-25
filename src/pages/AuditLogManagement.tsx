import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Alert, Timeline, Badge, Button, Input, Select, DatePicker, Tooltip } from 'antd'
import {
  AuditOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'

// 系统审计日志管理组件
const AuditLogManagement: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 数据导出功能
  const handleExportLogs = () => {
    const csvContent = [
      '时间,用户,操作,资源,级别,结果,IP地址,位置,描述',
      ...auditLogs.map(log => 
        `"${log.timestamp}","${log.user}","${log.action}","${log.resource}","${log.level}","${log.result}","${log.ip}","${log.location}","${log.description}"`
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // 审计活动趋势图配置
  const getAuditTrendOption = () => ({
    title: {
      text: '审计活动趋势',
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
      data: ['安全事件', '用户操作', '系统事件', '访问控制'],
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
        name: '安全事件',
        type: 'line',
        data: [45, 23, 78, 123, 89, 156, 201],
        itemStyle: { color: '#f5222d' },
        smooth: true,
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: {
          color: 'rgba(245, 34, 45, 0.1)'
        }
      },
      {
        name: '用户操作',
        type: 'line',
        data: [123, 234, 345, 456, 378, 489, 567],
        itemStyle: { color: '#1890ff' },
        smooth: true,
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.1)'
        }
      },
      {
        name: '系统事件',
        type: 'line',
        data: [89, 167, 234, 298, 267, 334, 445],
        itemStyle: { color: '#52c41a' },
        smooth: true,
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: {
          color: 'rgba(82, 196, 26, 0.1)'
        }
      },
      {
        name: '访问控制',
        type: 'line',
        data: [67, 123, 189, 245, 201, 278, 356],
        itemStyle: { color: '#fa8c16' },
        smooth: true,
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: {
          color: 'rgba(250, 140, 22, 0.1)'
        }
      }
    ]
  })

  // 审计级别分布图配置
  const getAuditLevelOption = () => ({
    title: {
      text: '审计级别分布',
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
      name: '审计级别',
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '55%'],
      data: [
        {value: 156, name: '严重', itemStyle: {color: '#f5222d'}},
        {value: 289, name: '警告', itemStyle: {color: '#fa8c16'}},
        {value: 567, name: '信息', itemStyle: {color: '#1890ff'}},
        {value: 445, name: '调试', itemStyle: {color: '#52c41a'}}
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
        fontSize: 11,
        lineHeight: 14,
        distanceToLabelLine: 5
      },
      labelLine: {
        show: true,
        length: 12,
        length2: 8,
        lineStyle: {
          color: '#ccc'
        }
      }
    }]
  })

  // 审计日志数据
  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-12-24 14:35:22',
      user: 'admin@company.com',
      action: '用户登录',
      resource: '安全管理系统',
      level: 'info',
      result: 'success',
      ip: '192.168.1.100',
      description: '管理员用户成功登录系统',
      location: '北京总部'
    },
    {
      id: 2,
      timestamp: '2025-12-24 14:34:15',
      user: 'system',
      action: '漏洞扫描',
      resource: '192.168.1.0/24',
      level: 'warning',
      result: 'completed',
      ip: '192.168.1.1',
      description: '系统自动漏洞扫描发现5个高危漏洞',
      location: '自动任务'
    },
    {
      id: 3,
      timestamp: '2025-12-24 14:33:08',
      user: 'unknown',
      action: '异常访问',
      resource: '数据库服务器',
      level: 'critical',
      result: 'blocked',
      ip: '203.0.113.45',
      description: '检测到来自未知IP的异常访问尝试',
      location: '外部网络'
    },
    {
      id: 4,
      timestamp: '2025-12-24 14:32:45',
      user: 'analyst@company.com',
      action: '威胁分析',
      resource: 'AI分析引擎',
      level: 'info',
      result: 'success',
      ip: '192.168.1.125',
      description: '安全分析师查看威胁情报报告',
      location: '上海分部'
    },
    {
      id: 5,
      timestamp: '2025-12-24 14:31:30',
      user: 'system',
      action: '设备隔离',
      resource: 'RTU-003',
      level: 'warning',
      result: 'success',
      ip: '192.168.1.3',
      description: '系统自动隔离疑似受感染的RTU设备',
      location: '自动响应'
    },
    {
      id: 6,
      timestamp: '2025-12-24 14:30:12',
      user: 'auditor@company.com',
      action: '合规检查',
      resource: '全网设备',
      level: 'info',
      result: 'completed',
      ip: '192.168.1.200',
      description: '合规审计员执行月度合规性检查',
      location: '深圳分部'
    }
  ]

  // 审计统计
  const auditStats = [
    {
      title: '今日审计事件',
      value: 1457,
      suffix: '次',
      color: '#1890ff',
      icon: <FileTextOutlined />
    },
    {
      title: '异常事件',
      value: 23,
      suffix: '次',
      color: '#f5222d',
      icon: <ExclamationCircleOutlined />
    },
    {
      title: '活跃用户',
      value: 45,
      suffix: '人',
      color: '#52c41a',
      icon: <UserOutlined />
    },
    {
      title: '合规率',
      value: 98.5,
      suffix: '%',
      color: '#fa8c16',
      icon: <SafetyCertificateOutlined />
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug': return 'green'
      case 'info': return 'blue'
      case 'warning': return 'orange'
      case 'critical': return 'red'
      default: return 'default'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'debug': return '调试'
      case 'info': return '信息'
      case 'warning': return '警告'
      case 'critical': return '严重'
      default: return '未知'
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success': return 'success'
      case 'blocked': return 'error'
      case 'failed': return 'error'
      case 'completed': return 'processing'
      default: return 'default'
    }
  }

  const getResultText = (result: string) => {
    switch (result) {
      case 'success': return '成功'
      case 'blocked': return '已阻断'
      case 'failed': return '失败'
      case 'completed': return '已完成'
      default: return '未知'
    }
  }

  // 审计日志表格列
  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      sorter: (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (user: string) => (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-gray-400" />
          <span className="text-gray-800">{user}</span>
        </div>
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action: string) => (
        <Tag color="cyan">{action}</Tag>
      )
    },
    {
      title: '资源',
      dataIndex: 'resource',
      key: 'resource',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (resource: string) => (
        <Tooltip title={resource}>
          <span className="text-gray-600">{resource}</span>
        </Tooltip>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>
          {getLevelText(level)}
        </Tag>
      )
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result: string) => (
        <Badge status={getResultColor(result) as any} text={getResultText(result)} />
      )
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      render: (ip: string) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-green-600 text-xs whitespace-nowrap">{ip}</code>
      )
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip title={description}>
          <span className="text-gray-600">{description}</span>
        </Tooltip>
      ),
    }
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <AuditOutlined className="mr-3 text-blue-600" />
            审计日志管理
          </h1>
          <p className="text-gray-600">系统审计日志与合规性监控</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            icon={<DownloadOutlined />} 
            type="primary"
            onClick={handleExportLogs}
          >
            导出日志
          </Button>
          <div className="text-right">
            <div className="text-sm text-gray-600">最后更新</div>
            <div className="text-lg font-mono text-gray-800">
              {currentTime.toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </div>

      {/* 审计统计指标 */}
      <Row gutter={[16, 16]} className="mb-6">
        {auditStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="security-stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 审计预警 */}
      <Alert
        message="审计系统正常运行"
        description="系统审计功能正常，已记录1457条审计事件，无异常情况。"
        type="info"
        showIcon
        icon={<ClockCircleOutlined />}
        className="mb-6"
      />

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="审计活动趋势" className="security-card">
            <ReactECharts 
              option={getAuditTrendOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="审计级别分布" className="security-card">
            <ReactECharts 
              option={getAuditLevelOption()} 
              style={{ height: '380px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 审计日志表格 */}
      <Card 
        title="审计日志详情" 
        className="security-card"
        extra={
          <div className="flex space-x-2">
            <Input
              placeholder="搜索用户、操作或描述"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="审计级别"
              style={{ width: 120 }}
              value={selectedLevel}
              onChange={setSelectedLevel}
            >
              <Select.Option value="all">全部级别</Select.Option>
              <Select.Option value="critical">严重</Select.Option>
              <Select.Option value="warning">警告</Select.Option>
              <Select.Option value="info">信息</Select.Option>
              <Select.Option value="debug">调试</Select.Option>
            </Select>
            <Select
              placeholder="操作类型"
              style={{ width: 120 }}
              value={selectedAction}
              onChange={setSelectedAction}
            >
              <Select.Option value="all">全部操作</Select.Option>
              <Select.Option value="登录">登录</Select.Option>
              <Select.Option value="扫描">扫描</Select.Option>
              <Select.Option value="访问">访问</Select.Option>
              <Select.Option value="分析">分析</Select.Option>
            </Select>
            <DatePicker.RangePicker 
              placeholder={['开始日期', '结束日期']}
              className="bg-gray-50 border-gray-300"
            />
          </div>
        }
      >
        <Table
          columns={logColumns}
          dataSource={auditLogs}
          rowKey="id"
          pagination={{
            total: auditLogs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          className="audit-log-table text-gray-800"
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 审计时间线 */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="关键审计事件时间线" className="security-card">
            <Timeline className="text-gray-800">
              <Timeline.Item color="red">
                <div className="text-gray-800">
                  <div className="font-semibold">严重安全事件</div>
                  <div className="text-sm text-gray-600">检测到来自未知IP的异常访问尝试</div>
                  <div className="text-xs text-gray-500">2025-12-24 14:33:08</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <div className="text-gray-800">
                  <div className="font-semibold">系统自动响应</div>
                  <div className="text-sm text-gray-600">系统自动隔离疑似受感染的RTU设备</div>
                  <div className="text-xs text-gray-500">2025-12-24 14:31:30</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div className="text-gray-800">
                  <div className="font-semibold">用户操作</div>
                  <div className="text-sm text-gray-600">管理员用户成功登录系统</div>
                  <div className="text-xs text-gray-500">2025-12-24 14:35:22</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="green">
                <div className="text-gray-800">
                  <div className="font-semibold">合规检查</div>
                  <div className="text-sm text-gray-600">合规审计员执行月度合规性检查</div>
                  <div className="text-xs text-gray-500">2025-12-24 14:30:12</div>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="合规性状态" className="security-card">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-semibold">数据保护合规</span>
                  <Badge status="success" text="合规" />
                </div>
                <div className="text-sm text-gray-600 mb-2">GDPR/网络安全法合规检查</div>
                <div className="text-xs text-gray-500">最后检查: 2025-12-24 10:00:00</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-semibold">访问控制审计</span>
                  <Badge status="success" text="合规" />
                </div>
                <div className="text-sm text-gray-600 mb-2">权限管理和访问日志检查</div>
                <div className="text-xs text-gray-500">最后检查: 2025-12-24 09:30:00</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-semibold">安全事件响应</span>
                  <Badge status="warning" text="需要关注" />
                </div>
                <div className="text-sm text-gray-600 mb-2">安全事件处理流程合规性</div>
                <div className="text-xs text-gray-500">最后检查: 2025-12-24 08:15:00</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AuditLogManagement