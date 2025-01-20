import React, { useState, useEffect } from 'react';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';
import StatusUpdates from '../components/StatusUpdates';
import GroupManagement from '../components/GroupManagement';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Video, Users, Plus, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAccounts, switchAccount } from '../services/userService';
import { getGroups } from '../services/groupService';
import { getStarredMessages } from '../services/messageService';

const Dashboard = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [starredMessages, setStarredMessages] = useState([]);
  const { user, setUser } = useAuth();

  useEffect(() => {
    fetchAccounts();
    fetchGroups();
    fetchStarredMessages();
  }, []);

  const fetchAccounts = async () => {
    try {
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchStarredMessages = async () => {
    try {
      const fetchedStarredMessages = await getStarredMessages();
      setStarredMessages(fetchedStarredMessages);
    } catch (error) {
      console.error('Error fetching starred messages:', error);
    }
  };

  const handleSwitchAccount = async (accountId) => {
    try {
      const newUser = await switchAccount(accountId);
      setUser(newUser);
    } catch (error) {
      console.error('Error switching account:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <select
            value={user.id}
            onChange={(e) => handleSwitchAccount(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <ContactList onSelectContact={setSelectedContact} />
        <div className="mt-auto p-4 border-t">
          <Button
            onClick={() => setShowGroupManagement(true)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
      </div>
      <div className="w-3/4 bg-white shadow-md flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat
            </Button>
            <Button
              variant={activeTab === 'status' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('status')}
            >
              <Users className="h-5 w-5 mr-2" />
              Status
            </Button>
            <Button
              variant={activeTab === 'starred' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('starred')}
            >
              <Star className="h-5 w-5 mr-2" />
              Starred
            </Button>
          </div>
          {selectedContact && (
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chat' && selectedContact && (
            <Chat
              receiverId={selectedContact._id}
              receiverModel={selectedContact.type === 'group' ? 'Group' : 'User'}
            />
          )}
          {activeTab === 'status' && <StatusUpdates />}
          {activeTab === 'starred' && (
            <div className="p-4 space-y-4">
              {starredMessages.map((message) => (
                <div key={message._id} className="border p-4 rounded-lg">
                  <p>{message.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          {!selectedContact && activeTab === 'chat' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a contact or group to start chatting
            </div>
          )}
        </div>
      </div>
      {showGroupManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <GroupManagement onClose={() => setShowGroupManagement(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

