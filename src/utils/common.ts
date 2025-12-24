// 通用工具函数库 - 减少重复代码，提升代码质量

// 颜色映射函数
export const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'low': return 'green'
    case 'medium': return 'orange'
    case 'high': return 'red'
    case 'critical': return 'magenta'
    default: return 'default'
  }
}

export const getRiskLevelText = (level: string) => {
  switch (level) {
    case 'low': return '低风险'
    case 'medium': return '中风险'
    case 'high': return '高风险'
    case 'critical': return '严重风险'
    default: return '未知'
  }
}

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'green'
    case 'medium': return 'orange'
    case 'high': return 'red'
    case 'critical': return 'magenta'
    default: return 'default'
  }
}

export const getSeverityText = (severity: string) => {
  switch (severity) {
    case 'low': return '低危'
    case 'medium': return '中危'
    case 'high': return '高危'
    case 'critical': return '严重'
    default: return '未知'
  }
}

export const getSecurityStatusColor = (status: string) => {
  switch (status) {
    case 'trusted': return 'green'
    case 'suspicious': return 'orange'
    case 'malicious': return 'red'
    default: return 'default'
  }
}

export const getSecurityStatusText = (status: string) => {
  switch (status) {
    case 'trusted': return '可信'
    case 'suspicious': return '可疑'
    case 'malicious': return '恶意'
    default: return '未知'
  }
}

// 设备类型映射
export const getDeviceTypeText = (type: string) => {
  switch (type) {
    case 'power_terminal': return '电力专用终端'
    case 'office_terminal': return '办公终端'
    case 'illegal_device': return '非法设备'
    default: return type
  }
}

export const getDeviceTypeColor = (type: string) => {
  switch (type) {
    case 'power_terminal': return 'blue'
    case 'office_terminal': return 'cyan'
    case 'illegal_device': return 'red'
    default: return 'default'
  }
}

// 状态映射
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected':
    case 'online':
    case 'success':
    case 'completed':
    case 'resolved':
    case 'trusted':
      return 'green'
    case 'disconnected':
    case 'warning':
    case 'suspicious':
    case 'blocked':
    case 'failed':
    case 'error':
    case 'pending':
      return 'orange'
    case 'malicious':
    case 'critical':
    case 'active':
      return 'red'
    case 'investigating':
    case 'in_progress':
      return 'blue'
    default:
      return 'default'
  }
}

export const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'connected': '已连接',
    'disconnected': '断开连接',
    'online': '在线',
    'offline': '离线',
    'success': '成功',
    'failed': '失败',
    'completed': '已完成',
    'pending': '等待中',
    'running': '运行中',
    'resolved': '已解决',
    'active': '活跃',
    'blocked': '已阻断',
    'trusted': '可信',
    'suspicious': '可疑',
    'malicious': '恶意',
    'investigating': '调查中',
    'in_progress': '处理中'
  }
  return statusMap[status] || status
}

// 图表默认配置
export const getChartDefaultConfig = (title: string) => {
  return {
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#333', fontSize: 16 }
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
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#d9d9d9' } },
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    }
  }
}

export const getPieChartDefaultConfig = (title: string) => {
  return {
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#333', fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: title,
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        color: '#333'
      }
    }]
  }
}

// 时间格式化函数
export const formatDateTime = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const formatTime = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 数字格式化函数
export const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

export const formatPercentage = (num: number, decimals: number = 1) => {
  return `${num.toFixed(decimals)}%`
}

export const formatScore = (score: number) => {
  return score.toFixed(1)
}

// 生成随机ID
export const generateId = (prefix: string = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 防抖函数
export const debounce = (func: Function, wait: number) => {
  let timeout: number
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean
  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  } as T
}

// 深度克隆
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (clonedObj as any)[key] = deepClone((obj as any)[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 数组分组
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// 数组去重
export const uniqueArray = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)]
  }
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// 条件样式类名
export const conditionalClass = (condition: boolean, trueClass: string, falseClass: string = '') => {
  return condition ? trueClass : falseClass
}

// 文件大小格式化
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 网络地址格式化
export const formatIpAddress = (ip: string) => {
  return ip.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/, '<span class="text-blue-600">$1</span>')
}

export const formatMacAddress = (mac: string) => {
  return mac.toUpperCase().replace(/:/g, '<span class="text-gray-400">:</span>')
}

// 安全等级评估
export const calculateRiskScore = (factors: { [key: string]: number }) => {
  const weights = {
    vulnerabilityCount: 0.3,
    behaviorScore: 0.25,
    networkConnections: 0.2,
    complianceStatus: 0.15,
    lastSeen: 0.1
  }
  
  let score = 0
  Object.keys(factors).forEach(key => {
    if (weights[key as keyof typeof weights]) {
      score += factors[key] * weights[key as keyof typeof weights]
    }
  })
  
  return Math.min(Math.max(score, 0), 100)
}

// 演示数据生成器
export const generateDemoData = {
  devices: (count: number = 100) => {
    const types = ['power_terminal', 'office_terminal', 'illegal_device']
    const statuses = ['trusted', 'suspicious', 'malicious']
    
    return Array.from({ length: count }, (_, i) => ({
      id: `device-${i + 1}`,
      name: `设备-${String(i + 1).padStart(3, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
      lastSeen: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }))
  },
  
  events: (count: number = 10) => {
    const types = ['login_failed', 'suspicious_traffic', 'malware_detected', 'unauthorized_access']
    const severities = ['low', 'medium', 'high', 'critical']
    
    return Array.from({ length: count }, (_, i) => ({
      id: `event-${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      description: `安全事件 ${i + 1} 的描述信息`
    }))
  }
}