// 实时数据模拟增强模块
import { DeviceInfo } from '@/types'

// 实时威胁场景模拟
export class ThreatScenarioGenerator {
  private scenarios = [
    {
      name: 'APT攻击场景',
      description: '模拟高级持续性威胁攻击',
      events: [
        {
          type: 'reconnaissance',
          severity: 'medium',
          description: '扫描端口和服务',
          duration: 30000
        },
        {
          type: 'initial_access',
          severity: 'high',
          description: '利用漏洞获取初始访问',
          duration: 45000
        },
        {
          type: 'privilege_escalation',
          severity: 'critical',
          description: '权限提升',
          duration: 60000
        },
        {
          type: 'data_exfiltration',
          severity: 'critical',
          description: '数据窃取',
          duration: 120000
        }
      ]
    },
    {
      name: '勒索软件攻击',
      description: '模拟勒索软件感染和加密过程',
      events: [
        {
          type: 'phishing',
          severity: 'high',
          description: '钓鱼邮件传播',
          duration: 15000
        },
        {
          type: 'execution',
          severity: 'critical',
          description: '恶意软件执行',
          duration: 30000
        },
        {
          type: 'encryption',
          severity: 'critical',
          description: '文件加密',
          duration: 180000
        },
        {
          type: 'ransom',
          severity: 'critical',
          description: '勒索通知',
          duration: 10000
        }
      ]
    },
    {
      name: '内部威胁场景',
      description: '模拟内部人员恶意行为',
      events: [
        {
          type: 'unusual_access',
          severity: 'medium',
          description: '异常数据访问',
          duration: 20000
        },
        {
          type: 'data_copy',
          severity: 'high',
          description: '大量数据复制',
          duration: 45000
        },
        {
          type: 'privilege_abuse',
          severity: 'critical',
          description: '权限滥用',
          duration: 30000
        },
        {
          type: 'destruction',
          severity: 'critical',
          description: '数据销毁',
          duration: 60000
        }
      ]
    }
  ]

  getRandomScenario() {
    return this.scenarios[Math.floor(Math.random() * this.scenarios.length)]
  }

  generateScenarioEvents(scenario: any) {
    return scenario.events.map((event: any, index: number) => ({
      id: `scenario-${scenario.name}-${index}`,
      timestamp: new Date(Date.now() + index * 10000).toISOString(),
      type: event.type,
      severity: event.severity,
      description: event.description,
      scenario: scenario.name,
      status: 'active'
    }))
  }
}

// 实时数据更新器
export class RealTimeDataUpdater {
  private subscribers: Array<(data: any) => void> = []
  private updateInterval: number | null = null

