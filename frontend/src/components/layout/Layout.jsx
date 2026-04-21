import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <div className="page-content fade-up">
          <Outlet />
        </div>
      </div>
    </div>
  )
}