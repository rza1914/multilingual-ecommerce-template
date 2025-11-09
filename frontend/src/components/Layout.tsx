import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FixedFloatingChatBot from './FixedFloatingChatBot';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Add padding-top to account for fixed header */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <Outlet />
      </main>
      <Footer />
      <FixedFloatingChatBot />
    </div>
  );
};

export default Layout;
