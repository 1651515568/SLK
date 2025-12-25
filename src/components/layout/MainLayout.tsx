import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Button } from 'antd'
import {
  DashboardOutlined,
  SafetyOutlined,
  CloudServerOutlined,
  NodeIndexOutlined,
  SafetyCertificateOutlined,
  BugOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined as BrainOutlined,
  ProjectOutlined,
  GlobalOutlined,
  RadarChartOutlined,
  AuditOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems: MenuProps['items'] = [
    {
      key: '/security-overview',
      icon: <DashboardOutlined />,
      label: '安全态势总览',
    },
    {
      key: '/device-identification',
      icon: <CloudServerOutlined />,
      label: '设备身份识别',
    },
    {
      key: '/data-fusion',
      icon: <NodeIndexOutlined />,
      label: '数据融合分析',
    },
    {
      key: '/access-control',
      icon: <SafetyCertificateOutlined />,
      label: '接入阻断管理',
    },
    {
      key: '/vulnerability-management',
      icon: <BugOutlined />,
      label: '漏洞扫描管理',
    },
    {
      type: 'divider',
    },
    {
      key: '/soc-dashboard',
      icon: <RadarChartOutlined />,
      label: '安全运营中心',
    },
    {
      key: '/ai-analysis',
      icon: <BrainOutlined />,
      label: 'AI智能分析',
    },
    {
      key: '/threat-intelligence',
      icon: <GlobalOutlined />,
      label: '威胁情报中心',
    },
    {
      key: '/audit-log',
      icon: <AuditOutlined />,
      label: '审计日志管理',
    },

  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const getPageTitle = () => {
    const currentItem = menuItems?.find(item => item?.key === location.pathname)
    return (currentItem as any)?.label || '终端身份识别与安全防护系统'
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white shadow-lg"
        width={256}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <SafetyOutlined className="text-2xl text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">安全防护系统</span>
            </div>
          ) : (
            <SafetyOutlined className="text-2xl text-blue-600" />
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-none"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white px-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            <h1 className="text-xl font-semibold text-gray-800 m-0">
              {getPageTitle()}
            </h1>
          </div>
          
          <Space size="large">
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="text-lg"
                onClick={() => {
                  // TODO: 打开通知面板
                }}
              />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="text-gray-700">管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content className="p-6 bg-gray-50 min-h-0 overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout