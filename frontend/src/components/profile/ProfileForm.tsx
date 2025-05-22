import React, { useEffect, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, User, Briefcase, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const CLOUDINARY_UPLOAD_PRESET = 'hackathonImages';
const CLOUDINARY_CLOUD_NAME = 'dt3catuxy';

interface UserData {
  name: string;
  email: string;
  occupation: string;
  bio: string;
  image?: string;
}

interface UserResponse {
  user: UserData;
}

export const ProfileForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserResponse = await response.json();

      if (!data.user.name || !data.user.email) {
        throw new Error('Invalid user data received');
      }

      setUserData(data.user);
      setFormData(data.user);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setFormData(userData);
    setProfileImageFile(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setProfileImageFile(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Image upload failed');
      return data.secure_url;
    } catch (err) {
      throw new Error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      let imageUrl = formData.image || '';
      if (profileImageFile) {
        imageUrl = await uploadImageToCloudinary(profileImageFile);
      }

      const updatedData: UserData = {
        ...formData,
        image: imageUrl,
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/updateUser`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData: UserResponse = await res.json();
      toast.success('Profile updated successfully');
      setUserData(responseData.user);
      setFormData(responseData.user);
      setProfileImageFile(null);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'Error updating profile');
    }
  };

  if (isLoading) return <p className="text-center text-slate-600 text-lg">Loading profile...</p>;
  if (!formData) return <p className="text-center text-red-500 text-lg">Error loading profile</p>;

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mb-20">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-36 sm:h-48"></div>
        <div className="px-6 py-8 sm:px-10 sm:py-10 -mt-20 sm:-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <div className="flex justify-center sm:justify-start">
              <div className="flex-shrink-0 relative">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <User className="h-14 w-14 sm:h-16 sm:w-16 text-indigo-600" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                    <p className="text-white text-sm font-medium">Uploading...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 sm:mt-0 flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{userData?.name}</h2>
              <p className="text-base text-slate-500 mt-1">{userData?.occupation || 'Not provided'}</p>
            </div>

            {!isEditing ? (
              <Button 
                onClick={handleEdit} 
                className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 self-center sm:self-start"
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            ) : null}
          </div>

          <div className="mt-10">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="rounded-lg"
                  />
                  <Input 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="rounded-lg"
                  />
                  <Input 
                    label="Occupation" 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleChange} 
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    maxLength={500}
                    className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow resize-y"
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    disabled={isUploading}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100 py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUploading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <InfoItem 
                    icon={<Mail className="h-5 w-5 text-slate-400" />} 
                    label="Email" 
                    value={userData?.email} 
                  />
                  <InfoItem 
                    icon={<Briefcase className="h-5 w-5 text-slate-400" />} 
                    label="Occupation" 
                    value={userData?.occupation} 
                  />
                </div>
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-base font-medium text-slate-700 mb-3">Bio</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                    {userData?.bio || 'No bio provided'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    {icon}
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-base text-slate-900">{value || 'Not provided'}</p>
    </div>
  </div>
);