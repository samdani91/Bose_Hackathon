import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Link } from '../components/ui/Link';
import { ArrowLeft, X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const AskQuestionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    title: '',
    body: '',
    images: '',
  });

  const MAX_TITLE_LENGTH = 150;
  const MAX_BODY_LENGTH = 3000;
  const MAX_IMAGES = 3;

  useEffect(() => {
    if (errors.title) {
      setIsUploading(false);
      toast.error(errors.title);
      setErrors((prev) => ({ ...prev, title: '' }));
    }
    if (errors.body) {
      setIsUploading(false);
      toast.error(errors.body);
      setErrors((prev) => ({ ...prev, body: '' }));
    }
    if (errors.images) {
      setIsUploading(false);
      toast.error(errors.images);
      setErrors((prev) => ({ ...prev, images: '' }));
    }
  }, [errors]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);

      if (images.length + newImages.length > MAX_IMAGES) {
        setErrors({
          ...errors,
          images: `You can upload a maximum of ${MAX_IMAGES} images`,
        });
        return;
      }

      setImages([...images, ...newImages]);
      setImagePreviews([...imagePreviews, ...newImages.map((file) => URL.createObjectURL(file))]);
      setErrors({ ...errors, images: '' });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      body: '',
      images: '',
    };

    let isValid = true;

    if (title.trim().length < 15) {
      newErrors.title = 'Title must be at least 15 characters';
      isValid = false;
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
      isValid = false;
    }

    if (body.trim().length < 30) {
      newErrors.body = 'Body must be at least 30 characters';
      isValid = false;
    } else if (body.length > MAX_BODY_LENGTH) {
      newErrors.body = `Body must be less than ${MAX_BODY_LENGTH} characters`;
      isValid = false;
    }

    if (images.length > MAX_IMAGES) {
      newErrors.images = `You can upload a maximum of ${MAX_IMAGES} images`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'hackathonImages');
      formData.append('cloud_name', 'dt3catuxy');

      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dt3catuxy/image/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error('Failed to upload image to Cloudinary');
        }
        uploadedUrls.push(data.secure_url);
        console.log(uploadedUrls)
      } catch (error) {
        throw new Error('Error uploading image to Cloudinary');
      }
    }

    return uploadedUrls;
  };

  const deleteImagesFromCloudinary = async (urls: string[]) => {
    for (const url of urls) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/system/deleteImage`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: url }),
        });
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    toast.info(
      <div>
        <p>Uploading question...</p>
      </div>,
      {
        icon: <Loader2 className="animate-spin" />,
        cancel: !isUploading,
      }
    );

    let imageUrls: string[] = [];

    try {
      // Upload images to Cloudinary if any
      if (images.length > 0) {
        imageUrls = await uploadImagesToCloudinary(images);
      }

      // Submit question with image URLs
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/question/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: body,
          images: imageUrls,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Question submit failed');
      }

      toast.success('Question submitted successfully!');
      setTitle('');
      setBody('');
      setImages([]);
      setImagePreviews([]);
      navigate('/');
    } catch (error) {
      // Cleanup uploaded images if submission fails
      if (imageUrls.length > 0) {
        await deleteImagesFromCloudinary(imageUrls);
      }
      console.error('Error submitting question:', error);
      toast.error('There was an error submitting your question. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Ask a Question</h1>
          <p className="mt-1 text-sm text-slate-600">
            Share your knowledge and help others by asking a clear, detailed question
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <span className={`text-xs ${title.length > MAX_TITLE_LENGTH ? 'text-rose-600' : 'text-slate-500'}`}>
                {title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Be specific and imagine you're asking a question to another person
            </p>
            <input
              type="text"
              id="title"
              className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${
                errors.title ? 'border-rose-300' : 'border-slate-300'
              } px-4 py-2`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.length >= 15 && e.target.value.length <= MAX_TITLE_LENGTH) {
                  setErrors({ ...errors, title: '' });
                }
              }}
              placeholder="e.g., How does quantum entanglement work?"
              maxLength={MAX_TITLE_LENGTH}
            />
            {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title}</p>}
          </div>

          {/* Body Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="body" className="block text-sm font-medium text-slate-700">
                Detailed Explanation
              </label>
              <span className={`text-xs ${body.length > MAX_BODY_LENGTH ? 'text-rose-600' : 'text-slate-500'}`}>
                {body.length}/{MAX_BODY_LENGTH}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Include all the information someone would need to answer your question
            </p>
            <textarea
              id="body"
              rows={8}
              className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${
                errors.body ? 'border-rose-300' : 'border-slate-300'
              } px-4 py-2`}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (e.target.value.length >= 30 && e.target.value.length <= MAX_BODY_LENGTH) {
                  setErrors({ ...errors, body: '' });
                }
              }}
              placeholder="Explain your question in detail..."
              maxLength={MAX_BODY_LENGTH}
            />
            {errors.body && <p className="mt-1 text-sm text-rose-600">{errors.body}</p>}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Images (Optional)
            </label>
            <p className="text-xs text-slate-500">
              Add up to {MAX_IMAGES} images to help explain your question
            </p>

            <div className="mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={images.length >= MAX_IMAGES}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= MAX_IMAGES}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {images.length >= MAX_IMAGES ? 'Maximum images reached' : 'Upload Images'}
              </Button>

              {errors.images && <p className="mt-1 text-sm text-rose-600">{errors.images}</p>}

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-slate-200">
                      <img
                        src={imagePreviews[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-slate-800/80 text-white rounded-full p-1 hover:bg-rose-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="p-2 bg-slate-50">
                        <p className="text-xs text-slate-600 truncate">{image.name}</p>
                        <p className="text-xs text-slate-500">
                          {(image.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              className="min-w-[200px]"
              disabled={isUploading}
            >
              {isUploading ? 'Posting...' : 'Post Your Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionPage;