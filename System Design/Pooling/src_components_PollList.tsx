import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { CardContent } from './Card';
import Button from './Button';

interface Poll {
  _id: string;
  question: string;
  options: { _id: string; text: string; votes: number }[];
}

const PollList: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Active Polls</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <Card key={poll._id}>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{poll.question}</h2>
              <p className="text-gray-600 mb-4">
                {poll.options.length} options • {poll.options.reduce((sum, option) => sum + option.votes, 0)} votes
              </p>
              <Link to={`/poll/${poll._id}`}>
                <Button variant="outline" className="w-full">
                  View Poll
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PollList;

