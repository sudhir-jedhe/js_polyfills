import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import { CardContent, CardHeader, CardFooter } from './Card';

const CreatePoll: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          options: options.filter((option) => option.trim() !== ''),
        }),
      });
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Failed to create poll');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create a New Poll</h1>
        </CardHeader>
        <CardContent>
          <Input
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            {options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="mb-2"
                required
              />
            ))}
          </div>
          <Button type="button" onClick={handleAddOption} variant="outline" className="mt-2">
            Add Option
          </Button>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Poll
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePoll;

