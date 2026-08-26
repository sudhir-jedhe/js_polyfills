import bcrypt from "bcryptjs"
import { generateSecret, verifyTOTP } from "./twoFactor"

interface User {
  id: string
  username: string
  email: string
  password: string
  twoFactorSecret?: string
  twoFactorEnabled: boolean
  failedLoginAttempts: number
  lockedUntil?: Date
  permissions: {
    users: { view: boolean; edit: boolean; create: boolean; delete: boolean }
    content: { view: boolean; edit: boolean; create: boolean; delete: boolean }
    reports: { view: boolean; edit: boolean; create: boolean; delete: boolean }
    settings: { view: boolean; edit: boolean; create: boolean; delete: boolean }
  }
}

const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9ovi/9DZmbClX.", // hashed 'admin123'
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    permissions: {
      users: { view: true, edit: true, create: true, delete: true },
      content: { view: true, edit: true, create: true, delete: true },
      reports: { view: true, edit: true, create: true, delete: true },
      settings: { view: true, edit: true, create: true, delete: true },
    },
  },
  {
    id: "2",
    username: "editor",
    email: "editor@example.com",
    password: "$2a$10$6KqJlUoWzUJX3zsYRNUxN.jlEpbdTbhVwmHMWXl4tKfbZIQZ5kNwi", // hashed 'editor123'
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    permissions: {
      users: { view: false, edit: false, create: false, delete: false },
      content: { view: true, edit: true, create: true, delete: false },
      reports: { view: true, edit: false, create: true, delete: false },
      settings: { view: false, edit: false, create: false, delete: false },
    },
  },
  {
    id: "3",
    username: "viewer",
    email: "viewer@example.com",
    password: "$2a$10$9OLNRxdGWEwMhpBHGlQyGO1.RCpkHbpWpwR8bvqjCuDGvqoIJYGd2", // hashed 'viewer123'
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    permissions: {
      users: { view: false, edit: false, create: false, delete: false },
      content: { view: true, edit: false, create: false, delete: false },
      reports: { view: true, edit: false, create: false, delete: false },
      settings: { view: false, edit: false, create: false, delete: false },
    },
  },
]

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function getUserByCredentials(username: string, password: string): Promise<User | null> {
  const user = users.find((u) => u.username === username)
  if (!user) return null

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error("Account is locked. Please try again later.")
  }

  if (await bcrypt.compare(password, user.password)) {
    user.failedLoginAttempts = 0
    return user
  } else {
    user.failedLoginAttempts++
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION)
    }
    return null
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string,
  permissions: User["permissions"],
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    email,
    password: hashedPassword,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    permissions,
  }
  users.push(newUser)
  return newUser
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((u) => u.email === email) || null
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.password = await bcrypt.hash(newPassword, 10)
    user.failedLoginAttempts = 0
    user.lockedUntil = undefined
  }
}

export async function enableTwoFactor(username: string): Promise<string | null> {
  const user = users.find((u) => u.username === username)
  if (user) {
    const secret = generateSecret()
    user.twoFactorSecret = secret
    user.twoFactorEnabled = true
    return secret
  }
  return null
}

export async function disableTwoFactor(username: string): Promise<boolean> {
  const user = users.find((u) => u.username === username)
  if (user) {
    user.twoFactorSecret = undefined
    user.twoFactorEnabled = false
    return true
  }
  return false
}

export async function verifyTwoFactor(username: string, token: string): Promise<boolean> {
  const user = users.find((u) => u.username === username)
  if (user && user.twoFactorEnabled && user.twoFactorSecret) {
    return verifyTOTP(token, user.twoFactorSecret)
  }
  return false
}

