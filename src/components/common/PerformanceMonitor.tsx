import React, { useEffect, useState, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  componentCount: number
  largeComponents: string[]
  layoutShift: number
  loadTime: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  threshold?: number
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  showOverlay?: boolean
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = true, // 在开发环境中启用
  threshold = 16, // 60fps threshold
  onMetricsUpdate,
  showOverlay = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    componentCount: 0,
    largeComponents: [],
    layoutShift: 0,
    loadTime: 0
  })
  
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const componentCountRef = useRef(0)
  const largeComponentsRef = useRef<string[]>([])

  // FPS监控
  const measureFPS = () => {
    const now = performance.now()
    frameCountRef.current++
    
    if (now >= lastTimeRef.current + 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
      frameCountRef.current = 0
      lastTimeRef.current = now
      
      setMetrics(prev => ({ ...prev, fps }))
      
      // 如果FPS过低，输出警告
      if (fps < threshold && enabled) {
        console.warn(`⚠️ Performance Warning: Low FPS detected (${fps}fps)`, {
          timestamp: new Date().toISOString(),
          currentPage: window.location.pathname
        })
      }
    }
    
    requestAnimationFrame(measureFPS)
  }

  // 内存使用监控
  const measureMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
      
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage,
        loadTime: performance.now() - performance.timing.navigationStart
      }))
      
      // 内存使用过高警告
      if (memoryUsage > 80 && enabled) {
        console.warn(`⚠️ Memory Warning: High memory usage (${memoryUsage}%)`, {
          usedHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          totalHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB'
        })
      }
    }
  }

  // 组件渲染性能监控
  const measureRenderPerformance = () => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.startsWith('react-render')) {
          const renderTime = entry.duration
          
          setMetrics(prev => ({ ...prev, renderTime }))
          
          // 渲染时间过长警告
          if (renderTime > 50 && enabled) {
            console.warn(`⚠️ Render Warning: Slow component render (${renderTime.toFixed(2)}ms)`, {
              componentName: entry.name,
              duration: renderTime.toFixed(2) + 'ms'
            })
          }
        }
      })
    })
    
    observer.observe({ entryTypes: ['measure'] })
  }

  // 布局偏移监控
  const measureLayoutShift = () => {
    let clsValue = 0
    let clsEntries: any[] = []
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          clsEntries.push(entry)
        }
      })
      
      setMetrics(prev => ({ ...prev, layoutShift: clsValue }))
      
      if (clsValue > 0.1 && enabled) {
        console.warn(`⚠️ Layout Warning: Significant layout shift (${clsValue.toFixed(3)})`, {
          shiftValue: clsValue.toFixed(3),
          sources: clsEntries.slice(0, 3) // 只显示前3个源
        })
      }
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
  }

  // 组件数量统计
  const countReactComponents = () => {
    // 这是一个简化的组件计数方法
    // 在实际应用中，可能需要更复杂的逻辑
    const reactRoot = document.querySelector('#root')
    if (reactRoot) {
      const componentCount = reactRoot.querySelectorAll('[data-reactroot] *').length
      componentCountRef.current = componentCount
      setMetrics(prev => ({ ...prev, componentCount }))
      
      // 组件过多警告
      if (componentCount > 1000 && enabled) {
        console.warn(`⚠️ Component Warning: Too many DOM elements (${componentCount})`)
      }
    }
  }

  // 大型组件检测
  const detectLargeComponents = () => {
    const largeElements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const rect = el.getBoundingClientRect()
        return rect.width * rect.height > 10000 // 大于10000px²的元素
      })
      .map(el => el.tagName + ':' + (el.className || el.id || 'unnamed'))
    
    largeComponentsRef.current = largeElements.slice(0, 5) // 只保留前5个
    setMetrics(prev => ({ ...prev, largeComponents: largeComponentsRef.current }))
  }

  useEffect(() => {
    if (!enabled) return

    // 启动性能监控
    measureFPS()
    measureRenderPerformance()
    measureLayoutShift()
    
    // 定期检查内存和组件数量
    const interval = setInterval(() => {
      measureMemory()
      countReactComponents()
      detectLargeComponents()
    }, 2000)

    // 初始检查
    setTimeout(() => {
      measureMemory()
      countReactComponents()
      detectLargeComponents()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [enabled, threshold])

  // 通知父组件更新
  useEffect(() => {
    onMetricsUpdate?.(metrics)
  }, [metrics, onMetricsUpdate])

  if (!showOverlay) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={metrics.fps < threshold ? 'text-red-400' : 'text-green-400'}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className={metrics.memoryUsage && metrics.memoryUsage > 80 ? 'text-red-400' : 'text-green-400'}>
            {metrics.memoryUsage || 0}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Render:</span>
          <span className={metrics.renderTime > 50 ? 'text-red-400' : 'text-green-400'}>
            {metrics.renderTime.toFixed(1)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Components:</span>
          <span className={metrics.componentCount > 1000 ? 'text-red-400' : 'text-green-400'}>
            {metrics.componentCount}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Layout Shift:</span>
          <span className={metrics.layoutShift > 0.1 ? 'text-red-400' : 'text-green-400'}>
            {metrics.layoutShift.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor

// 性能警告钩子
export const usePerformanceWarning = () => {
  const warnPerformance = (componentName: string, operation: string, duration: number) => {
    if (duration > 100) { // 总是启用性能警告
      console.warn(`⚠️ Performance Warning in ${componentName}: ${operation} took ${duration.toFixed(2)}ms`, {
        component: componentName,
        operation,
        duration: duration.toFixed(2) + 'ms',
        timestamp: new Date().toISOString()
      })
    }
  }

  const measurePerformance = <T extends (...args: any[]) => any>(
    componentName: string,
    operation: string,
    fn: T
  ): T => {
    return ((...args: any[]) => {
      const start = performance.now()
      const result = fn(...args)
      
      if (result && typeof result.then === 'function') {
        return result.finally(() => {
          const duration = performance.now() - start
          warnPerformance(componentName, operation, duration)
        })
      } else {
        const duration = performance.now() - start
        warnPerformance(componentName, operation, duration)
        return result
      }
    }) as T
  }

  return { warnPerformance, measurePerformance }
}