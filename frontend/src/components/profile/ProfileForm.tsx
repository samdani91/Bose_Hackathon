import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, User, MapPin, Phone, Briefcase, Save, Edit } from 'lucide-react';

// Mock user data
const initialUserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  occupation: 'Software Developer',
  bio: 'Passionate about building user-friendly web applications with modern technologies. Love to contribute to open source projects and share knowledge with the community.',
};

export const ProfileForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [formData, setFormData] = useState(initialUserData);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    // In a real app, you would save the data to a backend here
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-indigo-500 h-32 md:h-48"></div>
      <div className="px-4 py-5 sm:p-6 -mt-16">
        <div className="flex items-end md:items-center flex-col md:flex-row md:space-x-5">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 bg-white rounded-full border-4 border-white flex items-center justify-center">
              <User className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
            <p className="text-sm text-slate-500">{userData.occupation}</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="mt-4 md:mt-0 flex items-center gap-2 cursor-pointer"
              variant="outline"
            >
              <Edit size={16} />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={handleCancel} variant="outline" className='cursor-pointer'>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex items-center gap-2 cursor-pointer">
                <Save size={16} />
                Save
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm font-medium text-slate-900">{userData.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{userData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Occupation</p>
                    <p className="text-sm font-medium text-slate-900">{userData.occupation}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Bio</h3>
                <p className="text-sm text-slate-600 whitespace-pre-line">{userData.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};