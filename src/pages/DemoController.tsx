import React, { useState, useEffect } from 'react'
import { Card, Button, Select, Progress, Space, Row, Col, Statistic, Alert, Switch } from 'antd'
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  ReloadOutlined,
  VideoCameraOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { demoController, demoScenarios } from '@/utils/demoScenarios'

// 演示控制面板组件
const DemoController: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('complete_overview')
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('')
  const [currentAction, setCurrentAction] = useState('')
  const [autoPlay, setAutoPlay] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [showGuide, setShowGuide] = useState(true)

  useEffect(() => {
    // 监听演示事件
    demoController.on('scenario_started', (data: any) => {
      setIsRunning(true)
      setCurrentPhase(data.scenario.phases[0]?.name || '')
    })

    demoController.on('action_executed', (data: any) => {
      setCurrentPhase(data.phase?.name || '')
      setCurrentAction(data.action?.content || '')
      setProgress(demoController.getCurrentState().progress)
    })

    demoController.on('scenario_completed', () => {
      setIsRunning(false)
      setCurrentPhase('')
      setCurrentAction('')
      setProgress(100)
    })

    demoController.on('scenario_stopped', () => {
      setIsRunning(false)
      setCurrentPhase('')
      setCurrentAction('')
      setProgress(0)
    })

    return () => {
      // 清理事件监听
      demoController.stopScenario()
    }
  }, [])

  const handleStartDemo = () => {
    if (isRunning) {
      demoController.stopScenario()
    } else {
      demoController.startScenario(selectedScenario, (data: any) => {
        console.log('Demo update:', data)
      })
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    demoController.stopScenario()
    setProgress(0)
    setCurrentPhase('')
    setCurrentAction('')
  }

  const currentScenario = demoScenarios.find(s => s.id === selectedScenario)
  const estimatedTime = currentScenario ? Math.ceil(currentScenario.duration / 60000) : 0

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 演示标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <VideoCameraOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          演示控制中心
        </h1>
        <p style={{ color: '#666' }}>专业客户演示控制系统</p>
      </div>

      {/* 演示指南 */}
      {showGuide && (
        <Alert
          message="演示控制指南"
          description={
            <div>
              <p>1. 选择演示场景 → 2. 配置演示参数 → 3. 开始演示</p>
              <p>演示过程中可以暂停、重置或切换场景</p>
              <p>建议在正式演示前先预览整个流程</p>
            </div>
          }
          type="info"
          closable
          onClose={() => setShowGuide(false)}
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={[24, 24]}>
        {/* 演示配置 */}
        <Col xs={24} lg={12}>
          <Card title="演示配置" className="security-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 场景选择 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                  选择演示场景
                </label>
                <Select
                  value={selectedScenario}
                  onChange={setSelectedScenario}
                  style={{ width: '100%' }}
                  disabled={isRunning}
                >
                  {demoScenarios.map(scenario => (
                    <Select.Option key={scenario.id} value={scenario.id}>
                      {scenario.name} ({Math.ceil(scenario.duration / 60000)}分钟)
                    </Select.Option>
                  ))}
                </Select>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {currentScenario?.description}
                </p>
              </div>

              {/* 演示参数 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                  演示参数
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>自动播放</span>
                    <Switch 
                      checked={autoPlay} 
                      onChange={setAutoPlay}
                      disabled={isRunning}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>演示速度</span>
                    <Select
                      value={speed}
                      onChange={setSpeed}
                      style={{ width: 120 }}
                      disabled={isRunning}
                    >
                      <Select.Option value={0.5}>0.5x 慢速</Select.Option>
                      <Select.Option value={1}>1x 正常</Select.Option>
                      <Select.Option value={1.5}>1.5x 快速</Select.Option>
                      <Select.Option value={2}>2x 快速</Select.Option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 目标受众 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                  目标受众
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentScenario?.targetAudience.map(audience => (
                    <span
                      key={audience}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#e6f7ff',
                        color: '#1890ff',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关键特性 */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                  关键演示特性
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentScenario?.keyFeatures.map(feature => (
                    <span
                      key={feature}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f6ffed',
                        color: '#52c41a',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 演示状态 */}
        <Col xs={24} lg={12}>
          <Card title="演示状态" className="security-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 状态统计 */}
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="演示进度"
                    value={progress}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: progress === 100 ? '#52c41a' : '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="预计时长"
                    value={estimatedTime}
                    suffix="分钟"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
              </Row>

              {/* 进度条 */}
              <div>
                <Progress 
                  percent={progress} 
                  status={progress === 100 ? 'success' : 'active'}
                  strokeColor={progress === 100 ? '#52c41a' : '#1890ff'}
                />
              </div>

              {/* 当前状态 */}
              {currentPhase && (
                <div style={{ padding: '12px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1890ff', marginBottom: '4px' }}>
                    当前阶段: {currentPhase}
                  </div>
                  {currentAction && (
                    <div style={{ fontSize: '12px', color: '#1890ff' }}>
                      {currentAction}
                    </div>
                  )}
                </div>
              )}

              {/* 控制按钮 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={handleStartDemo}
                  block
                >
                  {isRunning ? '暂停演示' : '开始演示'}
                </Button>
                
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  disabled={isRunning}
                  block
                >
                  重置演示
                </Button>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 演示场景详情 */}
        <Col xs={24}>
          <Card title="演示场景详情" className="security-card">
            {currentScenario && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                    {currentScenario.name}
                  </h3>
                  <p style={{ color: '#666' }}>{currentScenario.description}</p>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                    演示阶段
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '16px' 
                  }}>
                    {currentScenario.phases.map((phase, index) => (
                      <div 
                        key={phase.id}
                        style={{
                          padding: '12px',
                          border: `1px solid ${currentPhase === phase.name ? '#1890ff' : '#d9d9d9'}`,
                          borderRadius: '8px',
                          backgroundColor: currentPhase === phase.name ? '#e6f7ff' : '#fafafa'
                        }}
                      >
                        <div style={{ fontWeight: '500', color: '#333' }}>
                          {index + 1}. {phase.name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                          {phase.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                          预计时长: {Math.ceil(phase.duration / 60000)}分钟
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* 演示提示 */}
        <Col xs={24}>
          <Card title="演示提示" className="security-card">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fffbe6', borderRadius: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#d48806', marginBottom: '8px' }}>
                    💡 演示建议
                  </div>
                  <div style={{ fontSize: '14px', color: '#d48806' }}>
                    在正式演示前，建议先预览完整流程，确保熟悉每个环节
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#52c41a', marginBottom: '8px' }}>
                    🎯 演示重点
                  </div>
                  <div style={{ fontSize: '14px', color: '#52c41a' }}>
                    重点展示AI分析能力和实时威胁响应，体现技术先进性
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1890ff', marginBottom: '8px' }}>
                    ⏰ 时间控制
                  </div>
                  <div style={{ fontSize: '14px', color: '#1890ff' }}>
                    演示时长根据受众调整，技术团队可详细讲解，业务方重点演示
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DemoController