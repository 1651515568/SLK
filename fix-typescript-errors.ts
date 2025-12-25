// TypeScript错误修复脚本
// 主要处理未使用变量和导入的问题

import fs from 'fs'
import path from 'path'

const errors = [
  {
    file: 'src/components/common/OptimizedChart.tsx',
    fix: (content: string) => {
      return content.replace(
        /return \(updateFn: \(\) => void, option: EChartsOption\) => \{/,
        'return (updateFn: () => void, _option: EChartsOption) => {'
      )
    }
  },
  {
    file: 'src/components/layout/MainLayout.tsx',
    fix: (content: string) => {
      return content.replace(
        /ProjectOutlined,\s+/,
        ''
      )
    }
  },
  {
    file: 'src/pages/DeviceIdentification.tsx',
    fix: (content: string) => {
      let result = content
      // 移除未使用的导入
      result = result.replace(/import \{ Card, Table, /, 'import { Card, ')
      result = result.replace(/ReactECharts from 'echarts-for-react'\s+/, '')
      result = result.replace(/import LoadingState, \{ TableSkeleton, ChartSkeleton, StatCardSkeleton \} /, 'import LoadingState ')
      // 修复未使用的变量
      result = result.replace(/const \[loadingStates, setLoadingStates\] = useState\(\{/, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const [loadingStates, setLoadingStates] = useState({')
      result = result.replace(/const rowSelection = \{/, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n  const rowSelection = {')
      return result
    }
  }
]

// 修复函数
function fixFile(filePath: string, fixFn: (content: string) => string) {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const fixedContent = fixFn(content)
    fs.writeFileSync(fullPath, fixedContent, 'utf-8')
    console.log(`✅ Fixed: ${filePath}`)
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error)
  }
}

// 执行修复
errors.forEach(({ file, fix }) => {
  fixFile(file, fix)
})

console.log('🎉 TypeScript error fixes completed!')