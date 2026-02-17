
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  ShieldCheck,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'dashboard';
  setActiveTab: (tab: 'home' | 'dashboard') => void;
  onNavigateHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onNavigateHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-slate-200/60 py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center cursor-pointer group" onClick={onNavigateHome}>
              <div className="bg-gradient-to-br from-red-500 to-rose-700 p-2 rounded-xl mr-3 shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Cloud<span className="text-red-600">PDF</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={onNavigateHome}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'home' ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Tools
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'dashboard' ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              
              <div className="h-4 w-px bg-slate-200 mx-4"></div>
              
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                Resources <ChevronDown className="w-4 h-4" />
              </button>

              <button className="ml-4 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200 transition-all flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-b border-slate-200/60 px-4 py-6 space-y-2 animate-in slide-in-from-top duration-300">
            <button 
              onClick={() => { onNavigateHome(); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-red-50 hover:text-red-600"
            >
              All Tools
            </button>
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-red-50 hover:text-red-600"
            >
              Dashboard
            </button>
            <button className="w-full mt-4 bg-red-600 text-white px-4 py-4 rounded-xl font-bold shadow-lg shadow-red-100">
              Sign In
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0c10] text-slate-400 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center text-white mb-6 group cursor-pointer">
                <FileText className="text-red-500 w-8 h-8 mr-3 group-hover:rotate-12 transition-transform" />
                <span className="text-2xl font-black">CloudPDF</span>
              </div>
              <p className="text-sm leading-relaxed mb-8 pr-4">
                The world's most intuitive PDF workspace. Process, edit, and chat with your documents using next-gen AI technology.
              </p>
              <div className="flex space-x-5">
                <Github className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
                <Twitter className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase text-xs tracking-[0.2em]">Tools</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Merge & Split</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compress PDF</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PDF to Office</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase text-xs tracking-[0.2em]">Support</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Developer API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-extrabold mb-6 uppercase text-xs tracking-[0.2em]">Newsletter</h4>
              <p className="text-xs mb-4">Get the latest PDF productivity tips.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:border-red-500" />
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-widest uppercase">
            <p className="text-slate-500">© 2024 CloudPDF Labs. Built for the modern web.</p>
            <div className="flex items-center mt-6 md:mt-0 text-slate-500">
              <ShieldCheck className="w-4 h-4 mr-2 text-red-500/50" />
              <span>ISO 27001 Certified • GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
