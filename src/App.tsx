// import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import MainLayout from '@/components/layout/MainLayout'
import DeviceIdentification from '@/pages/DeviceIdentification'
import SecurityOverview from '@/pages/SecurityOverview'
import DataFusion from '@/pages/DataFusion'
import AccessControl from '@/pages/AccessControl'
import VulnerabilityManagement from '@/pages/VulnerabilityManagement'
import SOCDashboard from '@/pages/SOCDashboard'
import AIAnalysisReport from '@/pages/AIAnalysisReport'
import ThreatIntelligence from '@/pages/ThreatIntelligence'
import AuditLogManagement from '@/pages/AuditLogManagement'
import PerformanceMonitor from '@/components/common/PerformanceMonitor'
import LayoutInspector from '@/components/common/LayoutInspector'

import './App.css'

const { Content } = Layout

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        <MainLayout>
          <Content className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/security-overview" replace />} />
              <Route path="/security-overview" element={<SecurityOverview />} />
              <Route path="/device-identification" element={<DeviceIdentification />} />
              <Route path="/data-fusion" element={<DataFusion />} />
              <Route path="/access-control" element={<AccessControl />} />
              <Route path="/vulnerability-management" element={<VulnerabilityManagement />} />
              <Route path="/soc-dashboard" element={<SOCDashboard />} />
              <Route path="/ai-analysis" element={<AIAnalysisReport />} />
              <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
              <Route path="/audit-log" element={<AuditLogManagement />} />

              <Route path="/device-identification/:deviceId" element={<DeviceIdentification />} />
            </Routes>
          </Content>
        </MainLayout>
      </Layout>
      
      {/* 开发环境下显示性能监控 */}
      {true && (
        <>
          <PerformanceMonitor
            enabled={true}
            threshold={50} // 降低阈值以检测更多性能问题
            showOverlay={false} // 不显示覆盖层，避免影响页面显示
            onMetricsUpdate={(metrics) => {
              // 输出性能警告
              if (metrics.fps < 30) {
                console.warn(`🔴 低FPS警告: ${metrics.fps}fps`)
              }
              if (metrics.memoryUsage && metrics.memoryUsage > 70) {
                console.warn(`🔴 内存使用警告: ${metrics.memoryUsage}%`)
              }
              if (metrics.renderTime > 100) {
                console.warn(`🔴 渲染时间警告: ${metrics.renderTime.toFixed(2)}ms`)
              }
              if (metrics.layoutShift > 0.1) {
                console.warn(`🔴 布局偏移警告: ${metrics.layoutShift.toFixed(3)}`)
              }
            }}
          />
          
          <LayoutInspector
            enabled={true}
            onIssuesFound={(issues) => {
              if (issues.length > 0) {
                console.log(`📋 布局检测完成: 发现 ${issues.length} 个布局问题`)
              } else {
                console.log('✅ 布局检测完成: 未发现明显问题')
              }
            }}
          />
        </>
      )}
    </Router>
  )
}

export default App