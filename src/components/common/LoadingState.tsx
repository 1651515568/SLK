import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingStateProps {
  loading?: boolean
  size?: 'small' | 'default' | 'large'
  tip?: string
  delay?: number
  children?: React.ReactNode
  fullScreen?: boolean
  skeleton?: boolean
}

// 自定义加载图标
const customSpinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const LoadingState: React.FC<LoadingStateProps> = ({
  loading = false,
  size = 'default',
  tip = '加载中...',
  delay = 200,
  children,
  fullScreen = false,
  skeleton = false
}) => {
  if (skeleton) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <Spin 
            indicator={customSpinIcon} 
            size={size}
            tip={tip}
            delay={delay}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded">
          <Spin 
            indicator={customSpinIcon}
            size={size}
            tip={tip}
            delay={delay}
          />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// 卡片加载骨架屏
export const CardSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-lg shadow border animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
)

// 表格加载骨架屏
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow border overflow-hidden">
    <div className="bg-gray-50 px-6 py-3 border-b">
      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
    <div className="p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-4 bg-gray-200 rounded animate-pulse flex-1"
              style={{ animationDelay: `${rowIndex * 100 + colIndex * 50}ms` }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  </div>
)

// 图表加载骨架屏
export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = '400px' }) => (
  <div 
    className="bg-white rounded-lg shadow border p-6 flex items-center justify-center"
    style={{ height }}
  >
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
    </div>
  </div>
)

// 统计卡片骨架屏
export const StatCardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
)

export default LoadingState