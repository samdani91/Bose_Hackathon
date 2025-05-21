import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

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
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.currentPassword) {
			newErrors.currentPassword = 'Current password is required';
		}

		if (!formData.newPassword) {
			newErrors.newPassword = 'New password is required';
		} else if (formData.newPassword.length < 6) {
			newErrors.newPassword = 'Password must be at least 6 characters';
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
	};

	const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
		setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/changePassword`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
				credentials: 'include',
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message || 'Failed to change password');
				return;
			}

			toast.success('Password successfully updated!');
			setFormData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white shadow rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<h3 className="text-lg font-medium leading-6 text-slate-900">Change Password</h3>
				<p className="mt-1 text-sm text-slate-500">
					Update your password to keep your account secure
				</p>

				<form onSubmit={handleSubmit} className="mt-5 space-y-4">
					{/* Current Password */}
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
								<Eye className="h-4 w-4" />
							) : (
								<EyeOff className="h-4 w-4" />
							)}
						</button>
					</div>

					{/* New Password */}
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
								<Eye className="h-4 w-4" />
							) : (
								<EyeOff className="h-4 w-4" />
							)}
						</button>
						<p className="mt-2 text-xs text-slate-500">
							Password must be at least 6 characters long
						</p>
					</div>

					{/* Confirm Password */}
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
								<Eye className="h-4 w-4" />
							) : (
								<EyeOff className="h-4 w-4" />
							)}
						</button>
					</div>

					{/* Submit */}
					<div className="pt-4">
						<Button type="submit" className="cursor-pointer" disabled={isLoading}>
							{isLoading ? 'Updating...' : 'Update Password'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
