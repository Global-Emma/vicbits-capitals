'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Camera,
  CreditCard,
  Key,
  Check,
  Lock,
} from 'lucide-react';
import api from '@/utils/axios';
import { useApp } from '@/utils/useApp';

type TabType = 'profile' | 'security' | 'notifications' | 'billing' | 'api';

export default function SettingsPage() {
  const { user, updateUserState } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [avatarMessage, setAvatarMessage] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [passwordChange, setPasswordChange] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  const [profile, setProfile] = useState<Partial<{ firstName: string; lastName: string; jobTitle: string; bio: string; company: string; timezone: string }>>({});
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  const handleSave = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    setSaveError('');
    try {
      const { data } = await api.put('/api/portal/settings', { ...profile, preferences: notifications });
      updateUserState(data.data);
      setIsSaved(true);
      window.setTimeout(() => setIsSaved(false), 2500);
    } catch {
      setSaveError('Account settings could not be saved. Please try again.');
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setPasswordMessage('The new passwords do not match.');
      return;
    }
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: passwordChange.currentPassword,
        newPassword: passwordChange.newPassword,
      });
      setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage('Password updated.');
    } catch {
      setPasswordMessage('Password could not be updated. Check your current password and try again.');
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!file.type.startsWith('image/')) {
      setAvatarMessage('Choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarMessage('Profile images must be 5 MB or smaller.');
      return;
    }

    setAvatarUploading(true);
    setAvatarMessage('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/api/portal/settings/avatar', formData);
      updateUserState(data.data);
      setAvatarMessage('Profile image updated.');
    } catch {
      setAvatarMessage('Profile image could not be uploaded. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'api', label: 'API & Integrations', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Settings</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your account preferences, security policies, billing, and system integrations.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            {isSaved ? <Check size={16} /> : null}
            {isSaved ? 'Changes Saved' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl"
              >
                
                {/* 1. PROFILE TAB */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Public Profile</h2>
                      <p className="text-xs text-slate-400 mt-0.5">This information will be displayed across your team workspace.</p>
                    </div>

                    <div className="flex items-center gap-5 pt-2">
                      <div
                        className="w-20 h-20 rounded-full bg-slate-800 bg-cover bg-center border-2 border-slate-700 flex items-center justify-center text-slate-300 text-xl font-bold"
                        style={user?.avatar ? { backgroundImage: `url('${user.avatar}')` } : undefined}
                        aria-label="Profile image"
                      >
                        {!user?.avatar && (`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'VB')}
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-200">{user?.firstName} {user?.lastName}<p className="text-xs text-slate-500">{user?.email}</p></div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-blue-500 hover:text-white">
                          <Camera size={14} />
                          {avatarUploading ? 'Uploading...' : 'Upload profile image'}
                          <input type="file" accept="image/*" onChange={uploadAvatar} disabled={avatarUploading} className="sr-only" />
                        </label>
                        {avatarMessage && <p role="status" className="text-xs text-slate-400">{avatarMessage}</p>}
                      </div>
                    </div>

                    <hr className="border-slate-800/80" />

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                        <input type="email" value={user?.email || ''} disabled className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-400" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">First Name</label>
                        <input type="text" value={profile.firstName ?? user?.firstName ?? ''} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Last Name</label>
                        <input type="text" value={profile.lastName ?? user?.lastName ?? ''} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Job Title</label>
                        <input type="text" value={profile.jobTitle ?? user?.jobTitle ?? ''} onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Company</label>
                        <input type="text" value={profile.company ?? user?.company ?? ''} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio</label>
                      <textarea
                        rows={3}
                        value={profile.bio ?? user?.bio ?? ''}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Timezone</label>
                      <input type="text" value={profile.timezone ?? user?.timezone ?? 'UTC'} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                    </div>
                    {saveError && <p role="alert" className="text-xs text-rose-400">{saveError}</p>}
                  </form>
                )}

                {/* 2. SECURITY TAB */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Security & Password</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Update your password and review account security settings.</p>
                    </div>

                    {/* Change Password */}
                    <form onSubmit={changePassword} className="space-y-4 border-b border-slate-800 pb-6">
                      <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                        <Lock size={16} className="text-blue-400" /> Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                          <input type="password" required value={passwordChange.currentPassword} onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">New Password</label>
                          <input type="password" required minLength={8} value={passwordChange.newPassword} onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Confirm Password</label>
                          <input type="password" required minLength={8} value={passwordChange.confirmPassword} onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
                        </div>
                      </div>
                      <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Update Password</button>
                      {passwordMessage && <p role="status" className="text-xs text-slate-300">{passwordMessage}</p>}
                    </form>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-slate-200">Two-factor authentication</h3>
                      <p className="text-xs text-slate-400">Authenticator verification is not configured for this account.</p>
                    </div>
                  </div>
                )}

                {/* 3. NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Control how and when you receive system communications.</p>
                    </div>

                    <div className="space-y-4">
                      {Object.entries({
                        emailAlerts: { label: 'Email Notifications', desc: 'Receive emails for activity updates and core transactions.' },
                        securityAlerts: { label: 'Security & Login Alerts', desc: 'Get notified immediately about new sign-ins or password changes.' },
                        weeklyReport: { label: 'Weekly Summary Digest', desc: 'Receive an automated weekly performance report.' },
                        marketingEmails: { label: 'Product & Feature Updates', desc: 'Stay updated with new release notes and feature announcements.' },
                      }).map(([key, item]) => (
                        <div key={key} className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                          <div>
                            <div className="text-sm font-medium text-slate-200">{item.label}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifications({ ...notifications, [key]: !(notifications[key] ?? user?.preferences?.[key] ?? false) })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              (notifications[key] ?? user?.preferences?.[key] ?? false) ? 'bg-blue-600' : 'bg-slate-800'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              (notifications[key] ?? user?.preferences?.[key] ?? false) ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. BILLING TAB */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Investor Profile</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Your account classification and target capital are stored with your investor profile.</p>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4"><dt className="text-xs text-slate-400">Investor type</dt><dd className="mt-1 font-medium text-white">{user?.investorType || 'Not set'}</dd></div>
                      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4"><dt className="text-xs text-slate-400">Target capital</dt><dd className="mt-1 font-medium text-white">{user?.targetCapital || 'Not set'}</dd></div>
                    </dl>
                  </div>
                )}

                {/* 5. API TAB */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">API Keys & Access Tokens</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Personal API credentials are not enabled for this account.</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-400">API credential management is unavailable. Do not share your sign-in token.</div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>

      </div>
    </div>
  );
}

































