import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer will be inserted here later */}
    </div>
  );
}

export default MainLayout;