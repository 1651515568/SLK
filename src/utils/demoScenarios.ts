// 演示场景管理模块


// 演示场景定义
export interface DemoScenario {
  id: string
  name: string
  description: string
  duration: number // 演示时长（毫秒）
  phases: DemoPhase[]
  targetAudience: string[]
  keyFeatures: string[]
}

export interface DemoPhase {
  id: string
  name: string
  description: string
  duration: number
  actions: DemoAction[]
}

export interface DemoAction {
  type: 'navigate' | 'highlight' | 'data_update' | 'alert' | 'explanation'
  target: string
  content: string
  duration?: number
}

// 预定义的演示场景
export const demoScenarios: DemoScenario[] = [
  {
    id: 'complete_overview',
    name: '系统完整功能演示',
    description: '全面展示终端身份识别与安全防护系统的所有核心功能',
    duration: 1800000, // 30分钟
    targetAudience: ['高管', '技术负责人', '客户'],
    keyFeatures: [
      '设备身份精准识别',
      '实时威胁监控',
      'AI智能分析',
      '威胁情报集成',
      '安全态势感知',
      '自动化响应'
    ],
    phases: [
      {
        id: 'introduction',
        name: '系统介绍',
        description: '项目背景和核心价值介绍',
        duration: 300000, // 5分钟
        actions: [
          {
            type: 'explanation',
            target: 'security-overview',
            content: '欢迎使用终端身份识别与安全防护系统。本系统专为国网北京电力公司设计，旨在构建主动安全防御体系。',
            duration: 60000
          },
          {
            type: 'navigate',
            target: 'security-overview',
            content: '首先让我们查看安全态势总览页面',
            duration: 30000
          },
          {
            type: 'highlight',
            target: 'key_metrics',
            content: '系统显示设备识别准确率95.8%，非法设备阻断率92.3%，响应时间缩短50%',
            duration: 120000
          }
        ]
      },
      {
        id: 'device_identification',
        name: '设备身份识别',
        description: '展示设备精准识别和分类功能',
        duration: 600000, // 10分钟
        actions: [
          {
            type: 'navigate',
            target: 'device-identification',
            content: '进入设备身份识别模块，展示1000+设备的实时监控',
            duration: 60000
          },
          {
            type: 'data_update',
            target: 'device_list',
            content: '展示电力专用终端、办公终端与非法设备的自动分类',
            duration: 180000
          },
          {
            type: 'explanation',
            target: 'classification',
            content: '系统基于设备特征、网络行为和合规状态进行智能分类',
            duration: 120000
          },
          {
            type: 'highlight',
            target: 'risk_analysis',
            content: '风险等级评估和实时监控',
            duration: 240000
          }
        ]
      },
      {
        id: 'soc_monitoring',
        name: '安全运营中心',
        description: '实时威胁监控和响应演示',
        duration: 450000, // 7.5分钟
        actions: [
          {
            type: 'navigate',
            target: 'soc-dashboard',
            content: '进入安全运营中心，查看实时威胁态势',
            duration: 45000
          },
          {
            type: 'data_update',
            target: 'threat_map',
            content: '展示全球威胁情报态势和APT组织活动',
            duration: 180000
          },
          {
            type: 'alert',
            target: 'real_time_events',
            content: '模拟实时安全事件：检测到APT攻击，AI系统自动分析威胁等级',
            duration: 90000
          },
          {
            type: 'explanation',
            target: 'response_capabilities',
            content: '系统自动触发响应机制，阻断恶意流量',
            duration: 135000
          }
        ]
      },
      {
        id: 'ai_analysis',
        name: 'AI智能分析',
        description: '机器学习驱动的威胁分析演示',
        duration: 300000, // 5分钟
        actions: [
          {
            type: 'navigate',
            target: 'ai-analysis',
            content: '进入AI智能分析模块',
            duration: 30000
          },
          {
            type: 'highlight',
            target: 'prediction_model',
            content: 'AI模型预测未来24小时内可能出现APT攻击，置信度92.5%',
            duration: 120000
          },
          {
            type: 'data_update',
            target: 'anomaly_detection',
            content: '异常行为检测热力图显示用户行为模式分析',
            duration: 90000
          },
          {
            type: 'explanation',
            target: 'ml_insights',
            content: '基于50万+样本训练的AI模型，准确率达94.7%',
            duration: 60000
          }
        ]
      },
      {
        id: 'threat_intelligence',
        name: '威胁情报集成',
        description: '全球威胁情报整合分析',
        duration: 240000, // 4分钟
        actions: [
          {
            type: 'navigate',
            target: 'threat-intelligence',
            content: '查看威胁情报集成中心',
            duration: 30000
          },
          {
            type: 'highlight',
            target: 'apt_tracking',
            content: '实时跟踪APT41组织活动，威胁等级95',
            duration: 90000
          },
          {
            type: 'data_update',
            target: 'intelligence_sources',
            content: '整合FireEye、CISA、NIST等4个情报源，4862个IOC指标',
            duration: 60000
          },
          {
            type: 'alert',
            target: 'threat_alert',
            content: '新发现威胁：APT28组织针对金融机构的攻击活动',
            duration: 60000
          }
        ]
      },
      {
        id: 'compliance_audit',
        name: '合规审计',
        description: '审计日志管理和合规监控',
        duration: 210000, // 3.5分钟
        actions: [
          {
            type: 'navigate',
            target: 'audit-log',
            content: '进入审计日志管理模块',
            duration: 30000
          },
          {
            type: 'highlight',
            target: 'compliance_status',
            content: '合规性监控：数据保护合规、访问控制审计等',
            duration: 90000
          },
          {
            type: 'data_update',
            target: 'audit_timeline',
            content: '展示完整的审计事件时间线和关键操作记录',
            duration: 60000
          },
          {
            type: 'explanation',
            target: 'regulatory_compliance',
            content: '满足GDPR、网络安全法等法规要求',
            duration: 30000
          }
        ]
      }
    ]
  },
  {
    id: 'threat_response_demo',
    name: '威胁响应演练',
    description: '模拟真实APT攻击的检测、分析和响应过程',
    duration: 900000, // 15分钟
    targetAudience: ['安全团队', '运维人员'],
    keyFeatures: [
      '实时威胁检测',
      '智能分析研判',
      '自动化响应',
      '事件关联分析',
      '威胁溯源',
      '处置建议'
    ],
    phases: [
      {
        id: 'initial_detection',
        name: '初始检测',
        description: '系统检测到异常活动',
        duration: 180000,
        actions: [
          {
            type: 'alert',
            target: 'soc_dashboard',
            content: '检测到来自未知IP的异常扫描行为',
            duration: 60000
          },
          {
            type: 'data_update',
            target: 'device_status',
            content: '设备RTU-003状态变为警告',
            duration: 60000
          },
          {
            type: 'highlight',
            target: 'threat_level',
            content: '威胁等级自动提升至高级',
            duration: 60000
          }
        ]
      },
      {
        id: 'ai_analysis_phase',
        name: 'AI智能分析',
        description: 'AI系统进行威胁分析',
        duration: 240000,
        actions: [
          {
            type: 'navigate',
            target: 'ai-analysis',
            content: 'AI系统自动启动深度分析',
            duration: 30000
          },
          {
            type: 'data_update',
            target: 'behavior_analysis',
            content: '分析设备行为模式：异常通信、权限提升尝试',
            duration: 120000
          },
          {
            type: 'highlight',
            target: 'threat_attribution',
            content: 'AI模型识别：APT29组织TTPs匹配度89.7%',
            duration: 90000
          }
        ]
      },
      {
        id: 'intelligence_correlation',
        name: '情报关联',
        description: '威胁情报匹配和关联分析',
        duration: 180000,
        actions: [
          {
            type: 'navigate',
            target: 'threat-intelligence',
            content: '查询威胁情报库进行匹配',
            duration: 30000
          },
          {
            type: 'data_update',
            target: 'ioc_matching',
            content: 'IOC指标匹配：IP 203.0.113.45 出现在APT29威胁情报中',
            duration: 90000
          },
          {
            type: 'highlight',
            target: 'campaign_tracking',
            content: '确认为APT29针对电力行业的持续攻击活动',
            duration: 60000
          }
        ]
      },
      {
        id: 'automated_response',
        name: '自动化响应',
        description: '系统执行自动响应措施',
        duration: 300000,
        actions: [
          {
            type: 'navigate',
            target: 'access-control',
            content: '自动执行接入阻断策略',
            duration: 60000
          },
          {
            type: 'alert',
            target: 'block_action',
            content: '成功阻断可疑设备接入，隔离RTU-003',
            duration: 120000
          },
          {
            type: 'data_update',
            target: 'incident_record',
            content: '生成安全事件报告，记录所有响应动作',
            duration: 120000
          }
        ]
      }
    ]
  }
]

