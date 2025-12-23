// import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import MainLayout from '@/components/layout/MainLayout'
import DeviceIdentification from '@/pages/DeviceIdentification'
import SecurityOverview from '@/pages/SecurityOverview'
import DataFusion from '@/pages/DataFusion'
import AccessControl from '@/pages/AccessControl'
import VulnerabilityManagement from '@/pages/VulnerabilityManagement'
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
              <Route path="/device-identification/:deviceId" element={<DeviceIdentification />} />
            </Routes>
          </Content>
        </MainLayout>
      </Layout>
    </Router>
  )
}

export default App