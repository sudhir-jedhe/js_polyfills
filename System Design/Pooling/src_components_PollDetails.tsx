import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import { CardContent, CardHeader, CardFooter } from './Card';

interface Option {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: Option[];
}

const PollDetails: React.FC = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/polls/${id}`);
      const data = await response.json();
      setPoll(data);
    } catch (error) {
      console.error('Error fetching poll:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;

    try {
      const response = await fetch(`http://localhost:5000/api/polls/${id}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: selectedOption }),
      });
      if (response.ok) {
        fetchPoll();
      } else {
        console.error('Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (!poll) {
    return <div>Loading...</div>;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold">{poll.question}</h1>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option._id} className="flex items-center">
              <input
                type="radio"
                id={option._id}
                name="poll-option"
                value={option._id}
                checked={selectedOption === option._id}
                onChange={() => setSelectedOption(option._id)}
                className="mr-2"
              />
              <label htmlFor={option._id} className="flex-grow">
                {option.text}
              </label>
              <div className="text-right">
                <span className="font-semibold">{option.votes}</span>
                <span className="text-gray-500 ml-1">
                  ({totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleVote} disabled={!selectedOption} className="w-full">
          Vote
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollDetails;

