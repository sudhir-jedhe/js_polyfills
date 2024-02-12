function parsePhoneNumber(phoneNumberString) {
  // Remove non-numeric characters
  const numericString = phoneNumberString.replace(/\D/g, "");

  // Check if the numeric string has a valid length
  if (numericString.length < 7 || numericString.length > 15) {
    throw new Error("Invalid phone number");
  }

  // Extract country code, area code, and local number based on length
  let countryCode, areaCode, localNumber;
  if (numericString.length >= 11) {
    countryCode = numericString.substring(0, numericString.length - 10);
    areaCode = numericString.substring(
      numericString.length - 10,
      numericString.length - 7
    );
    localNumber = numericString.substring(numericString.length - 7);
  } else if (numericString.length >= 10) {
    areaCode = numericString.substring(0, numericString.length - 7);
    localNumber = numericString.substring(numericString.length - 7);
  } else {
    localNumber = numericString;
  }

  // Format the parsed phone number
  let formattedPhoneNumber = "";
  if (countryCode) {
    formattedPhoneNumber += `+${countryCode} `;
  }
  if (areaCode) {
    formattedPhoneNumber += `(${areaCode}) `;
  }
  formattedPhoneNumber += localNumber.replace(/(\d{3})(\d{4})/, "$1-$2");

  return formattedPhoneNumber;
}

try {
  const phoneNumber = parsePhoneNumber("+1 (555) 555-5555");
  console.log("Parsed phone number:", phoneNumber);
} catch (error) {
  console.error("Error:", error.message);
}
