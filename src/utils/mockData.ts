import { 
  DeviceInfo, 
  SecurityOverview, 
  NetworkNode, 
  SecurityEvent, 
  DataSource, 
  CorrelationResult,
  BlockEvent,
  BlockRule,
  Vulnerability,
  ScanTask,
  VulnerabilityInfo
} from '@/types'

// 设备数据生成
export const generateMockDevices = (count: number = 1000): DeviceInfo[] => {
  const deviceTypes = ['power_terminal', 'office_terminal', 'illegal_device'] as const
  const securityStatuses = ['trusted', 'suspicious', 'malicious'] as const
  const riskLevels = ['low', 'medium', 'high', 'critical'] as const
  const complianceStatuses = ['compliant', 'non_compliant', 'unknown'] as const
  
  const vendors = ['华为', '思科', '锐捷', 'H3C', '中兴', '烽火', '贝尔']
  const models = ['S5735-L48T4S-A', 'WS-C3850-24T-L', 'RG-S2910-24GT/8SFP-E', 'S5130-28C-EI']
  const osVersions = ['IOS 15.2(7)E4', 'NX-OS 7.0(3)I7(6)', 'VRP (R) Software', 'Version 8.1.6.2']
  
  return Array.from({ length: count }, (_, index) => ({
    id: `device-${index + 1}`,
    deviceName: `设备-${String(index + 1).padStart(3, '0')}`,
    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
    macAddress: Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(':'),
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    model: models[Math.floor(Math.random() * models.length)],
    osVersion: osVersions[Math.floor(Math.random() * osVersions.length)],
    securityStatus: securityStatuses[Math.floor(Math.random() * securityStatuses.length)],
    riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    networkLocation: `办公楼${Math.floor(Math.random() * 5) + 1}楼`,
    complianceStatus: complianceStatuses[Math.floor(Math.random() * complianceStatuses.length)],
    vulnerabilities: generateVulnerabilities(Math.floor(Math.random() * 3)),
    behaviorScore: Math.floor(Math.random() * 100)
  }))
}

// 漏洞数据生成
export const generateVulnerabilities = (count: number = 1): VulnerabilityInfo[] => {
  const severities = ['low', 'medium', 'high', 'critical'] as const
  
  return Array.from({ length: count }, (_, index) => ({
    id: `vuln-${index + 1}`,
    title: `漏洞标题 ${index + 1}`,
    severity: severities[Math.floor(Math.random() * severities.length)],
    cvssScore: Math.round((Math.random() * 10) * 10) / 10
  }))
}

// 安全概览数据生成
export const generateMockSecurityData = () => {
  const totalDevices = 1250
  const trustedDevices = Math.floor(totalDevices * 0.85)
  const suspiciousDevices = Math.floor(totalDevices * 0.12)
  const maliciousDevices = Math.floor(totalDevices * 0.03)
  
  const overview: SecurityOverview = {
    totalDevices,
    trustedDevices,
    suspiciousDevices,
    maliciousDevices,
    criticalAlerts: 3,
    responseTime: 25,
    identificationAccuracy: 95.8,
    blockRate: 92.3
  }
  
  // 网络拓扑节点
  const networkNodes: NetworkNode[] = [
    {
      id: 'gateway-1',
      name: '核心网关',
      type: 'gateway',
      riskLevel: 'low',
      position: { x: 400, y: 200 },
      connections: ['server-1', 'server-2', 'server-3'],
      status: 'online'
    },
    {
      id: 'server-1',
      name: '应用服务器',
      type: 'server',
      riskLevel: 'medium',
      position: { x: 200, y: 100 },
      connections: ['terminal-1', 'terminal-2', 'terminal-3'],
      status: 'online'
    },
    {
      id: 'server-2',
      name: '数据库服务器',
      type: 'server',
      riskLevel: 'low',
      position: { x: 600, y: 100 },
      connections: ['terminal-4', 'terminal-5'],
      status: 'online'
    },
    {
      id: 'server-3',
      name: '文件服务器',
      type: 'server',
      riskLevel: 'high',
      position: { x: 400, y: 50 },
      connections: ['terminal-6', 'terminal-7'],
      status: 'warning'
    },
    {
      id: 'terminal-1',
      name: 'RTU-001',
      type: 'terminal',
      riskLevel: 'low',
      position: { x: 100, y: 50 },
      connections: [],
      status: 'online'
    },
    {
      id: 'terminal-2',
      name: 'RTU-002',
      type: 'terminal',
      riskLevel: 'medium',
      position: { x: 150, y: 150 },
      connections: [],
      status: 'online'
    },
    {
      id: 'terminal-3',
      name: '未知设备',
      type: 'terminal',
      riskLevel: 'critical',
      position: { x: 250, y: 150 },
      connections: [],
      status: 'warning'
    }
  ]
  
  // 近期安全事件
  const recentEvents: SecurityEvent[] = [
    {
      id: 'event-1',
      timestamp: '2025-12-23 14:25:30',
      type: '异常设备接入',
      severity: 'critical',
      description: '检测到未知设备尝试接入网络',
      source: '00:1B:44:11:3A:B7',
      status: 'active'
    },
    {
      id: 'event-2',
      timestamp: '2025-12-23 14:20:15',
      type: '漏洞扫描完成',
      severity: 'high',
      description: '生产网段扫描发现5个高危漏洞',
      source: '192.168.1.0/24',
      status: 'investigating'
    },
    {
      id: 'event-3',
      timestamp: '2025-12-23 14:18:45',
      type: '设备身份验证',
      severity: 'low',
      description: 'RTU-001通过数字证书验证',
      source: 'RTU-001',
      status: 'resolved'
    }
  ]
  
  return {
    overview,
    networkNodes,
    recentEvents
  }
}

// 数据源数据生成
export const generateMockDataSources = (): DataSource[] => [
  {
    id: 'identity-1',
    name: '设备身份库',
    type: 'identity',
    status: 'connected',
    lastUpdate: '2025-12-23 14:30:00',
    recordCount: 1250,
    dataQuality: 95.8
  },
  {
    id: 'network-1',
    name: '网络流量监控',
    type: 'network',
    status: 'connected',
    lastUpdate: '2025-12-23 14:29:45',
    recordCount: 15680,
    dataQuality: 98.2
  },
  {
    id: 'security-1',
    name: '安全事件日志',
    type: 'security',
    status: 'connected',
    lastUpdate: '2025-12-23 14:30:10',
    recordCount: 3420,
    dataQuality: 99.1
  },
  {
    id: 'threat-1',
    name: '威胁情报库',
    type: 'threat_intel',
    status: 'disconnected',
    lastUpdate: '2025-12-23 12:15:30',
    recordCount: 12560,
    dataQuality: 87.3
  }
]

// 关联分析结果生成
export const generateMockCorrelationResults = (): CorrelationResult[] => [
  {
    id: 'corr-1',
    sourceTypes: ['identity', 'network'],
    correlation: 0.85,
    insights: ['设备身份与网络行为高度匹配', '异常流量模式检测'],
    riskFactors: ['可疑设备接入', '流量异常'],
    recommendations: ['加强身份验证', '监控异常流量']
  },
  {
    id: 'corr-2',
    sourceTypes: ['security', 'threat_intel'],
    correlation: 0.92,
    insights: ['已知威胁情报匹配', '攻击行为确认'],
    riskFactors: ['已确认攻击', '威胁升级'],
    recommendations: ['立即阻断', '安全响应']
  }
]

// 阻断事件数据生成
export const generateMockBlockEvents = (): BlockEvent[] => [
  {
    id: 'block-1',
    timestamp: '2025-12-23 14:25:30',
    deviceInfo: {
      id: 'unknown-device-1',
      deviceName: '未知设备',
      deviceType: 'illegal_device',
      macAddress: '00:1B:44:11:3A:B7',
      ipAddress: '192.168.1.156',
      vendor: '未知',
      model: '未知',
      osVersion: '未知',
      securityStatus: 'malicious',
      riskLevel: 'critical',
      lastSeen: '2025-12-23 14:25:30',
      networkLocation: '办公楼3楼',
      complianceStatus: 'unknown',
      vulnerabilities: [],
      behaviorScore: 0
    },
    blockReason: '非法设备接入检测',
    blockType: 'automatic',
    success: true,
    threatLevel: 'critical'
  },
  {
    id: 'block-2',
    timestamp: '2025-12-23 13:45:22',
    deviceInfo: {
      id: 'suspicious-device-1',
      deviceName: '可疑设备',
      deviceType: 'office_terminal',
      macAddress: '00:1A:2B:3C:4D:5E',
      ipAddress: '192.168.1.120',
      vendor: '联想',
      model: 'ThinkPad E15',
      osVersion: 'Windows 10',
      securityStatus: 'suspicious',
      riskLevel: 'high',
      lastSeen: '2025-12-23 13:45:22',
      networkLocation: '办公楼2楼',
      complianceStatus: 'non_compliant',
      vulnerabilities: [],
      behaviorScore: 65
    },
    blockReason: '高风险行为检测',
    blockType: 'policy',
    success: true,
    threatLevel: 'high'
  }
]

