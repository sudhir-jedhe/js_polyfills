import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}. This page is only reachable when authenticated.</p>
    </div>
  );
}