  subscribe(callback: (data: any) => void) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback)
    }
  }

  start(interval: number = 5000) {
    this.stop()
    this.updateInterval = setInterval(() => {
      this.broadcastUpdate()
    }, interval)
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private broadcastUpdate() {
    const updateData = this.generateUpdateData()
    this.subscribers.forEach(callback => callback(updateData))
  }

  private generateUpdateData() {
    return {
      timestamp: new Date().toISOString(),
      newEvents: this.generateRandomEvents(),
      deviceUpdates: this.generateDeviceUpdates(),
      threatLevel: this.calculateThreatLevel(),
      systemHealth: this.generateSystemHealth()
    }
  }

  private generateRandomEvents() {
    const eventTypes = ['login_failed', 'suspicious_traffic', 'malware_detected', 'unauthorized_access']
    const severities = ['low', 'medium', 'high', 'critical']
    
    return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, index) => ({
      id: `event-${Date.now()}-${index}`,
      timestamp: new Date().toISOString(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: this.generateEventDescription(),
      source: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      status: 'new'
    }))
  }

  private generateDeviceUpdates() {
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
      id: `device-update-${Date.now()}-${index}`,
      deviceId: `device-${Math.floor(Math.random() * 1000) + 1}`,
      oldStatus: 'online',
      newStatus: Math.random() > 0.8 ? 'warning' : 'online',
      updateTime: new Date().toISOString(),
      reason: this.generateUpdateReason()
    }))
  }

  private calculateThreatLevel() {
    const levels = ['low', 'medium', 'high', 'critical']
    const weights = [0.6, 0.25, 0.12, 0.03] // 概率权重
    const random = Math.random()
    
    let cumulative = 0
    for (let i = 0; i < levels.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        return levels[i]
      }
    }
    return 'low'
  }

  private generateSystemHealth() {
    return {
      cpu: Math.floor(Math.random() * 30) + 30,
      memory: Math.floor(Math.random() * 40) + 40,
      disk: Math.floor(Math.random() * 20) + 60,
      network: Math.floor(Math.random() * 25) + 70
    }
  }

  private generateEventDescription() {
    const descriptions = [
      '检测到异常网络流量模式',
      '识别到可疑文件访问行为',
      '发现未授权的系统配置变更',
      '监测到潜在的恶意软件活动',
      '检测到异常的用户登录模式'
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  private generateUpdateReason() {
    const reasons = [
      '定期健康检查',
      '性能优化',
      '安全策略更新',
      '用户报告问题',
      '系统自动检测'
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }
}

// 增强的设备行为模拟
export class EnhancedDeviceSimulator {
  private deviceBehaviors = {
    'power_terminal': {
      normalOperations: ['数据采集', '状态报告', '命令执行'],
      suspiciousBehaviors: ['异常通信', '未授权命令', '数据异常'],
      attackPatterns: ['协议异常', '命令注入', '数据篡改']
    },
    'office_terminal': {
      normalOperations: ['文档处理', '邮件收发', '网络浏览'],
      suspiciousBehaviors: ['大量数据传输', '异常进程', '加密活动'],
      attackPatterns: ['键盘记录', '屏幕截图', '文件窃取']
    },
    'illegal_device': {
      normalOperations: [],
      suspiciousBehaviors: ['未授权接入', 'ARP欺骗', '端口扫描'],
      attackPatterns: ['中间人攻击', '网络嗅探', '拒绝服务']
    }
  }

  simulateDeviceBehavior(device: DeviceInfo) {
    const behavior = this.deviceBehaviors[device.deviceType]
    if (!behavior) return null

    const isSuspicious = Math.random() > 0.85 // 15%概率发生可疑行为
    const isAttack = Math.random() > 0.95 // 5%概率发生攻击行为

    if (isAttack && behavior.attackPatterns.length > 0) {
      return {
        type: 'attack',
        pattern: behavior.attackPatterns[Math.floor(Math.random() * behavior.attackPatterns.length)],
        severity: 'critical',
        confidence: Math.floor(Math.random() * 20) + 80
      }
    } else if (isSuspicious && behavior.suspiciousBehaviors.length > 0) {
      return {
        type: 'suspicious',
        pattern: behavior.suspiciousBehaviors[Math.floor(Math.random() * behavior.suspiciousBehaviors.length)],
        severity: 'medium',
        confidence: Math.floor(Math.random() * 30) + 60
      }
    } else if (behavior.normalOperations.length > 0) {
      return {
        type: 'normal',
        pattern: behavior.normalOperations[Math.floor(Math.random() * behavior.normalOperations.length)],
        severity: 'low',
        confidence: Math.floor(Math.random() * 20) + 80
      }
    }

    return null
  }

  generateThreatIntelligence() {
    const threats = [
      {
        name: 'APT41',
        activity: '针对金融机构的攻击活动增加',
        indicators: ['malware-c2-domain.com', '192.168.100.50'],
        severity: 'high',
        confidence: 85
      },
      {
        name: 'Emotet',
        activity: '银行木马新变种传播',
        indicators: ['suspicious-email.com', 'malware-payload.exe'],
        severity: 'critical',
        confidence: 92
      },
      {
        name: 'Ryuk',
        activity: '勒索软件攻击预警',
        indicators: ['ransom-note.txt', 'encrypted-files'],
        severity: 'critical',
        confidence: 78
      }
    ]

    return threats.map(threat => ({
      ...threat,
      timestamp: new Date().toISOString(),
      id: `threat-${Date.now()}-${Math.random()}`
    }))
  }
}

// 全局实时数据实例
export const realTimeUpdater = new RealTimeDataUpdater()
export const threatScenarioGenerator = new ThreatScenarioGenerator()
export const deviceSimulator = new EnhancedDeviceSimulator()

// 启动实时数据更新
export const startRealTimeUpdates = () => {
  realTimeUpdater.start(3000) // 每3秒更新一次
}

// 停止实时数据更新
export const stopRealTimeUpdates = () => {
  realTimeUpdater.stop()
}