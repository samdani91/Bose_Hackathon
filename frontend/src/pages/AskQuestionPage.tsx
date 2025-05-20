import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { tags } from '../data/mockData';
import type { Tag } from '../types';
import { Link } from '../components/ui/Link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const AskQuestionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [errors, setErrors] = useState({
    title: '',
    body: '',
    tags: '',
  });

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    if (value.trim().length > 0) {
      const filtered = tags
        .filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addTag = (tagName: string) => {
    if (!selectedTags.includes(tagName) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagName]);
      setTagInput('');
      setSuggestions([]);
      setErrors({...errors, tags: ''});
    }
  };

  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagName));
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      body: '',
      tags: '',
    };
    
    let isValid = true;
    
    if (title.trim().length < 15) {
      newErrors.title = 'Title must be at least 15 characters';
      isValid = false;
    }
    
    if (body.trim().length < 30) {
      newErrors.body = 'Body must be at least 30 characters';
      isValid = false;
    }
    
    if (selectedTags.length === 0) {
      newErrors.tags = 'At least one tag is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would submit to an API
      console.log({ title, body, tags: selectedTags });
      alert('Question submitted successfully!');
      
      // Reset form
      setTitle('');
      setBody('');
      setSelectedTags([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Ask a Question</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Be specific and imagine you're asking a question to another person
              </p>
              <input
                type="text"
                id="title"
                className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.title ? 'border-rose-300' : 'border-slate-300'}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.length >= 15) {
                    setErrors({...errors, title: ''});
                  }
                }}
                placeholder="e.g., How does quantum entanglement work?"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-rose-600">{errors.title}</p>
              )}
            </div>
            
            {/* Body */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">
                Body
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Include all the information someone would need to answer your question
              </p>
              <textarea
                id="body"
                rows={10}
                className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.body ? 'border-rose-300' : 'border-slate-300'}`}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (e.target.value.length >= 30) {
                    setErrors({...errors, body: ''});
                  }
                }}
                placeholder="Explain your question in detail..."
              />
              {errors.body && (
                <p className="mt-1 text-sm text-rose-600">{errors.body}</p>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
                Tags
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Add up to 5 tags to describe what your question is about
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="primary" className="flex items-center">
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-indigo-700 hover:text-indigo-900 font-bold"
                      onClick={() => removeTag(tag)}
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="tags"
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.tags ? 'border-rose-300' : 'border-slate-300'}`}
                  value={tagInput}
                  onChange={handleTagInput}
                  placeholder="e.g., physics, quantum-mechanics"
                  disabled={selectedTags.length >= 5}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-slate-200 max-h-60 overflow-auto">
                    {suggestions.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex justify-between items-center"
                        onClick={() => addTag(tag.name)}
                      >
                        <span>{tag.name}</span>
                        <span className="text-xs text-slate-500">×{tag.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.tags && (
                <p className="mt-1 text-sm text-rose-600">{errors.tags}</p>
              )}
              {selectedTags.length >= 5 && (
                <p className="mt-1 text-sm text-amber-600">Maximum of 5 tags reached</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Post Your Question
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionPage;