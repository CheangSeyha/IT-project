'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from '@/types';
import { Bell, Check, Sparkles, Clock, GraduationCap, Server } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Sparkles className="w-3.5 h-3.5 text-blue-600" />;
      case 'deadline':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'curation':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Server className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No notifications at this time</div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectNotification(item);
                  onClose();
                }}
                className={`p-3.5 flex items-start space-x-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !item.read ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                    <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <span className="text-[10px] font-semibold text-slate-400">
            Automated Crawler Match & Real-time Alert Engine
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
