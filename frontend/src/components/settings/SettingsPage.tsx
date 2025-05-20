import React from 'react';
import { PasswordForm } from './PasswordForm';
import { DeleteAccount } from './DeleteAccount';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">Manage your account settings and preferences</p>
      </div>
      
      <div className="space-y-8">
        <PasswordForm />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default SettingsPage;