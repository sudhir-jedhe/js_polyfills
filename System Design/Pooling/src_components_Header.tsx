import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Polling App
        </Link>
        <nav>
          <Link to="/create">
            <Button variant="outline">Create Poll</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

