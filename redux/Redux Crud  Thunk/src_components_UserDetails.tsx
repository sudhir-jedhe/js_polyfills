import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const UserDetails: React.FC = () => {
  const { selectedUserDetails, loading, error } = useSelector((state: RootState) => state.users);

  if (loading) {
    return <div className="text-center">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!selectedUserDetails) {
    return <div className="text-center">No user selected</div>;
  }

  const { user, posts, comments } = selectedUserDetails;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
      <p className="mb-2">Email: {user.email}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Posts</h3>
      <ul className="list-disc pl-5 mb-4">
        {posts.slice(0, 3).map(post => (
          <li key={post.id} className="mb-2">
            <h4 className="font-medium">{post.title}</h4>
            <p className="text-sm text-gray-600">{post.body.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mt-4 mb-2">Comments</h3>
      <ul className="list-disc pl-5">
        {comments.slice(0, 5).map(comment => (
          <li key={comment.id} className="mb-2">
            <h4 className="font-medium">{comment.name}</h4>
            <p className="text-sm text-gray-600">{comment.body.slice(0, 50)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;

