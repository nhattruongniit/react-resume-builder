import { Outlet } from 'react-router'
import Navbar from './components/navbar'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import Loader from '../../atoms/loader';
import Login from '../../../pages/login';

function MainLayout() {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if(loading) {
    return <Loader />
  }
  
  return (
    <div>
      {user ? (
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  )
}

export default MainLayout