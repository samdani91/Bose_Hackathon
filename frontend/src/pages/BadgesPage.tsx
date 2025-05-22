import React from 'react';
import { Award, Star, Trophy, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const BadgesPage: React.FC = () => {
  const reputationRules = [
    {
      category: 'Questions',
      rules: [
        { action: 'Upvote on a question', points: '+10 points' },
        { action: 'Downvote on a question', points: '-2 points' },
        { action: 'Asking a question', points: '+3 points' },
      ],
    },
    {
      category: 'Answers',
      rules: [
        { action: 'Upvote on an answer', points: '+15 points' },
        { action: 'Downvote on an answer', points: '-5 points' },
        { action: 'Providing an answer', points: '+1 points' },
      ],
    },
  ];

  const badges = [
    {
      name: 'Newcomer',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      range: '0-99 points',
      description: 'Welcome to the community! Start asking and answering to earn more points.',
    },
    {
      name: 'Contributor',
      icon: <Award className="h-6 w-6 text-blue-500" />,
      range: '100-499 points',
      description: 'You’re making a difference with your questions and answers!',
    },
    {
      name: 'Expert',
      icon: <Trophy className="h-6 w-6 text-green-500" />,
      range: '500-999 points',
      description: 'Your expertise is shining through with valuable contributions.',
    },
    {
      name: 'Master',
      icon: <Medal className="h-6 w-6 text-purple-500" />,
      range: '1,000-2,499 points',
      description: 'A true master of knowledge, guiding the community with wisdom.',
    },
    {
      name: 'Legend',
      icon: <Crown className="h-6 w-6 text-red-500" />,
      range: '2,500+ points',
      description: 'A legendary member whose contributions shape the community.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-slate-50/50">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200/80 hover:border-slate-300 transition-colors">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Award className="h-8 w-8 text-indigo-500" />
          Badges
        </h1>
        <p className="mt-2 text-slate-600">
          Earn reputation points through your contributions and unlock badges to showcase your achievements!
        </p>
      </div>


      <Card className="shadow-lg border border-slate-200/80 hover:border-slate-300 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            Reputation Points Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reputationRules.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-medium text-slate-700 mb-3">{section.category}</h3>
              <ul className="space-y-2">
                {section.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex} className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                    <span className="text-slate-600">{rule.action}</span>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                      {rule.points}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-slate-200/80 hover:border-slate-300 transition-colors">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">
            Badge Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-md border border-slate-200/50 hover:bg-indigo-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {badge.icon}
                  <div>
                    <h3 className="text-lg font-medium text-slate-800">{badge.name}</h3>
                    <p className="text-sm text-slate-600">{badge.range}</p>
                    <p className="mt-1 text-sm text-slate-500">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgesPage;