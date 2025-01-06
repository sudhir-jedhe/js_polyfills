import "./ProfileCard.css";
import ProfileCard from "./ProfileCard";
import React from "react";
import React from "react";

const ProfileCard = ({ user, onFollow }) => {
    return (
        <div className="profile-card">
            <img src={user.profilePicture} alt={`${user.name}'s profile`} className="profile-picture" />
            <h2 className="user-name">{user.name}</h2>
            <p className="user-bio">{user.bio}</p>
            <button className="follow-button" onClick={onFollow}>
                Follow
            </button>
        </div>
    );
};

export default ProfileCard;


.profile-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    max-width: 300px;
    margin: 20px auto;
}

.profile-picture {
    width: 100%;
    border-radius: 50%;
    height: auto;
    max-width: 150px;
}

.user-name {
    margin: 15px 0 10px;
    font-size: 1.5em;
    color: #333;
}

.user-bio {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 15px;
}

.follow-button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.follow-button:hover {
    background-color: #0056b3;
}



const App = () => {
    const user = {
        name: 'Jane Doe',
        bio: 'Web Developer | Tech Enthusiast | Coffee Lover',
        profilePicture: 'https://via.placeholder.com/150', // Replace with actual image URL
    };

    const handleFollow = () => {
        alert(`You are now following ${user.name}`);
    };

    return (
        <div>
            <h1>User Profiles</h1>
            <ProfileCard user={user} onFollow={handleFollow} />
        </div>
    );
};

export default App;