// 阻断规则数据生成
export const generateMockBlockRules = (): BlockRule[] => [
  {
    id: 'rule-1',
    name: '非法设备阻断',
    condition: 'device_type = illegal_device',
    action: 'block',
    enabled: true,
    hitCount: 15,
    lastTriggered: '2025-12-23 14:25:30'
  },
  {
    id: 'rule-2',
    name: '高风险设备监控',
    condition: 'risk_level = high OR risk_level = critical',
    action: 'monitor',
    enabled: true,
    hitCount: 8,
    lastTriggered: '2025-12-23 13:45:22'
  },
  {
    id: 'rule-3',
    name: '合规检查',
    condition: 'compliance_status = non_compliant',
    action: 'alert',
    enabled: true,
    hitCount: 23,
    lastTriggered: '2025-12-23 12:30:15'
  }
]

// 漏洞数据生成
export const generateMockVulnerabilities = (): Vulnerability[] => [
  {
    id: 'vuln-1',
    cveId: 'CVE-2024-1234',
    title: 'Cisco IOS XE Web UI 权限提升漏洞',
    description: 'Cisco IOS XE Web UI 存在权限提升漏洞，攻击者可以利用此漏洞获得系统管理员权限。',
    severity: 'critical',
    cvssScore: 9.8,
    affectedDevices: ['RTU-001', 'RTU-003', 'SW-001'],
    discoveryDate: '2025-12-20',
    status: 'open',
    remediation: '升级到最新版本的 IOS XE 软件',
    exploitAvailable: true
  },
  {
    id: 'vuln-2',
    cveId: 'CVE-2024-5678',
    title: 'Windows RDP 远程代码执行漏洞',
    description: 'Microsoft Windows RDP 服务存在远程代码执行漏洞，攻击者可以通过恶意请求执行任意代码。',
    severity: 'high',
    cvssScore: 8.1,
    affectedDevices: ['PC-001', 'PC-002'],
    discoveryDate: '2025-12-18',
    status: 'in_progress',
    remediation: '应用 Microsoft 安全更新 KB5034441',
    exploitAvailable: false
  },
  {
    id: 'vuln-3',
    cveId: 'CVE-2024-9012',
    title: 'OpenSSL 心脏滴血漏洞',
    description: 'OpenSSL 库存在心脏滴血漏洞，攻击者可以读取服务器内存中的敏感信息。',
    severity: 'medium',
    cvssScore: 7.5,
    affectedDevices: ['WEB-001', 'API-001'],
    discoveryDate: '2025-12-15',
    status: 'resolved',
    remediation: '升级 OpenSSL 到 3.0.13 或更高版本',
    exploitAvailable: true
  }
]

// 扫描任务数据生成
export const generateMockScanTasks = (): ScanTask[] => [
  {
    id: 'scan-1',
    name: '生产网段安全扫描',
    target: ['192.168.1.0/24'],
    scanType: 'comprehensive',
    status: 'completed',
    progress: 100,
    startTime: '2025-12-23 09:00:00',
    endTime: '2025-12-23 12:30:00',
    vulnerabilitiesFound: 12
  },
  {
    id: 'scan-2',
    name: '办公网段快速扫描',
    target: ['192.168.2.0/24'],
    scanType: 'quick',
    status: 'running',
    progress: 65,
    startTime: '2025-12-23 14:00:00',
    vulnerabilitiesFound: 3
  },
  {
    id: 'scan-3',
    name: '核心设备深度扫描',
    target: ['192.168.1.1', '192.168.1.2'],
    scanType: 'custom',
    status: 'pending',
    progress: 0,
    startTime: '',
    vulnerabilitiesFound: 0
  }
]