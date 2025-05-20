import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from '../ui/Link';

export const AskQuestionButton: React.FC = () => {
  return (
    <Link to="/ask">
      <Button className="flex items-center">
        <Plus className="h-5 w-5 mr-1" />
        Ask Question
      </Button>
    </Link>
  );
};