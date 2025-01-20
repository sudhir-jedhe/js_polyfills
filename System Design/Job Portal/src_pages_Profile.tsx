import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Profile {
  name: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  bio: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profiles/me');
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/profiles', profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="company" className="block mb-1">Company</label>
          <input
            type="text"
            id="company"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="location" className="block mb-1">Location</label>
          <input
            type="text"
            id="location"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="skills" className="block mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            id="skills"
            value={profile.skills.join(', ')}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(skill => skill.trim()) })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block mb-1">Bio</label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;

