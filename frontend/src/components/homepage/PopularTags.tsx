import React from 'react';
import { Badge } from '../ui/Badge';
import type { Tag } from '../../types';
import { Link } from '../ui/Link';

interface PopularTagsProps {
  tags: Tag[];
}

export const PopularTags: React.FC<PopularTagsProps> = ({ tags }) => {
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium text-slate-900 mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(tag => (
          <Link key={tag.id} to={`/tags/${tag.name}`}>
            <Badge variant="primary" className="cursor-pointer hover:bg-indigo-200 transition-colors">
              {tag.name} <span className="ml-1 text-indigo-600">&times;{tag.count}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};