// 演示控制器
export class DemoController {
  private currentScenario: DemoScenario | null = null
  private currentPhaseIndex = 0
  private currentActionIndex = 0
  private isRunning = false
  private callbacks: { [key: string]: Function[] } = {}

  // 开始演示
  startScenario(scenarioId: string, onUpdate?: (data: any) => void) {
    const scenario = demoScenarios.find(s => s.id === scenarioId)
    if (!scenario) {
      console.error(`Scenario ${scenarioId} not found`)
      return
    }

    this.currentScenario = scenario
    this.currentPhaseIndex = 0
    this.currentActionIndex = 0
    this.isRunning = true

    this.notify('scenario_started', { scenario })

    if (onUpdate) {
      this.on('action_executed', onUpdate)
    }

    this.executeCurrentAction()
  }

  // 执行当前动作
  private executeCurrentAction() {
    if (!this.currentScenario || !this.isRunning) return

    const phase = this.currentScenario.phases[this.currentPhaseIndex]
    if (!phase) {
      this.completeScenario()
      return
    }

    const action = phase.actions[this.currentActionIndex]
    if (!action) {
      this.nextPhase()
      return
    }

    // 执行动作
    this.executeAction(action)

    // 安排下一个动作
    const delay = action.duration || 5000
    setTimeout(() => {
      this.nextAction()
    }, delay)
  }

