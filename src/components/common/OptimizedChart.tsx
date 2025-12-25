import React, { useMemo, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { debounce } from '@/utils/common'

interface OptimizedChartProps {
  option: EChartsOption
  height?: number | string
  loading?: boolean
  lazyUpdate?: boolean
  animationDuration?: number
  animationEasing?: string
  animationDurationUpdate?: number
  animationEasingUpdate?: string
  responsive?: boolean
  onChartReady?: (chartInstance: any) => void
  onEvents?: Record<string, Function>
}

// 防抖的图表更新函数
const createDebouncedUpdate = (delay = 100) => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastOption: EChartsOption | null = null
  
  return (updateFn: () => void, option: EChartsOption) => {
    lastOption = option
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      updateFn()
      timeoutId = null
    }, delay)
  }
}

const OptimizedChart = forwardRef<ReactECharts, OptimizedChartProps>(({
  option,
  height = 400,
  loading = false,
  lazyUpdate = true,
  animationDuration = 500,
  animationEasing = 'cubicOut',
  animationDurationUpdate = 300,
  animationEasingUpdate = 'cubicOut',
  responsive = true,
  onChartReady,
  onEvents
}, ref) => {
  const chartRef = useRef<ReactECharts>(null)
  const debouncedUpdate = useMemo(
    () => createDebouncedUpdate(lazyUpdate ? 100 : 0),
    [lazyUpdate]
  )

  // 优化的图表配置
  const optimizedOption = useMemo(() => {
    return {
      ...option,
      animation: true,
      animationDuration,
      animationEasing,
      animationDurationUpdate,
      animationEasingUpdate,
      animationThreshold: 2000, // 超过2000个数据点禁用动画
      progressive: 2000, // 大量数据分批渲染
      progressiveThreshold: 3000,
      progressiveChunkMode: 'mod',
      // 性能优化配置
      tooltip: {
        ...option.tooltip,
        trigger: 'axis',
        confine: true,
        appendToBody: true,
      },
      // 响应式配置
      responsive,
      ...(responsive && {
        grid: {
          ...option.grid,
          containLabel: true
        }
      })
    }
  }, [option, animationDuration, animationEasing, animationDurationUpdate, animationEasingUpdate, lazyUpdate, responsive])

  // 暴露图表实例给父组件
  useImperativeHandle(ref, () => chartRef.current as ReactECharts, [])

  // 图表就绪回调
  const handleChartReady = useCallback((chartInstance: any) => {
    onChartReady?.(chartInstance)
    
    // 全局性能优化
    if (chartInstance) {
      // 禁用一些不必要的功能以提升性能
      chartInstance.setOption({
        animation: true,
        animationDurationUpdate,
        animationEasingUpdate,
        progressive: 2000,
        progressiveThreshold: 3000,
        progressiveChunkMode: 'mod'
      })

      // 事件绑定优化
      if (onEvents) {
        Object.entries(onEvents).forEach(([eventName, handler]) => {
          chartInstance.on(eventName, handler)
        })
      }
    }
  }, [onChartReady, onEvents, animationDurationUpdate, animationEasingUpdate])

  // 处理窗口大小变化
  useEffect(() => {
    if (!responsive) return

    const handleResize = debounce(() => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize()
      }
    }, 300)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [responsive])

  // 自定义渲染配置
  const eChartsConfig = {
    lazyUpdate: lazyUpdate,
    notMerge: false,
    silent: false,
    renderer: 'canvas' as const, // 使用 canvas 渲染器，性能更好
    useDirtyRect: true, // 脏矩形优化
  }

  if (loading) {
    return (
      <div 
        className="bg-white rounded-lg shadow border flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-gray-500 text-sm">图表加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <ReactECharts
      ref={chartRef}
      option={optimizedOption}
      style={{ height, width: '100%' }}
      opts={eChartsConfig}
      onChartReady={handleChartReady}
      theme="light"
    />
  )
})

OptimizedChart.displayName = 'OptimizedChart'

// 大数据量图表组件
interface BigDataChartProps extends OptimizedChartProps {
  dataChunkSize?: number
  maxDataPoints?: number
  enableDataZoom?: boolean
}

const BigDataChart = forwardRef<ReactECharts, BigDataChartProps>(({
  dataChunkSize = 1000,
  maxDataPoints = 50000,
  enableDataZoom = true,
  ...props
}, ref) => {
  const { option, onChartReady, onEvents, ...restProps } = props
  
  // 数据处理优化
  const processedOption = useMemo(() => {
    if (!option || !option.series) return option

    const processedSeries = Array.isArray(option.series) 
      ? option.series.map((series: any) => {
          // 限制数据点数量
          if (Array.isArray(series.data) && series.data.length > maxDataPoints) {
            // 数据采样，减少数据点
            const step = Math.ceil(series.data.length / maxDataPoints)
            const sampledData = series.data.filter((_: any, index: number) => index % step === 0)
            return { ...series, data: sampledData }
          }
          return series
        })
      : option.series

    // 添加数据缩放配置
    const enhancedOption = {
      ...option,
      series: processedSeries,
      ...(enableDataZoom && {
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
            moveOnMouseWheel: true,
            zoomOnMouseWheel: true,
            throttle: 100 // 节流
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
            height: 20,
            bottom: 20,
            throttle: 100
          }
        ]
      })
    }

    return enhancedOption
  }, [option, maxDataPoints, enableDataZoom])

  return (
    <OptimizedChart
      {...restProps}
      ref={ref}
      option={processedOption}
      onChartReady={onChartReady}
      onEvents={onEvents}
      lazyUpdate={true}
      animationDuration={300}
      animationDurationUpdate={200}
    />
  )
})

BigDataChart.displayName = 'BigDataChart'

export { OptimizedChart, BigDataChart }
export default OptimizedChart