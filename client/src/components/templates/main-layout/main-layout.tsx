import { Outlet } from 'react-router'
import Navbar from './components/navbar'

function MainLayout() {
  return (
    <div>
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout