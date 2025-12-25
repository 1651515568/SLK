import React, { useState, useEffect, useMemo } from 'react'
import { Card, Tag, Button, Space, Input, Select, Row, Col, Modal, Descriptions, Statistic } from 'antd'
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
// import ReactECharts from 'echarts-for-react'
import { DeviceInfo } from '@/types'
import { generateMockDevices } from '@/utils/mockData'
import VirtualScrollTable from '@/components/common/VirtualScrollTable'
import LoadingState from '@/components/common/LoadingState'
import OptimizedChart from '@/components/common/OptimizedChart'

const DeviceIdentification: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([])
  const [filteredDevices, setFilteredDevices] = useState<DeviceInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all')
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('all')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [batchActionModalVisible, setBatchActionModalVisible] = useState(false)
  const [currentBatchAction, setCurrentBatchAction] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loadingStates, _setLoadingStates] = useState({
    stats: false,
    charts: false,
    table: false
  })

  useEffect(() => {
    loadDevices()
  }, [])

  useEffect(() => {
    filterDevices()
  }, [devices, searchText, deviceTypeFilter, riskLevelFilter])

  const loadDevices = async () => {
    setLoading(true)
    // 模拟异步加载
    setTimeout(() => {
      const mockDevices = generateMockDevices(100)
      setDevices(mockDevices)
      setLoading(false)
    }, 1000)
  }

  const filterDevices = () => {
    let filtered = devices

    // 文本搜索
    if (searchText) {
      filtered = filtered.filter(device =>
        device.deviceName.toLowerCase().includes(searchText.toLowerCase()) ||
        device.macAddress.toLowerCase().includes(searchText.toLowerCase()) ||
        device.ipAddress.includes(searchText)
      )
    }

    // 设备类型过滤
    if (deviceTypeFilter !== 'all') {
      filtered = filtered.filter(device => device.deviceType === deviceTypeFilter)
    }

    // 风险等级过滤
    if (riskLevelFilter !== 'all') {
      filtered = filtered.filter(device => device.riskLevel === riskLevelFilter)
    }

    setFilteredDevices(filtered)
  }

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'trusted': return 'green'
      case 'suspicious': return 'orange'
      case 'malicious': return 'red'
      default: return 'default'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'green'
      case 'medium': return 'orange'
      case 'high': return 'red'
      case 'critical': return 'magenta'
      default: return 'default'
    }
  }

  const getDeviceTypeText = (type: string) => {
    switch (type) {
      case 'power_terminal': return '电力专用终端'
      case 'office_terminal': return '办公终端'
      case 'illegal_device': return '非法设备'
      default: return type
    }
  }

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'power_terminal': return 'blue'
      case 'office_terminal': return 'cyan'
      case 'illegal_device': return 'red'
      default: return 'default'
    }
  }

  const handleViewDetail = (device: DeviceInfo) => {
    setSelectedDevice(device)
    setDetailModalVisible(true)
  }

  // 批量操作功能
  const handleBatchAction = (action: string) => {
    if (selectedRowKeys.length === 0) {
      return
    }
    setCurrentBatchAction(action)
    setBatchActionModalVisible(true)
  }

  const confirmBatchAction = () => {
    console.log(`执行批量${currentBatchAction}:`, selectedRowKeys)
    // 模拟批量操作
    setBatchActionModalVisible(false)
    setSelectedRowKeys([])
  }

  // 表格行选择配置
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  // 设备统计图表配置
  const getDeviceTypeChartOption = useMemo(() => ({
    title: {
      text: '设备类型分布',
      left: 'center' as const
    },
    tooltip: {
      trigger: 'item' as const,
      confine: true
    },
    series: [{
      type: 'pie' as const,
      radius: '60%',
      data: [
        { value: devices.filter(d => d.deviceType === 'power_terminal').length, name: '电力专用终端' },
        { value: devices.filter(d => d.deviceType === 'office_terminal').length, name: '办公终端' },
        { value: devices.filter(d => d.deviceType === 'illegal_device').length, name: '非法设备' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }), [devices])

  // 风险等级分布图表配置
  const getRiskLevelChartOption = useMemo(() => ({
    title: {
      text: '风险等级分布',
      left: 'center' as const
    },
    tooltip: {
      trigger: 'item' as const,
      confine: true
    },
    series: [{
      type: 'pie' as const,
      radius: '60%',
      data: [
        { value: devices.filter(d => d.riskLevel === 'low').length, name: '低风险' },
        { value: devices.filter(d => d.riskLevel === 'medium').length, name: '中风险' },
        { value: devices.filter(d => d.riskLevel === 'high').length, name: '高风险' },
        { value: devices.filter(d => d.riskLevel === 'critical').length, name: '严重风险' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }), [devices])

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 150,
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 120,
      render: (type: string) => (
        <Tag color={getDeviceTypeColor(type)}>{getDeviceTypeText(type)}</Tag>
      )
    },
    {
      title: 'MAC地址',
      dataIndex: 'macAddress',
      key: 'macAddress',
      width: 160,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
    },
    {
      title: '安全状态',
      dataIndex: 'securityStatus',
      key: 'securityStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getSecurityStatusColor(status)}>
          {status === 'trusted' ? '可信' : status === 'suspicious' ? '可疑' : '恶意'}
        </Tag>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level: string) => (
        <Tag color={getRiskLevelColor(level)}>
          {level === 'low' ? '低' : level === 'medium' ? '中' : level === 'high' ? '高' : '严重'}
        </Tag>
      )
    },
    {
      title: '最后活动',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: 160,
    },
    {
      title: '合规状态',
      dataIndex: 'complianceStatus',
      key: 'complianceStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'compliant' ? 'green' : status === 'non_compliant' ? 'red' : 'default'}>
          {status === 'compliant' ? '合规' : status === 'non_compliant' ? '不合规' : '未知'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: DeviceInfo) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 设备统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="设备总数"
              value={devices.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="可信设备"
              value={devices.filter(d => d.securityStatus === 'trusted').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="可疑设备"
              value={devices.filter(d => d.securityStatus === 'suspicious').length}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="恶意设备"
              value={devices.filter(d => d.securityStatus === 'malicious').length}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="设备类型分布" className="security-card">
            <LoadingState loading={loading} skeleton={false}>
              <OptimizedChart
                option={getDeviceTypeChartOption}
                height={300}
                loading={loading}
                lazyUpdate={true}
                animationDuration={300}
              />
            </LoadingState>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="风险等级分布" className="security-card">
            <LoadingState loading={loading} skeleton={false}>
              <OptimizedChart
                option={getRiskLevelChartOption}
                height={300}
                loading={loading}
                lazyUpdate={true}
                animationDuration={300}
              />
            </LoadingState>
          </Card>
        </Col>
      </Row>

      {/* 设备列表 */}
      <Card 
        title="设备识别列表" 
        className="security-card"
        extra={
          <Space>
            {selectedRowKeys.length > 0 && (
              <Space>
                <span className="text-gray-600">已选择 {selectedRowKeys.length} 项</span>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleBatchAction('监控')}
                >
                  批量监控
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleBatchAction('标记')}
                >
                  批量标记
                </Button>
              </Space>
            )}
            <Button
              icon={<ReloadOutlined />}
              onClick={loadDevices}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        {/* 搜索和过滤 */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索设备名称、MAC地址或IP"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="设备类型"
              style={{ width: '100%' }}
              value={deviceTypeFilter}
              onChange={setDeviceTypeFilter}
            >
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="power_terminal">电力专用终端</Select.Option>
              <Select.Option value="office_terminal">办公终端</Select.Option>
              <Select.Option value="illegal_device">非法设备</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="风险等级"
              style={{ width: '100%' }}
              value={riskLevelFilter}
              onChange={setRiskLevelFilter}
            >
              <Select.Option value="all">全部等级</Select.Option>
              <Select.Option value="low">低风险</Select.Option>
              <Select.Option value="medium">中风险</Select.Option>
              <Select.Option value="high">高风险</Select.Option>
              <Select.Option value="critical">严重风险</Select.Option>
            </Select>
          </Col>
        </Row>

        {/* 设备表格 - 使用虚拟滚动优化 */}
        <LoadingState loading={loading} skeleton={false}>
          <VirtualScrollTable
            dataSource={filteredDevices}
            columns={columns}
            loading={loading}
            height={600}
            rowHeight={60}
            virtualScroll={filteredDevices.length > 100}
            threshold={100}
          />
        </LoadingState>
      </Card>

      {/* 设备详情弹窗 */}
      <Modal
        title="设备详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDevice && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="设备ID">{selectedDevice.id}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{selectedDevice.deviceName}</Descriptions.Item>
            <Descriptions.Item label="设备类型">
              <Tag color={getDeviceTypeColor(selectedDevice.deviceType)}>
                {getDeviceTypeText(selectedDevice.deviceType)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="安全状态">
              <Tag color={getSecurityStatusColor(selectedDevice.securityStatus)}>
                {selectedDevice.securityStatus === 'trusted' ? '可信' : 
                 selectedDevice.securityStatus === 'suspicious' ? '可疑' : '恶意'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="MAC地址">{selectedDevice.macAddress}</Descriptions.Item>
            <Descriptions.Item label="IP地址">{selectedDevice.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="厂商">{selectedDevice.vendor}</Descriptions.Item>
            <Descriptions.Item label="型号">{selectedDevice.model}</Descriptions.Item>
            <Descriptions.Item label="操作系统">{selectedDevice.osVersion}</Descriptions.Item>
            <Descriptions.Item label="风险等级">
              <Tag color={getRiskLevelColor(selectedDevice.riskLevel)}>
                {selectedDevice.riskLevel === 'low' ? '低风险' : 
                 selectedDevice.riskLevel === 'medium' ? '中风险' : 
                 selectedDevice.riskLevel === 'high' ? '高风险' : '严重风险'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="网络位置">{selectedDevice.networkLocation}</Descriptions.Item>
            <Descriptions.Item label="合规状态">
              <Tag color={selectedDevice.complianceStatus === 'compliant' ? 'green' : 
                         selectedDevice.complianceStatus === 'non_compliant' ? 'red' : 'default'}>
                {selectedDevice.complianceStatus === 'compliant' ? '合规' : 
                 selectedDevice.complianceStatus === 'non_compliant' ? '不合规' : '未知'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="行为评分">{selectedDevice.behaviorScore}</Descriptions.Item>
            <Descriptions.Item label="最后活动">{selectedDevice.lastSeen}</Descriptions.Item>
            <Descriptions.Item label="漏洞数量" span={2}>
              <Tag color={selectedDevice.vulnerabilities.length > 0 ? 'red' : 'green'}>
                {selectedDevice.vulnerabilities.length} 个
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 批量操作确认弹窗 */}
      <Modal
        title="批量操作确认"
        open={batchActionModalVisible}
        onOk={confirmBatchAction}
        onCancel={() => setBatchActionModalVisible(false)}
      >
        <p>确定要对选中的 {selectedRowKeys.length} 个设备执行“{currentBatchAction}”操作吗？</p>
      </Modal>
    </div>
  )
}

export default DeviceIdentification