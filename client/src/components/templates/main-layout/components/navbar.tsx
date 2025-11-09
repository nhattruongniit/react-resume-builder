import { Link, useNavigate } from 'react-router'
import { PATH } from '../../../../configs/path'

function Navbar() {
  const navigate = useNavigate();
  const user = { 
    name: 'Tony Nguyen',
    email: 'tony@example.com',
  }
  
  function logoutUser() {
    navigate(PATH.HOME);
  }

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to={PATH.HOME}>
          <img src="/assets/images/logo.svg" alt="Resume" className="h-11 w-auto" />
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <p className='max-sm:hidden'>Hi, {user.name}</p>
          <button 
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
            onClick={logoutUser} 
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar