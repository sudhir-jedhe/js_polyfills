import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  username: string;
  image_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/feed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update likes count in the UI
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="space-y-8">
      {posts.map(post => (
        <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <img src={`${process.env.REACT_APP_API_URL}${post.image_url}`} alt="Post" className="w-full h-64 object-cover" />
          <div className="p-4">
            <p className="font-bold">{post.username}</p>
            <p>{post.caption}</p>
            <div className="mt-2 flex items-center space-x-2">
              <button onClick={() => handleLike(post.id)} className="text-red-500">❤ {post.likes_count}</button>
              <span>💬 {post.comments_count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

