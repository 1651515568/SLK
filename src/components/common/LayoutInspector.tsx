import React, { useEffect, useState } from 'react'

interface LayoutIssue {
  type: 'text-overlap' | 'responsive-break' | 'overflow' | 'z-index' | 'position'
  element: HTMLElement
  severity: 'low' | 'medium' | 'high'
  description: string
  position: { top: number; left: number; right: number; bottom: number }
  suggestion: string
}

interface LayoutInspectorProps {
  enabled?: boolean
  onIssuesFound?: (issues: LayoutIssue[]) => void
}

const LayoutInspector: React.FC<LayoutInspectorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  onIssuesFound
}) => {
  const [issues, setIssues] = useState<LayoutIssue[]>([])

  // 检测文字重叠问题
  const detectTextOverlap = (): LayoutIssue[] => {
    const issues: LayoutIssue[] = []
    const textElements = document.querySelectorAll('*')
    
    textElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      
      // 检查元素是否有文字内容
      const hasText = element.textContent?.trim().length > 0
      const hasChildText = Array.from(element.children).some(child => 
        child.textContent?.trim().length > 0
      )
      
      if (hasText || hasChildText) {
        // 检查与其他元素的重叠
        textElements.forEach((otherElement, otherIndex) => {
          if (index !== otherIndex) {
            const otherRect = otherElement.getBoundingClientRect()
            
            // 计算重叠区域
            const overlapX = Math.max(0, Math.min(rect.right, otherRect.right) - Math.max(rect.left, otherRect.left))
            const overlapY = Math.max(0, Math.min(rect.bottom, otherRect.bottom) - Math.max(rect.top, otherRect.top))
            const overlapArea = overlapX * overlapY
            
            // 如果重叠面积超过一定阈值，认为可能存在文字重叠
            if (overlapArea > 100 && overlapX > 10 && overlapY > 10) {
              // 检查元素是否在同一层级或相近层级
              const depthDiff = Math.abs(getElementDepth(element) - getElementDepth(otherElement))
              
              if (depthDiff <= 2) {
                issues.push({
                  type: 'text-overlap',
                  element: element as HTMLElement,
                  severity: depthDiff === 0 ? 'high' : depthDiff === 1 ? 'medium' : 'low',
                  description: '检测到可能的文字重叠',
                  position: rect,
                  suggestion: `调整元素位置或z-index，当前重叠面积: ${Math.round(overlapArea)}px²`
                })
              }
            }
          }
        })
      }
    })
    
    return issues
  }

  // 检测响应式断点问题
  const detectResponsiveIssues = (): LayoutIssue[] => {
    const issues: LayoutIssue[] = []
    const viewportWidth = window.innerWidth
    
    // 检查容器宽度问题
    const containers = document.querySelectorAll('[class*="container"], [class*="wrapper"], .ant-layout, .ant-card')
    
    containers.forEach(container => {
      const rect = container.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(container)
      const maxWidth = parseInt(computedStyle.maxWidth) || Infinity
      const width = rect.width
      
      // 检查是否超出视口宽度
      if (width > viewportWidth) {
        issues.push({
          type: 'responsive-break',
          element: container as HTMLElement,
          severity: width > viewportWidth + 50 ? 'high' : 'medium',
          description: `容器宽度 (${Math.round(width)}px) 超出视口宽度 (${viewportWidth}px)`,
          position: rect,
          suggestion: '添加响应式样式或调整容器宽度'
        })
      }
      
      // 检查固定宽度在小屏幕上的问题
      if (viewportWidth < 768 && maxWidth !== Infinity && maxWidth > viewportWidth) {
        issues.push({
          type: 'responsive-break',
          element: container as HTMLElement,
          severity: 'high',
          description: `固定宽度 (${maxWidth}px) 在小屏幕上过大`,
          position: rect,
          suggestion: '使用百分比宽度或媒体查询'
        })
      }
    })
    
    return issues
  }

  // 检测溢出问题
  const detectOverflowIssues = (): LayoutIssue[] => {
    const issues: LayoutIssue[] = []
    const scrollableElements = document.querySelectorAll('*')
    
    scrollableElements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(element)
      const scrollWidth = element.scrollWidth
      const scrollHeight = element.scrollHeight
      const clientWidth = element.clientWidth
      const clientHeight = element.clientHeight
      
      // 检查水平溢出
      if (scrollWidth > clientWidth && computedStyle.overflowX !== 'hidden') {
        issues.push({
          type: 'overflow',
          element: element as HTMLElement,
          severity: scrollWidth > clientWidth * 1.5 ? 'high' : 'medium',
          description: `水平溢出: 滚动宽度 ${scrollWidth}px > 容器宽度 ${clientWidth}px`,
          position: rect,
          suggestion: '添加 overflow-x: auto 或调整内容宽度'
        })
      }
      
      // 检查垂直溢出
      if (scrollHeight > clientHeight && computedStyle.overflowY !== 'hidden') {
        issues.push({
          type: 'overflow',
          element: element as HTMLElement,
          severity: scrollHeight > clientHeight * 1.5 ? 'high' : 'medium',
          description: `垂直溢出: 滚动高度 ${scrollHeight}px > 容器高度 ${clientHeight}px`,
          position: rect,
          suggestion: '添加 overflow-y: auto 或调整内容高度'
        })
      }
    })
    
    return issues
  }

  // 获取元素层级深度
  const getElementDepth = (element: Element): number => {
    let depth = 0
    let current = element.parentElement
    
    while (current) {
      depth++
      current = current.parentElement
      if (depth > 20) break // 防止无限循环
    }
    
    return depth
  }

  // 检测z-index问题
  const detectZIndexIssues = (): LayoutIssue[] => {
    const issues: LayoutIssue[] = []
    const elements = document.querySelectorAll('*')
    const zIndexMap = new Map<number, HTMLElement[]>()
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element)
      const zIndex = parseInt(computedStyle.zIndex)
      
      if (!isNaN(zIndex) && zIndex > 0) {
        if (!zIndexMap.has(zIndex)) {
          zIndexMap.set(zIndex, [])
        }
        zIndexMap.get(zIndex)!.push(element as HTMLElement)
      }
    })
    
    // 检查重复的z-index是否可能导致问题
    zIndexMap.forEach((elements, zIndex) => {
      if (elements.length > 3) {
        issues.push({
          type: 'z-index',
          element: elements[0],
          severity: 'low',
          description: `z-index ${zIndex} 被 ${elements.length} 个元素使用`,
          position: elements[0].getBoundingClientRect(),
          suggestion: '考虑使用不同的z-index值以避免层级冲突'
        })
      }
    })
    
    return issues
  }

  // 运行所有检测
  const runInspection = () => {
    if (!enabled) return
    
    const allIssues: LayoutIssue[] = [
      ...detectTextOverlap(),
      ...detectResponsiveIssues(),
      ...detectOverflowIssues(),
      ...detectZIndexIssues()
    ]
    
    setIssues(allIssues)
    onIssuesFound?.(allIssues)
    
    // 输出警告
    if (allIssues.length > 0) {
      console.group(`🔍 布局检测结果 - 发现 ${allIssues.length} 个问题`)
      
      const highSeverityIssues = allIssues.filter(issue => issue.severity === 'high')
      const mediumSeverityIssues = allIssues.filter(issue => issue.severity === 'medium')
      const lowSeverityIssues = allIssues.filter(issue => issue.severity === 'low')
      
      if (highSeverityIssues.length > 0) {
        console.group(`🔴 高严重性问题 (${highSeverityIssues.length})`)
        highSeverityIssues.forEach((issue, index) => {
          console.warn(`${index + 1}. ${issue.description}`, {
            element: issue.element,
            position: issue.position,
            suggestion: issue.suggestion
          })
        })
        console.groupEnd()
      }
      
      if (mediumSeverityIssues.length > 0) {
        console.group(`🟡 中严重性问题 (${mediumSeverityIssues.length})`)
        mediumSeverityIssues.forEach((issue, index) => {
          console.warn(`${index + 1}. ${issue.description}`, {
            element: issue.element,
            suggestion: issue.suggestion
          })
        })
        console.groupEnd()
      }
      
      if (lowSeverityIssues.length > 0) {
        console.group(`🔵 低严重性问题 (${lowSeverityIssues.length})`)
        lowSeverityIssues.forEach((issue, index) => {
          console.info(`${index + 1}. ${issue.description}`, {
            suggestion: issue.suggestion
          })
        })
        console.groupEnd()
      }
      
      console.groupEnd()
    }
  }

  useEffect(() => {
    if (!enabled) return

    // 延迟执行，等待页面完全加载
    const timer = setTimeout(() => {
      runInspection()
    }, 2000)

    // 窗口大小变化时重新检测
    const handleResize = () => {
      setTimeout(runInspection, 500)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [enabled])

  return null
}

export default LayoutInspector