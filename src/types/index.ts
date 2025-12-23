// 设备相关类型
export interface DeviceInfo {
  id: string
  deviceName: string
  deviceType: 'power_terminal' | 'office_terminal' | 'illegal_device'
  macAddress: string
  ipAddress: string
  vendor: string
  model: string
  osVersion: string
  securityStatus: 'trusted' | 'suspicious' | 'malicious'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastSeen: string
  networkLocation: string
  complianceStatus: 'compliant' | 'non_compliant' | 'unknown'
  vulnerabilities: VulnerabilityInfo[]
  behaviorScore: number
}

// 安全概览相关类型
export interface SecurityOverview {
  totalDevices: number
  trustedDevices: number
  suspiciousDevices: number
  maliciousDevices: number
  criticalAlerts: number
  responseTime: number
  identificationAccuracy: number
  blockRate: number
}

export interface NetworkNode {
  id: string
  name: string
  type: 'gateway' | 'server' | 'terminal' | 'router'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  position: { x: number; y: number; z?: number }
  connections: string[]
  status: 'online' | 'offline' | 'warning'
}

// 数据融合相关类型
export interface DataSource {
  id: string
  name: string
  type: 'identity' | 'network' | 'security' | 'threat_intel'
  status: 'connected' | 'disconnected' | 'error'
  lastUpdate: string
  recordCount: number
  dataQuality: number
}

export interface CorrelationResult {
  id: string
  sourceTypes: string[]
  correlation: number
  insights: string[]
  riskFactors: string[]
  recommendations: string[]
}

// 接入阻断相关类型
export interface BlockEvent {
  id: string
  timestamp: string
  deviceInfo: DeviceInfo
  blockReason: string
  blockType: 'automatic' | 'manual' | 'policy'
  success: boolean
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface BlockRule {
  id: string
  name: string
  condition: string
  action: 'block' | 'monitor' | 'alert'
  enabled: boolean
  hitCount: number
  lastTriggered: string
}

// 漏洞管理相关类型
export interface Vulnerability {
  id: string
  cveId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  cvssScore: number
  affectedDevices: string[]
  discoveryDate: string
  status: 'open' | 'in_progress' | 'resolved' | 'accepted'
  remediation: string
  exploitAvailable: boolean
}

export interface ScanTask {
  id: string
  name: string
  target: string[]
  scanType: 'quick' | 'comprehensive' | 'custom'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime: string
  endTime?: string
  vulnerabilitiesFound: number
}

// 通用类型
export interface VulnerabilityInfo {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  cvssScore: number
}

export interface SecurityEvent {
  id: string
  timestamp: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  source: string
  target?: string
  status: 'active' | 'resolved' | 'investigating'
}

// 图表数据类型
export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface TimeSeriesData {
  time: string
  value: number
  [key: string]: any
}