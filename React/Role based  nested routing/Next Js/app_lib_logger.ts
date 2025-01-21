export function logAuthAttempt(username: string, success: boolean) {
  const timestamp = new Date().toISOString()
  const status = success ? "SUCCESS" : "FAILURE"
  console.log(`[${timestamp}] Authentication attempt: ${status} - Username: ${username}`)
  // In a production environment, you would typically write this to a file or send it to a logging service
}