  // 执行具体动作
  private executeAction(action: DemoAction) {
    this.notify('action_executed', {
      action,
      phase: this.currentScenario?.phases[this.currentPhaseIndex],
      scenario: this.currentScenario
    })

    // 根据动作类型执行相应操作
    switch (action.type) {
      case 'navigate':
        this.navigateToPage(action.target)
        break
      case 'highlight':
        this.highlightElement(action.target)
        break
      case 'data_update':
        this.simulateDataUpdate(action.target)
        break
      case 'alert':
        this.showAlert(action.content)
        break
      case 'explanation':
        this.showExplanation(action.content)
        break
    }
  }

  // 导航到指定页面
  private navigateToPage(page: string) {
    // 这里应该触发路由导航
    this.notify('navigation', { target: page })
    console.log(`Navigating to: ${page}`)
  }

  // 高亮元素
  private highlightElement(selector: string) {
    this.notify('highlight', { selector })
    console.log(`Highlighting: ${selector}`)
  }

  // 模拟数据更新
  private simulateDataUpdate(target: string) {
    this.notify('data_update', { target })
    console.log(`Updating data for: ${target}`)
  }

  // 显示警告
  private showAlert(content: string) {
    this.notify('alert', { content })
    console.log(`Alert: ${content}`)
  }

  // 显示说明
  private showExplanation(content: string) {
    this.notify('explanation', { content })
    console.log(`Explanation: ${content}`)
  }

  // 下一个动作
  private nextAction() {
    if (!this.currentScenario) return

    const phase = this.currentScenario.phases[this.currentPhaseIndex]
    this.currentActionIndex++

    if (this.currentActionIndex >= phase.actions.length) {
      this.nextPhase()
    } else {
      this.executeCurrentAction()
    }
  }

  // 下一个阶段
  private nextPhase() {
    if (!this.currentScenario) return

    this.currentPhaseIndex++
    this.currentActionIndex = 0

    if (this.currentPhaseIndex >= this.currentScenario.phases.length) {
      this.completeScenario()
    } else {
      this.executeCurrentAction()
    }
  }

  // 完成演示
  private completeScenario() {
    this.isRunning = false
    this.notify('scenario_completed', { scenario: this.currentScenario })
    console.log('Demo scenario completed')
  }

  // 停止演示
  stopScenario() {
    this.isRunning = false
    this.currentScenario = null
    this.currentPhaseIndex = 0
    this.currentActionIndex = 0
    this.notify('scenario_stopped', {})
  }

  // 事件监听
  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  // 事件通知
  private notify(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data))
    }
  }

  // 获取当前状态
  getCurrentState() {
    return {
      isRunning: this.isRunning,
      scenario: this.currentScenario,
      phaseIndex: this.currentPhaseIndex,
      actionIndex: this.currentActionIndex,
      progress: this.calculateProgress()
    }
  }

  // 计算进度
  private calculateProgress() {
    if (!this.currentScenario) return 0

    let completedActions = 0
    let totalActions = 0

    // 计算已完成的动作
    for (let i = 0; i < this.currentPhaseIndex; i++) {
      completedActions += this.currentScenario.phases[i].actions.length
    }
    completedActions += this.currentActionIndex

    // 计算总动作数
    for (const phase of this.currentScenario.phases) {
      totalActions += phase.actions.length
    }

    return (completedActions / totalActions) * 100
  }
}

// 全局演示控制器实例
export const demoController = new DemoController()

// 预设的演示脚本
export const demoScripts = {
  // 客户演示脚本（5分钟快速版）
  clientPresentation: {
    scenarioId: 'complete_overview',
    highlights: [
      { page: 'security-overview', focus: '核心指标展示', duration: 60 },
      { page: 'device-identification', focus: '设备分类功能', duration: 90 },
      { page: 'soc-dashboard', focus: '实时监控大屏', duration: 120 },
      { page: 'ai-analysis', focus: 'AI分析能力', duration: 60 },
      { page: 'threat-intelligence', focus: '威胁情报', duration: 30 }
    ]
  },

  // 技术演示脚本（深度技术版）
  technicalDemo: {
    scenarioId: 'complete_overview',
    focus: '详细功能展示',
    duration: 1800 // 30分钟
  },

  // 威胁响应演练脚本
  threatResponseDemo: {
    scenarioId: 'threat_response_demo',
    description: '完整的威胁检测、分析和响应流程',
    duration: 900 // 15分钟
  }
}