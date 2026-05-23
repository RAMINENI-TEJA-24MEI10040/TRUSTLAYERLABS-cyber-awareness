import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ChatWidget from '../ai-assistant/ChatWidget';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="pt-24 transition-colors duration-300">
        <Outlet />
      </main>

      <Footer />

      {/* Global AI Assistant */}
      <ChatWidget />
    </div>
  );
}