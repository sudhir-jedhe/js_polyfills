const speakeasy = require("speakeasy")
const qrcode = require("qrcode")
const config = require("config")

// Generate a secret key for two-factor authentication
exports.generateSecret = (username) => {
  return speakeasy.generateSecret({
    name: `${config.get("twoFactor.issuer")}:${username}`,
    issuer: config.get("twoFactor.issuer"),
  })
}

// Generate a QR code for the two-factor authentication secret
exports.generateQRCode = async (secret) => {
  try {
    const url = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: secret.name,
      issuer: config.get("twoFactor.issuer"),
      encoding: "ascii",
    })
    return await qrcode.toDataURL(url)
  } catch (error) {
    throw new Error("Error generating QR code")
  }
}

// Verify the two-factor authentication token
exports.verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "ascii",
    token: token,
  })
}

module.exports = exports

