import React, { useEffect, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, User, Briefcase, Save, Edit, School, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useParams, Link } from 'react-router-dom';

const CLOUDINARY_UPLOAD_PRESET = 'hackathonImages';
const CLOUDINARY_CLOUD_NAME = 'dt3catuxy';

interface UserData {
  name: string;
  email: string;
  occupation: string;
  institution: string;
  classs: string;
  bio: string;
  image?: string;
}

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  viewsCount: number;
  user_id: string;
}

interface UserResponse {
  user: UserData;
}

interface QuestionsResponse {
  questions: Question[];
}

interface ProfileFormProps {
  isOwnProfile: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ isOwnProfile }) => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'personal' | 'questions'>('personal');

  useEffect(() => {
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

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/user/${id}`, {
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

        const data: QuestionsResponse = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Fetch questions error:', err);
        toast.error('Failed to fetch user questions.');
      }
    };

    fetchUser();
    fetchQuestions();
  }, [id]);

  const handleEdit = () => {
    if (isOwnProfile) {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setProfileImageFile(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><p className="text-center text-slate-600 text-lg">Loading profile...</p></div>;
  if (!formData) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><p className="text-center text-red-500 text-lg">Error loading profile</p></div>;

  return (
    <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-8 space-y-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
        <div className="relative">
          <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-indigo-600 overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-100">
                <User className="h-16 w-16 sm:h-20 sm:w-20 text-indigo-600" />
              </div>
            )}
          </div>
          {isEditing && isOwnProfile && (
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
        <div className="mt-6 sm:mt-0 text-center sm:text-left flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{userData?.name}</h1>
          <p className="text-lg text-slate-500 mt-1">{userData?.occupation || 'Not provided'}</p>
          {!isEditing && isOwnProfile && (
            <Button
              onClick={handleEdit}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto sm:mx-0"
            >
              <Edit size={16} />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'personal'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-indigo-100'
              }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${activeTab === 'questions'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-indigo-100'
              }`}
          >
            Questions
          </button>
        </div>
      </div>

      <div className="pt-6">
        {activeTab === 'personal' ? (
          isEditing && isOwnProfile ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Input
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Input
                  label="Institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Input
                  label="Class"
                  name="classs"
                  value={formData.classs}
                  onChange={handleChange}
                  className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  maxLength={500}
                  className="block w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow resize-y shadow-sm"
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
            <div className="space-y-6">
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
                <InfoItem
                  icon={<School className="h-5 w-5 text-slate-400" />}
                  label="Institution"
                  value={userData?.institution}
                />
                <InfoItem
                  icon={<BookOpen className="h-5 w-5 text-slate-400" />}
                  label="Class"
                  value={userData?.classs}
                />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-700 mb-3">Bio</h3>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-lg shadow-sm max-h-60 overflow-y-auto">
                  {userData?.bio || 'No bio provided'}
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-4 bg-white rounded-lg shadow-sm p-4">
            {questions.length > 0 ? (
              questions.map((question) => (
                <div
                  key={question._id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    <Link
                      to={`/question/${question._id}`}
                      className="hover:text-indigo-600 cursor-pointer"
                    >
                      {question.title}
                    </Link>

                  </h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-3">{question.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-slate-900">No questions posted</h3>
                <p className="mt-1 text-slate-500">This user hasn’t posted any questions yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    {icon}
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-base text-slate-900">{value || 'Not provided'}</p>
    </div>
  </div>
);