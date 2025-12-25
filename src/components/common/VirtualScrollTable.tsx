import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Table, ConfigProvider } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { debounce } from '@/utils/common'

interface VirtualScrollTableProps<T> {
  dataSource: T[]
  columns: ColumnsType<T>
  height?: number
  rowHeight?: number
  loading?: boolean
  onScroll?: (scrollTop: number) => void
  virtualScroll?: boolean
  threshold?: number
}

const VirtualScrollTable = <T extends Record<string, any>>({
  dataSource,
  columns,
  height = 400,
  rowHeight = 60,
  loading = false,
  onScroll,
  virtualScroll = true,
  threshold = 50
}: VirtualScrollTableProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(height)
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算可见区域
  const { visibleData, startIndex } = useMemo(() => {
    if (!virtualScroll || dataSource.length < threshold) {
      return {
        visibleData: dataSource,
        startIndex: 0,
        endIndex: dataSource.length
      }
    }

    const start = Math.floor(scrollTop / rowHeight)
    const visibleCount = Math.ceil(containerHeight / rowHeight) + 2 // 添加缓冲
    const end = Math.min(start + visibleCount, dataSource.length)
    
    return {
      visibleData: dataSource.slice(start, end),
      startIndex: start,
      endIndex: end
    }
  }, [scrollTop, containerHeight, dataSource, rowHeight, virtualScroll, threshold])

  // 处理滚动事件
  const handleScroll = useCallback(
    debounce((e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop
      setScrollTop(newScrollTop)
      onScroll?.(newScrollTop)
    }, 16), // 60fps
    [onScroll]
  )

  // 更新容器高度
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerHeight(Math.min(height, rect.height || height))
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [height])

  // 总高度计算
  const totalHeight = virtualScroll && dataSource.length >= threshold 
    ? dataSource.length * rowHeight 
    : 'auto'

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 6,
        },
      }}
    >
      <div
        ref={containerRef}
        className="virtual-scroll-container"
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative',
        }}
        onScroll={handleScroll}
      >
        <div
          style={{
            height: virtualScroll && dataSource.length >= threshold ? totalHeight : 'auto',
            position: 'relative',
          }}
        >
          <Table
            columns={columns}
            dataSource={visibleData}
            loading={loading}
            pagination={false}
            size="small"
            rowKey="id"
            scroll={{ x: true }}
            style={{
              transform: virtualScroll && dataSource.length >= threshold 
                ? `translateY(${startIndex * rowHeight}px)` 
                : 'none',
            }}
            onRow={(_record, _index) => ({
              style: {
                height: rowHeight,
                lineHeight: `${rowHeight - 20}px`,
              }
            })}
          />
        </div>
        
        {/* 加载指示器 */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">加载中...</span>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  )
}

export default VirtualScrollTable