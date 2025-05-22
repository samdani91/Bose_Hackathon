import React, { useEffect, useState } from 'react';
import { ProfileForm } from './ProfileForm';
import { useParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/getUserId`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error fetching user ID:', errorData.message);
          return;
        }

        const data = await response.json();
        setUserId(data.user_id);
      } catch (err) {
        console.error('Fetch user ID error:', err);
      }
    };

    fetchUserId();
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">Manage personal information and preferences</p>
      </div>

      <div className="space-y-8">
        <ProfileForm isOwnProfile={id === userId} />
      </div>
    </div>
  );
};

export default ProfilePage;