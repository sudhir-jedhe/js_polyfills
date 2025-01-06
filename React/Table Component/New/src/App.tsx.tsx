import React from 'react';
import AdvancedTable from './components/AdvancedTable';
import { Column } from './types';
import './styles/main.scss';

const columns: Column[] = [
  { accessor: 'id', Header: 'ID', width: 50 },
  { accessor: 'name', Header: 'Name', width: 200 },
  { accessor: 'email', Header: 'Email', width: 250 },
  { accessor: 'age', Header: 'Age', width: 80 },
  { accessor: 'city', Header: 'City', width: 150 },
];

const generateData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Person ${index + 1}`,
    email: `person${index + 1}@example.com`,
    age: Math.floor(Math.random() * 50) + 20,
    city: ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 5)],
  }));
};

const App: React.FC = () => {
  const data = generateData(1000);

  return (
    <div className="app">
      <h1>Advanced React Table</h1>
      <AdvancedTable columns={columns} data={data} />
    </div>
  );
};

export default App;

