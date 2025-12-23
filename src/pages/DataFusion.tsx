import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Tag, Progress, Timeline, Statistic } from 'antd'
import { 
  DatabaseOutlined, 
  CloudSyncOutlined, 
  ApiOutlined, 
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { DataSource, CorrelationResult } from '@/types'
import { generateMockDataSources, generateMockCorrelationResults } from '@/utils/mockData'

const DataFusion: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [correlationResults, setCorrelationResults] = useState<CorrelationResult[]>([])

  useEffect(() => {
    // 加载模拟数据
    setDataSources(generateMockDataSources())
    setCorrelationResults(generateMockCorrelationResults())
  }, [])

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'identity': return <DatabaseOutlined />
      case 'network': return <CloudSyncOutlined />
      case 'security': return <AlertOutlined />
      case 'threat_intel': return <ApiOutlined />
      default: return <DatabaseOutlined />
    }
  }

  const getDataSourceTypeText = (type: string) => {
    switch (type) {
      case 'identity': return '身份数据'
      case 'network': return '网络数据'
      case 'security': return '安全数据'
      case 'threat_intel': return '威胁情报'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'green'
      case 'disconnected': return 'red'
      case 'error': return 'orange'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '已连接'
      case 'disconnected': return '断开连接'
      case 'error': return '错误'
      default: return status
    }
  }

  // 数据融合指标图表配置
  const getDataQualityChartOption = () => ({
    title: {
      text: '数据源质量评估',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['数据质量', '记录数量'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: dataSources.map(ds => ds.name)
    },
    yAxis: [
      {
        type: 'value',
        name: '质量分数',
        max: 100
      },
      {
        type: 'value',
        name: '记录数量',
        max: 20000
      }
    ],
    series: [
      {
        name: '数据质量',
        type: 'bar',
        data: dataSources.map(ds => ds.dataQuality),
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '记录数量',
        type: 'line',
        yAxisIndex: 1,
        data: dataSources.map(ds => ds.recordCount),
        itemStyle: {
          color: '#52c41a'
        }
      }
    ]
  })

  // 关联分析矩阵图配置
  const getCorrelationMatrixOption = () => ({
    title: {
      text: '数据关联分析矩阵',
      left: 'center'
    },
    tooltip: {
      position: 'top',
      formatter: function(params: any) {
        return `${params.data[0]} - ${params.data[1]}<br/>关联度: ${params.data[2]}`
      }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: ['身份数据', '网络数据', '安全数据', '威胁情报'],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['身份数据', '网络数据', '安全数据', '威胁情报'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
      }
    },
    series: [{
      name: '关联度',
      type: 'heatmap',
      data: [
        [0, 0, 1.0],
        [0, 1, 0.85],
        [0, 2, 0.72],
        [0, 3, 0.45],
        [1, 1, 1.0],
        [1, 2, 0.68],
        [1, 3, 0.52],
        [2, 2, 1.0],
        [2, 3, 0.92],
        [3, 3, 1.0]
      ],
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  const dataSourceColumns = [
    {
      title: '数据源',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: DataSource) => (
        <div className="flex items-center space-x-2">
          {getDataSourceIcon(record.type)}
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">
              {getDataSourceTypeText(record.type)}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={
          status === 'connected' ? <CheckCircleOutlined /> : 
          status === 'disconnected' ? <CloseCircleOutlined /> : <SyncOutlined spin />
        }>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '记录数量',
      dataIndex: 'recordCount',
      key: 'recordCount',
      render: (count: number) => count.toLocaleString()
    },
    {
      title: '数据质量',
      dataIndex: 'dataQuality',
      key: 'dataQuality',
      render: (quality: number) => (
        <div className="w-24">
          <Progress percent={quality} size="small" />
          <span className="text-sm text-gray-500">{quality}%</span>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 数据融合总体指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="数据源总数"
              value={dataSources.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="已连接数据源"
              value={dataSources.filter(ds => ds.status === 'connected').length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="平均数据质量"
              value={Math.round(dataSources.reduce((sum, ds) => sum + ds.dataQuality, 0) / dataSources.length)}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="security-stat-card">
            <Statistic
              title="关联分析结果"
              value={correlationResults.length}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="数据源质量评估" className="security-card">
            <ReactECharts 
              option={getDataQualityChartOption()} 
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="数据关联分析矩阵" className="security-card">
            <ReactECharts 
              option={getCorrelationMatrixOption()} 
              style={{ height: '400px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 数据源状态 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="数据源状态监控" className="security-card">
            <Table
              columns={dataSourceColumns}
              dataSource={dataSources}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="融合分析洞察" className="security-card">
            <Timeline>
              <Timeline.Item color="blue">
                <p><strong>数据质量提升</strong></p>
                <p>威胁情报库数据质量从 85% 提升至 87.3%</p>
                <p>时间: 2025-12-23 14:15:00</p>
              </Timeline.Item>
              <Timeline.Item color="green">
                <p><strong>新数据源接入</strong></p>
                <p>设备身份库成功接入系统</p>
                <p>记录数量: 1,250 条</p>
                <p>时间: 2025-12-23 13:45:00</p>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <p><strong>数据同步异常</strong></p>
                <p>网络流量监控数据延迟 5 分钟</p>
                <p>正在自动重试连接...</p>
                <p>时间: 2025-12-23 13:30:00</p>
              </Timeline.Item>
              <Timeline.Item color="purple">
                <p><strong>关联规则更新</strong></p>
                <p>新增身份-网络数据关联规则</p>
                <p>触发条件: 异常设备接入</p>
                <p>时间: 2025-12-23 12:00:00</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 关联分析结果 */}
      <Card title="关联分析结果" className="security-card">
        <Row gutter={[16, 16]}>
          {correlationResults.map((result) => (
            <Col xs={24} lg={12} key={result.id}>
              <Card size="small" className="mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">分析结果 #{result.id}</h4>
                    <Tag color="blue">关联度: {Math.round(result.correlation * 100)}%</Tag>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-2">涉及数据源:</div>
                    <div className="flex flex-wrap gap-1">
                      {result.sourceTypes.map((type) => (
                        <Tag key={type} color="cyan">
                          {getDataSourceTypeText(type)}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">关键洞察:</div>
                    <ul className="text-sm space-y-1">
                      {result.insights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">风险因素:</div>
                    <div className="flex flex-wrap gap-1">
                      {result.riskFactors.map((factor) => (
                        <Tag key={factor} color="red">
                          {factor}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">建议措施:</div>
                    <ul className="text-sm space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default DataFusion