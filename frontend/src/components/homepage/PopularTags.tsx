import React, { useEffect, useState } from 'react';
import { Badge } from '../ui/Badge';
import type { Tag } from '../../types';
import { Link } from '../ui/Link';

interface PopularTagsProps {
  // No props needed since we're fetching data
}

interface ApiResponse {
  message: string;
  tags: Tag[];
}

export const PopularTags: React.FC<PopularTagsProps> = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/system/getTags');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setTags(data.tags.sort((a, b) => b.count - a.count).slice(0, 10));
        setError(null);
      } catch (err) {
        setError('Failed to load popular tags');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-slate-900 mb-3">Popular Tags</h3>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-slate-900 mb-3">Popular Tags</h3>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-slate-900 mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link key={tag._id} to={`/tags/${tag.name}`}>
            <Badge variant="primary" className="cursor-pointer hover:bg-indigo-200 transition-colors">
              {tag.name} <span className="ml-1 text-indigo-600">×{tag.count}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};