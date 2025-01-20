import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createGroup, getGroup, updateGroup, addMember, removeMember } from '../services/groupService';
import { getContacts } from '../services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

const GroupManagement = ({ groupId, onClose }) => {
  const [group, setGroup] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
    fetchContacts();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const fetchedGroup = await getGroup(groupId);
      setGroup(fetchedGroup);
      setName(fetchedGroup.name);
      setDescription(fetchedGroup.description);
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const fetchedContacts = await getContacts();
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleCreateOrUpdateGroup = async (e) => {
    e.preventDefault();
    try {
      if (groupId) {
        const updatedGroup = await updateGroup(groupId, { name, description });
        setGroup(updatedGroup);
      } else {
        const newGroup = await createGroup({ name, description, members: selectedContacts });
        setGroup(newGroup);
      }
      onClose();
    } catch (error) {
      console.error('Error creating/updating group:', error);
    }
  };

  const handleAddMember = async (contactId) => {
    try {
      await addMember(group._id, contactId);
      const updatedGroup = await getGroup(group._id);
      setGroup(updatedGroup);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(group._id, memberId);
      const updatedGroup = await getGroup(group._id);
      setGroup(updatedGroup);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{groupId ? 'Edit Group' : 'Create Group'}</h2>
      <form onSubmit={handleCreateOrUpdateGroup} className="space-y-4">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
          required
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Group Description"
        />
        {!groupId && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Members</h3>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`contact-${contact._id}`}
                    checked={selectedContacts.includes(contact._id)}
                    onChange={() => {
                      setSelectedContacts((prev) =>
                        prev.includes(contact._id)
                          ? prev.filter((id) => id !== contact._id)
                          : [...prev, contact._id]
                      );
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`contact-${contact._id}`}>{contact.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button type="submit">{groupId ? 'Update Group' : 'Create Group'}</Button>
      </form>
      {group && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Group Members</h3>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member.user._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar src={member.user.profilePic} alt={member.user.name} />
                  <span className="ml-2">{member.user.name}</span>
                </div>
                {member.user._id !== user.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.user._id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Add Member</h4>
            <div className="space-y-2">
              {contacts
                .filter((contact) => !group.members.some((member) => member.user._id === contact._id))
                .map((contact) => (
                  <div key={contact._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar src={contact.profilePic} alt={contact.name} />
                      <span className="ml-2">{contact.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddMember(contact._id)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;

