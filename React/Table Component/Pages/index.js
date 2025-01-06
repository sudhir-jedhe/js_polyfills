import React from 'react';
import Table from '../components/Table';
import { Column } from '../types';

const columns: Column[] = [
  { accessor: 'id', Header: 'ID' },
  { accessor: 'name', Header: 'Name' },
  { accessor: 'age', Header: 'Age' },
  { accessor: 'email', Header: 'Email' },
  { accessor: 'country', Header: 'Country' },
];

const generateData = (count: number) => {
  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'India', 'China'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    email: `person${i + 1}@example.com`,
    country: countries[Math.floor(Math.random() * countries.length)],
  }));
};

const data = generateData(100); // Generate 100 records

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Advanced React Table Example</h1>
        <Table
          columns={columns}
          data={data}
          pageSize={10}
          groupByColumns={['country']}
          isVirtualized={false}
        />
      </div>
    </div>
  );
};

export default Home;

