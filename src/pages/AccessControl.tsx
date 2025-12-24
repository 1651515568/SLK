import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Row, Col, Statistic, Modal, Form, Input, Select, Switch } from 'antd'
import { 
  SafetyCertificateOutlined as ShieldOutlined, 
  BlockOutlined, 
  EyeOutlined, 
  PlusOutlined,
  // EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { BlockEvent, BlockRule } from '@/types'
import { generateMockBlockEvents, generateMockBlockRules } from '@/utils/mockData'

const AccessControl: React.FC = () => {
  const [blockEvents, setBlockEvents] = useState<BlockEvent[]>([])
  const [blockRules, setBlockRules] = useState<BlockRule[]>([])
  const [ruleModalVisible, setRuleModalVisible] = useState(false)
  const [editingRule, setEditingRule] = useState<BlockRule | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setBlockEvents(generateMockBlockEvents())
    setBlockRules(generateMockBlockRules())
  }

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
      case 'low': return '低'
      case 'medium': return '中'
      case 'high': return '高'
      case 'critical': return '严重'
      default: return level
    }
  }

  const getBlockTypeText = (type: string) => {
    switch (type) {
      case 'automatic': return '自动阻断'
      case 'manual': return '手动阻断'
      case 'policy': return '策略阻断'
      default: return type
    }
  }

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'automatic': return 'blue'
      case 'manual': return 'orange'
      case 'policy': return 'purple'
      default: return 'default'
    }
  }

  const handleEditRule = (rule: BlockRule) => {
    setEditingRule(rule)
    form.setFieldsValue(rule)
    setRuleModalVisible(true)
  }

  const handleAddRule = () => {
    setEditingRule(null)
    form.resetFields()
    setRuleModalVisible(true)
  }

  const handleSaveRule = () => {
    form.validateFields().then(values => {
      // 这里应该调用API保存规则
      console.log('Save rule:', values)
      setRuleModalVisible(false)
    })
  }

  // 阻断趋势图表配置
  const getBlockTrendChartOption = () => ({
    title: {
      text: '阻断趋势分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['自动阻断', '手动阻断', '策略阻断'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
    },
    yAxis: {
      type: 'value',
      name: '阻断次数'
    },
    series: [
      {
        name: '自动阻断',
        type: 'line',
        data: [2, 1, 0, 3, 5, 8, 12],
        smooth: true,
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '手动阻断',
        type: 'line',
        data: [0, 1, 2, 1, 0, 2, 3],
        smooth: true,
        itemStyle: { color: '#fa8c16' }
      },
      {
        name: '策略阻断',
        type: 'line',
        data: [1, 0, 1, 2, 3, 2, 4],
        smooth: true,
        itemStyle: { color: '#722ed1' }
      }
    ]
  })

  // 阻断原因分布图表配置
  const getBlockReasonChartOption = () => ({
    title: {
      text: '阻断原因分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 35, name: '非法设备接入' },
        { value: 25, name: '高风险行为' },
        { value: 20, name: '合规检查失败' },
        { value: 15, name: '威胁情报匹配' },
        { value: 5, name: '其他原因' }
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

  const eventColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
    },
    {
      title: '设备信息',
      key: 'deviceInfo',
      width: 200,
      render: (record: BlockEvent) => (
        <div>
          <div className="font-medium">{record.deviceInfo.deviceName}</div>
          <div className="text-sm text-gray-500">{record.deviceInfo.macAddress}</div>
        </div>
      )
    },
    {
      title: '阻断原因',
      dataIndex: 'blockReason',
      key: 'blockReason',
    },
    {
      title: '阻断类型',
      dataIndex: 'blockType',
      key: 'blockType',
      render: (type: string) => (
        <Tag color={getBlockTypeColor(type)}>
          {getBlockTypeText(type)}
        </Tag>
      )
    },
    {
      title: '威胁等级',
      dataIndex: 'threatLevel',
      key: 'threatLevel',
      render: (level: string) => (
        <Tag color={getThreatLevelColor(level)}>
          {getThreatLevelText(level)}
        </Tag>
      )
    },
    {
      title: '结果',
      key: 'result',
      render: (record: BlockEvent) => (
        <Tag color={record.success ? 'green' : 'red'}>
          {record.success ? '成功' : '失败'}
        </Tag>
      )
    }
  ]

  const ruleColumns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '触发条件',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: '执行动作',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actionMap = {
          'block': { text: '阻断', color: 'red' },
          'monitor': { text: '监控', color: 'orange' },
          'alert': { text: '告警', color: 'blue' }
        }
        const config = (actionMap as any)[action] || { text: action, color: 'default' }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '命中次数',
      dataIndex: 'hitCount',
      key: 'hitCount',
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: BlockRule) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleEditRule(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 阻断统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="今日阻断次数"
              value={blockEvents.filter(e => e.timestamp.includes('2025-12-23')).length}
              valueStyle={{ color: '#f5222d' }}
              prefix={<BlockOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="阻断成功率"
              value={Math.round((blockEvents.filter(e => e.success).length / blockEvents.length) * 100)}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ShieldOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="活跃规则数"
              value={blockRules.filter(r => r.enabled).length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="平均响应时间"
              value={1.2}
              suffix="秒"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="阻断趋势分析" className="security-card">
            <ReactECharts 
              option={getBlockTrendChartOption()} 
              style={{ height: '300px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="阻断原因分布" className="security-card">
            <ReactECharts 
              option={getBlockReasonChartOption()} 
              style={{ height: '300px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 实时阻断事件 */}
      <Card 
        title="实时阻断事件" 
        className="security-card"
      >
        <Table
          columns={eventColumns}
          dataSource={blockEvents}
          rowKey="id"
          pagination={{
            total: blockEvents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 阻断规则管理 */}
      <Card 
        title="阻断规则管理" 
        className="security-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRule}
          >
            新增规则
          </Button>
        }
      >
        <Table
          columns={ruleColumns}
          dataSource={blockRules}
          rowKey="id"
          pagination={{
            total: blockRules.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 规则编辑弹窗 */}
      <Modal
        title={editingRule ? '编辑阻断规则' : '新增阻断规则'}
        open={ruleModalVisible}
        onOk={handleSaveRule}
        onCancel={() => setRuleModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            enabled: true,
            action: 'block'
          }}
        >
          <Form.Item
            label="规则名称"
            name="name"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            label="触发条件"
            name="condition"
            rules={[{ required: true, message: '请输入触发条件' }]}
          >
            <Input.TextArea 
              placeholder="例如：device_type = illegal_device AND risk_level = high"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="执行动作"
            name="action"
            rules={[{ required: true, message: '请选择执行动作' }]}
          >
            <Select placeholder="请选择执行动作">
              <Select.Option value="block">阻断</Select.Option>
              <Select.Option value="monitor">监控</Select.Option>
              <Select.Option value="alert">告警</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="启用状态"
            name="enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AccessControl