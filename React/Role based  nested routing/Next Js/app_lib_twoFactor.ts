import { authenticator } from "otplib"
import QRCode from "qrcode"

export function generateSecret(): string {
  return authenticator.generateSecret()
}

export function generateTOTP(secret: string): string {
  return authenticator.generate(secret)
}

export function verifyTOTP(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret })
}

export async function generateQRCode(secret: string, username: string): Promise<string> {
  const otpauth = authenticator.keyuri(username, "YourAppName", secret)
  return QRCode.toDataURL(otpauth)
}

