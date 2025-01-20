import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStatusUpdates, createStatus, viewStatus } from '../services/statusService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Image } from 'lucide-react';

const StatusUpdates = () => {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const { user } = useAuth();
  const mediaInputRef = useRef(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const fetchedStatuses = await getStatusUpdates();
      setStatuses(fetchedStatuses);
    } catch (error) {
      console.error('Error fetching status updates:', error);
    }
  };

  const handleCreateStatus = async (e) => {
    e.preventDefault();
    if (newStatus.trim() || mediaFile) {
      const formData = new FormData();
      formData.append('content', newStatus);
      
      if (mediaFile) {
        formData.append('media', mediaFile);
        formData.append('statusType', mediaFile.type.startsWith('image/') ? 'image' : 'video');
      } else {
        formData.append('statusType', 'text');
      }

      try {
        await createStatus(formData);
        setNewStatus('');
        setMediaFile(null);
        fetchStatuses();
      } catch (error) {
        console.error('Error creating status:', error);
      }
    }
  };

  const handleViewStatus = async (statusId) => {
    try {
      await viewStatus(statusId);
      // Update the local state to reflect the viewed status
      setStatuses(prevStatuses =>
        prevStatuses.map(status =>
          status._id === statusId
            ? { ...status, viewers: [...status.viewers, user.id] }
            : status
        )
      );
    } catch (error) {
      console.error('Error viewing status:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Status Updates</h2>
      <form onSubmit={handleCreateStatus} className="mb-4 flex items-center">
        <Input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 mr-2"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => mediaInputRef.current.click()}
        >
          <Image className="h-5 w-5" />
        </Button>
        <input
          type="file"
          ref={mediaInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={(e) => setMediaFile(e.target.files[0])}
        />
        <Button type="submit" variant="primary">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Status
        </Button>
      </form>
      <div className="space-y-4">
        {statuses.map((status) => (
          <div key={status._id} className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <img
                src={status.user.profilePic || '/default-avatar.png'}
                alt={status.user.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <h3 className="font-semibold">{status.user.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(status.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {status.statusType === 'text' ? (
              <p>{status.content}</p>
            ) : status.statusType === 'image' ? (
              <img src={status.mediaUrl || "/placeholder.svg"} alt="Status" className="max-w-full rounded-lg" />
            ) : (
              <video src={status.mediaUrl} controls className="max-w-full rounded-lg" />
            )}
            <Button
              onClick={() => handleViewStatus(status._id)}
              variant="ghost"
              className="mt-2"
            >
              {status.viewers.includes(user.id) ? 'Viewed' : 'View'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusUpdates;

