import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

interface Profile {
  bio: string
  skills: string[]
}

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>({ bio: "", skills: [] })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    // Fetch profile data
    const storedProfile = localStorage.getItem(`profile_${user?.id}`)
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, [user])

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({ ...profile, bio: e.target.value })
  }

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      const updatedProfile = { ...profile, skills: [...profile.skills, newSkill] }
      setProfile(updatedProfile)
      setNewSkill("")
      localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedProfile))
    }
  }

  const handleRemoveSkill = (skill: string) => {
    const updatedProfile = { ...profile, skills: profile.skills.filter((s) => s !== skill) }
    setProfile(updatedProfile)
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedProfile))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(`profile_${user?.id}`, JSON.stringify(profile))
    alert("Profile updated successfully!")
  }

  return (
    <div className="profile">
      <h1>Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" value={profile.bio} onChange={handleBioChange} rows={4} />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills:</label>
          <div className="input-group">
            <input type="text" id="skills" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            <button type="button" onClick={handleAddSkill}>
              Add Skill
            </button>
          </div>
          <ul className="skill-list">
            {profile.skills.map((skill, index) => (
              <li key={index}>
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn btn-submit">
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default Profile

