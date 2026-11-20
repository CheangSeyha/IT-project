'use client';

import React from 'react';
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
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-gray-900">Notifications & Alerts</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">No notifications at this time</div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectNotification(item);
                  onClose();
                }}
                className={`p-3.5 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !item.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="p-2 rounded-xl bg-gray-100 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-gray-900 truncate">{item.title}</h5>
                    <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
          <span className="text-[11px] font-medium text-gray-500">
            Automated Crawler Match & Deadline Engine
          </span>
        </div>
      </div>
    </>
  );
};
