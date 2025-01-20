import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const UserDetailsDisplay: React.FC = () => {
  const thunkDetails = useSelector((state: RootState) => state.users.selectedUserDetails);
  const sagaDetails = useSelector((state: RootState) => state.usersSaga.selectedUserDetails);
  const thunkLoading = useSelector((state: RootState) => state.users.loading);
  const sagaLoading = useSelector((state: RootState) => state.usersSaga.loading);
  const thunkError = useSelector((state: RootState) => state.users.error);
  const sagaError = useSelector((state: RootState) => state.usersSaga.error);

  const renderUserDetails = (details: typeof thunkDetails, title: string) => {
    if (!details) return null;
    const { user, posts, comments } = details;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="mb-2">Email: {user.email}</p>
        <h4 className="text-lg font-semibold mt-4 mb-2">Posts</h4>
        <ul className="list-disc pl-5 mb-4">
          {posts.slice(0, 3).map(post => (
            <li key={post.id} className="mb-2">
              <h5 className="font-medium">{post.title}</h5>
              <p className="text-sm text-gray-600">{post.body.slice(0, 100)}...</p>
            </li>
          ))}
        </ul>
        <h4 className="text-lg font-semibold mt-4 mb-2">Comments</h4>
        <ul className="list-disc pl-5">
          {comments.slice(0, 5).map(comment => (
            <li key={comment.id} className="mb-2">
              <h5 className="font-medium">{comment.name}</h5>
              <p className="text-sm text-gray-600">{comment.body.slice(0, 50)}...</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {thunkLoading && <div className="text-center">Loading Thunk details...</div>}
      {thunkError && <div className="text-center text-red-500">{thunkError}</div>}
      {renderUserDetails(thunkDetails, "User Details (Thunk)")}

      {sagaLoading && <div className="text-center">Loading Saga details...</div>}
      {sagaError && <div className="text-center text-red-500">{sagaError}</div>}
      {renderUserDetails(sagaDetails, "User Details (Saga)")}
    </div>
  );
};

export default UserDetailsDisplay;

