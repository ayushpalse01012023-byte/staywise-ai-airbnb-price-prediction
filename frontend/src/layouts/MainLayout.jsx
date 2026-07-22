import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Navbar will be inserted here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer will be inserted here */}
    </div>
  );
}

export default MainLayout;