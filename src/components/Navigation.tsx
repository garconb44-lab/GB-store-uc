import React, { useState } from 'react';
import { 
  Home, Coins, Flame, Newspaper, ShoppingBag, 
  MessageCircle, User, Gift, PhoneCall, Info, 
  Settings, Menu, X, Share2, LogOut, Briefcase,
  HelpCircle
} from 'lucide-react';
import { UserAccount } from '../types';
import appLogo from '../assets/images/game_over_logo_1782296492232.jpg';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onShare: () => void;
}

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  currentUser, 
  onLogout,
  onShare
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'offers', label: 'Tarifs UC', icon: Coins },
    { id: 'promotions', label: 'Promotions', icon: Flame, badge: 'HOT' },
    { id: 'news', label: 'Actualités', icon: Newspaper },
    { id: 'cart', label: 'Panier', icon: ShoppingBag, count: cartCount },
    { id: 'whatsapp', label: 'Commander sur WhatsApp', icon: MessageCircle },
    { id: 'partner', label: currentUser?.resellerStatus === 'active' ? 'Espace Revendeur' : 'Devenir Revendeur', icon: Briefcase, badge: currentUser?.resellerStatus === 'active' ? 'PRO' : 'NEW' },
    { id: 'account', label: 'Mon Compte', icon: User, labelExtra: currentUser ? `(${currentUser.name.split(' ')[0]})` : '' },
    { id: 'referral', label: 'Parrainage', icon: Gift },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'about', label: 'À propos', icon: Info },
  ];

  // If user is admin, append Admin settings
  const showAdminTab = currentUser?.isAdmin;

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Header for Mobile & Desktop */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => handleItemClick('home')}
            id="brand-header"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-yellow-400/40 shadow-[0_0_15px_rgba(234,179,8,0.25)]">
              <img 
                src={appLogo} 
                alt="GB STORES UC Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-black tracking-wider text-white select-none leading-none group-hover:text-yellow-400 transition-colors">
                GB STORES <span className="text-yellow-400">UC</span>
              </span>
              <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">
                BURKINA FASO
              </span>
            </div>
          </div>

          {/* Actions & Hamburger */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Share Button */}
            <button
              onClick={onShare}
              className="p-2 text-yellow-400/80 hover:text-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10 border border-yellow-400/10 rounded-lg transition-all"
              title="Inviter un ami"
              id="header-share-btn"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Cart Quick Icon */}
            <button
              onClick={() => handleItemClick('cart')}
              className="relative p-2 text-gray-300 hover:text-white bg-gray-900 border border-gray-800 rounded-lg transition-all"
              id="header-cart-btn"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white bg-gray-900 border border-gray-800 rounded-lg transition-all"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Sidebar (Desktop Only) */}
      <aside className="hidden lg:flex fixed left-0 top-[65px] bottom-0 w-64 bg-black/95 border-r border-yellow-500/10 flex-col py-6 px-4 overflow-y-auto z-40">
        <div className="space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
                  isActive 
                    ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'
                }`}
                id={`sidebar-item-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? 'text-yellow-400 scale-110' : 'text-gray-500 group-hover:text-yellow-400/80 group-hover:scale-105'}`} />
                  <span>{item.label} <span className="text-xs text-yellow-500/80 font-normal">{item.labelExtra || ''}</span></span>
                </div>
                {item.badge && (
                  <span className="bg-red-500/25 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider font-mono">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-yellow-500 text-black text-[10px] font-black h-5 px-1.5 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin panel menu link */}
          {showAdminTab && (
            <button
              onClick={() => handleItemClick('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-gray-400 hover:text-amber-300 hover:bg-amber-500/5 border border-transparent'
              }`}
              id="sidebar-item-admin"
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-4.5 w-4.5 text-amber-500" />
                <span>Console Admin</span>
              </div>
              <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider">
                ADMIN
              </span>
            </button>
          )}
        </div>

        {/* User Quick Info at Bottom of Sidebar */}
        <div className="pt-4 border-t border-gray-800/80 mt-6 space-y-3">
          {currentUser ? (
            <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold text-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono truncate">ID: {currentUser.pubgId}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full mt-3 flex items-center justify-center space-x-1.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs rounded-xl font-semibold transition-all cursor-pointer"
                id="sidebar-logout"
              >
                <LogOut className="h-3 w-3" />
                <span>Se déconnecter</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleItemClick('account')}
              className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-yellow-400/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              id="sidebar-login-btn"
            >
              <User className="h-3.5 w-3.5" />
              <span>S'identifier / S'inscrire</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile/Tablet Side Drawer Menu */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`fixed left-0 top-0 bottom-0 w-72 bg-[#050508] border-r border-yellow-500/20 flex flex-col py-6 px-4 z-50 transform transition-transform duration-300 overflow-y-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-900 pb-4">
            <div className="flex items-center space-x-2.5">
              <img 
                src={appLogo} 
                alt="GB STORES UC Logo" 
                className="w-8 h-8 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-black text-lg text-white">GB STORES <span className="text-yellow-400">UC</span></span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white bg-gray-900 rounded-lg border border-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'
                  }`}
                  id={`drawer-item-${item.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.label} <span className="text-xs text-yellow-500/80 font-normal">{item.labelExtra || ''}</span></span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500/25 text-red-400 text-[9px] px-1.5 py-0.5 rounded font-black font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-yellow-500 text-black text-[10px] font-black h-5 px-1.5 rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {showAdminTab && (
              <button
                onClick={() => handleItemClick('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-gray-400 hover:text-amber-300 hover:bg-amber-500/5 border border-transparent'
                }`}
                id="drawer-item-admin"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="h-4.5 w-4.5 text-amber-500" />
                  <span>Console Admin</span>
                </div>
                <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.5 rounded font-black font-mono">
                  ADMIN
                </span>
              </button>
            )}
          </div>

          {/* Drawer Footer / User Accounts */}
          <div className="pt-4 border-t border-gray-900 mt-6 space-y-3">
            {currentUser ? (
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[9px] text-gray-500 font-mono truncate">ID: {currentUser.pubgId}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full mt-2.5 flex items-center justify-center space-x-1.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold transition-all cursor-pointer"
                  id="drawer-logout"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleItemClick('account')}
                className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-yellow-400/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                id="drawer-login-btn"
              >
                <User className="h-3.5 w-3.5" />
                <span>S'identifier / S'inscrire</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
