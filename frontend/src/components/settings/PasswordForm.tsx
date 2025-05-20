import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export const PasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear success message when form is changed
    if (success) setSuccess(false);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would call an API to change the password
      console.log('Password change submitted', formData);
      
      // Simulate success
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-slate-900">Change Password</h3>
        <p className="mt-1 text-sm text-slate-500">
          Update your password to keep your account secure
        </p>
        
        {success && (
          <div className="mt-4 p-3 bg-green-50 rounded-md text-green-800 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span>Password successfully updated!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="relative">
              <Input
                label="Current Password"
                name="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPassword.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Input
                label="New Password"
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPassword.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <div className="relative">
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className='cursor-pointer'>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};