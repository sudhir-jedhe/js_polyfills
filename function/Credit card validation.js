const validateCardNumber = (number) => {
  //Check if the number contains only numeric value
  //and is of between 13 to 19 digits
  const regex = new RegExp("^[0-9]{13,19}$");
  if (!regex.test(number)) {
    return false;
  }

  return luhnCheck(number);
};

const luhnCheck = (val) => {
  let checksum = 0; // running checksum total
  let j = 1; // takes value of 1 or 2

  // Process each digit one by one starting from the last
  for (let i = val.length - 1; i >= 0; i--) {
    let calc = 0;
    // Extract the next digit and multiply by 1 or 2 on alternative digits.
    calc = Number(val.charAt(i)) * j;

    // If the result is in two digits add 1 to the checksum total
    if (calc > 9) {
      checksum = checksum + 1;
      calc = calc - 10;
    }

    // Add the units element to the checksum total
    checksum = checksum + calc;

    // Switch the value of j
    if (j == 1) {
      j = 2;
    } else {
      j = 1;
    }
  }

  //Check if it is divisible by 10 or not.
  return checksum % 10 == 0;
};

Input: console.log(validateCardNumber("0123765443210190"));

Output: true;

const checkCreditCard = (cardnumber) => {
  //Error messages
  const ccErrors = [];
  ccErrors[0] = "Unknown card type";
  ccErrors[1] = "No card number provided";
  ccErrors[2] = "Credit card number is in invalid format";
  ccErrors[3] = "Credit card number is invalid";
  ccErrors[4] = "Credit card number has an inappropriate number of digits";
  ccErrors[5] =
    "Warning! This credit card number is associated with a scam attempt";

  //Response format
  const response = (success, message = null, type = null) => ({
    message,
    success,
    type,
  });

  // Define the cards we support. You may add additional card types as follows.

  //  Name:         As in the selection box of the form - must be same as user's
  //  Length:       List of possible valid lengths of the card number for the card
  //  prefixes:     List of possible prefixes for the card
  //  checkdigit:   Boolean to say whether there is a check digit
  const cards = [];
  cards[0] = { name: "Visa", length: "13,16", prefixes: "4", checkdigit: true };
  cards[1] = {
    name: "MasterCard",
    length: "16",
    prefixes: "51,52,53,54,55",
    checkdigit: true,
  };
  cards[2] = {
    name: "DinersClub",
    length: "14,16",
    prefixes: "36,38,54,55",
    checkdigit: true,
  };
  cards[3] = {
    name: "CarteBlanche",
    length: "14",
    prefixes: "300,301,302,303,304,305",
    checkdigit: true,
  };
  cards[4] = {
    name: "AmEx",
    length: "15",
    prefixes: "34,37",
    checkdigit: true,
  };
  cards[5] = {
    name: "Discover",
    length: "16",
    prefixes: "6011,622,64,65",
    checkdigit: true,
  };
  cards[6] = { name: "JCB", length: "16", prefixes: "35", checkdigit: true };
  cards[7] = {
    name: "enRoute",
    length: "15",
    prefixes: "2014,2149",
    checkdigit: true,
  };
  cards[8] = {
    name: "Solo",
    length: "16,18,19",
    prefixes: "6334,6767",
    checkdigit: true,
  };
  cards[9] = {
    name: "Switch",
    length: "16,18,19",
    prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
    checkdigit: true,
  };
  cards[10] = {
    name: "Maestro",
    length: "12,13,14,15,16,18,19",
    prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
    checkdigit: true,
  };
  cards[11] = {
    name: "VisaElectron",
    length: "16",
    prefixes: "4026,417500,4508,4844,4913,4917",
    checkdigit: true,
  };
  cards[12] = {
    name: "LaserCard",
    length: "16,17,18,19",
    prefixes: "6304,6706,6771,6709",
    checkdigit: true,
  };

  // Ensure that the user has provided a credit card number
  if (cardnumber.length == 0) {
    return response(false, ccErrors[1]);
  }

  // Now remove any spaces from the credit card number
  // Update this if there are any other special characters like -
  cardnumber = cardnumber.replace(/\s/g, "");

  // Validate the format of the credit card
  // luhn's algorithm
  if (!validateCardNumber(cardnumber)) {
    return response(false, ccErrors[2]);
  }

  // Check it's not a spam number
  if (cardnumber == "5490997771092064") {
    return response(false, ccErrors[5]);
  }

  // The following are the card-specific checks we undertake.
  let lengthValid = false;
  let prefixValid = false;
  let cardCompany = "";

  // Check if card belongs to any organization
  for (let i = 0; i < cards.length; i++) {
    const prefix = cards[i].prefixes.split(",");

    for (let j = 0; j < prefix.length; j++) {
      const exp = new RegExp("^" + prefix[j]);
      if (exp.test(cardnumber)) {
        prefixValid = true;
      }
    }

    if (prefixValid) {
      const lengths = cards[i].length.split(",");
      // Now see if its of valid length;
      for (let j = 0; j < lengths.length; j++) {
        if (cardnumber.length == lengths[j]) {
          lengthValid = true;
        }
      }
    }

    if (lengthValid && prefixValid) {
      cardCompany = cards[i].name;
      return response(true, null, cardCompany);
    }
  }

  // If it isn't a valid prefix there's no point at looking at the length
  if (!prefixValid) {
    return response(false, ccErrors[3]);
  }

  // See if all is OK by seeing if the length was valid
  if (!lengthValid) {
    return response(false, ccErrors[4]);
  }

  // The credit card is in the required format.
  return response(true, null, cardCompany);
};



Input:
console.log(checkCreditCard("4111 1111 1111 1111"));
console.log(checkCreditCard("3400 0000 0000 009"));

Output:
/*
Object {
  message: null,
  success: true,
  type: "Visa"
}

Object {
  message: null,
  success: true,
  type: "AmEx"
}
*/



// n this digital era doing payment on a click has become a child’s play.

// Credit or Debit card payments are as common as Signup forms. As an engineer it is important to validate each card for smooth payment.

// Even before sending the credit card details to the server for transaction we should check if it is valid. We will use a simple algorithm in javascript which will just validate the card to ensure that it is in a correct format.

// Identifying the format
// Like any other magnetic strip card, credit or debit card numbers has an identifier format defined under ISO/IEC 7812

// Identifiers are usually 13 – 19 digits long and are used for any number of purposes.

// The identifier consists of three parts.

// IIN (Issuer identification number):- A six digit identifier number of the institution that issued this number.(For banks it usually starts with 4 or 5) that is why most of the credit cards begins with it.
// Account Number:- An identifier between 6 to 12 numbers long.
// Check Digit:- A single digit to validate the sum of the identifier.
// Validating credit card in javascript with Luhn’s algorithm.
// Hans peter luhn, a scientist at IBM developed this algorithm to protect against unintentional mistakes in numeric identifiers.

// It is a very simple algorithm.

// Start from the last digit of the number.
// Get a double of every alternate digit, if the double value is greater than 9 then take its remainder and add it to 1.
// Create a sum of this doubled values, remainders and each digit then divide it by 10.
// If it is divisible then it is valid.
// Following is the implementation of luhn’s algorithm for validation of credit card in javascript.


// Remember this algorithm only validates the format. You will still need to check on the server if credit card with this number exists or not.

// Determining the Credit Card Issuer.
// Each company which issues the card has a unique identification through which we can determine that this credit card belongs to this particular organisation.

// For example this is the specific format of each organization.

// Company	Format
// American Express	3493 7003 8656 069
// Carte Blanche	3000 0000 0000 04
// Discover	6011 0000 0000 0004
// Diners Club	3852 0000 0232 37
// enRoute	2014 0000 0000 009
// JCB	3530 111333300000
// MasterCard	5500 0000 0000 0004
// Solo	6334 0000 0000 0004
// Switch	4903 0100 0000 0009
// Visa	4111 1111 1111 1111
// Laser	6304 1000 0000 0008
// Now by understanding this format we will create a function for validation of credit card in javascript and determine its type.


const checkCreditCard = cardnumber => {
  
  //Error messages
  const ccErrors = [];
  ccErrors [0] = "Unknown card type";
  ccErrors [1] = "No card number provided";
  ccErrors [2] = "Credit card number is in invalid format";
  ccErrors [3] = "Credit card number is invalid";
  ccErrors [4] = "Credit card number has an inappropriate number of digits";
  ccErrors [5] = "Warning! This credit card number is associated with a scam attempt";
  
  //Response format
  const response = (success, message = null, type = null) => ({
    message,
    success,
    type
  });
     
  // Define the cards we support. You may add additional card types as follows.
  
  //  Name:         As in the selection box of the form - must be same as user's
  //  Length:       List of possible valid lengths of the card number for the card
  //  prefixes:     List of possible prefixes for the card
  //  checkdigit:   Boolean to say whether there is a check digit
  const cards = [];
  cards [0] = {name: "Visa", 
               length: "13,16", 
               prefixes: "4",
               checkdigit: true};
  cards [1] = {name: "MasterCard", 
               length: "16", 
               prefixes: "51,52,53,54,55",
               checkdigit: true};
  cards [2] = {name: "DinersClub", 
               length: "14,16", 
               prefixes: "36,38,54,55",
               checkdigit: true};
  cards [3] = {name: "CarteBlanche", 
               length: "14", 
               prefixes: "300,301,302,303,304,305",
               checkdigit: true};
  cards [4] = {name: "AmEx", 
               length: "15", 
               prefixes: "34,37",
               checkdigit: true};
  cards [5] = {name: "Discover", 
               length: "16", 
               prefixes: "6011,622,64,65",
               checkdigit: true};
  cards [6] = {name: "JCB", 
               length: "16", 
               prefixes: "35",
               checkdigit: true};
  cards [7] = {name: "enRoute", 
               length: "15", 
               prefixes: "2014,2149",
               checkdigit: true};
  cards [8] = {name: "Solo", 
               length: "16,18,19", 
               prefixes: "6334,6767",
               checkdigit: true};
  cards [9] = {name: "Switch", 
               length: "16,18,19", 
               prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
               checkdigit: true};
  cards [10] = {name: "Maestro", 
               length: "12,13,14,15,16,18,19", 
               prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
               checkdigit: true};
  cards [11] = {name: "VisaElectron", 
               length: "16", 
               prefixes: "4026,417500,4508,4844,4913,4917",
               checkdigit: true};
  cards [12] = {name: "LaserCard", 
               length: "16,17,18,19", 
               prefixes: "6304,6706,6771,6709",
               checkdigit: true};
   
  // Ensure that the user has provided a credit card number
  if (cardnumber.length == 0)  {
     return response(false, ccErrors[1]);
  }
    
  // Now remove any spaces from the credit card number
  // Update this if there are any other special characters like -
  cardnumber = cardnumber.replace (/\s/g, "");
  
  // Validate the format of the credit card
  // luhn's algorithm
  if(!validateCardNumber(cardnumber)){
    return response(false, ccErrors[2]);
  }
 
  // Check it's not a spam number
  if (cardnumber == '5490997771092064') { 
    return response(false, ccErrors[5]);
  }

  // The following are the card-specific checks we undertake.
  let lengthValid = false;
  let prefixValid = false; 
  let cardCompany = "";
  
  // Check if card belongs to any organization
  for(let i = 0; i < cards.length; i++){
    const prefix = cards[i].prefixes.split(",");
    
    for (let j = 0; j < prefix.length; j++) {
      const exp = new RegExp ("^" + prefix[j]);
      if (exp.test (cardnumber)) {
        prefixValid = true;
      }
    }
    
    if(prefixValid){
      const lengths = cards[i].length.split(",");
      // Now see if its of valid length;
      for (let j=0; j < lengths.length; j++) {
        if (cardnumber.length == lengths[j]) {
          lengthValid = true;
        }
      }
    }
    
    if(lengthValid && prefixValid){
      cardCompany = cards[i].name;
      return response(true, null, cardCompany);
    }  
  }
  
  // If it isn't a valid prefix there's no point at looking at the length
  if (!prefixValid) {
     return response(false, ccErrors[3]);
  }
  
  // See if all is OK by seeing if the length was valid
  if (!lengthValid) {
     return response(false, ccErrors[4]);
  };   
  
  // The credit card is in the required format.
  return response(true, null, cardCompany);
}



Input:
console.log(checkCreditCard("4111 1111 1111 1111"));
console.log(checkCreditCard("3400 0000 0000 009"));

Output:
/*
Object {
  message: null,
  success: true,
  type: "Visa"
}

Object {
  message: null,
  success: true,
  type: "AmEx"
}
*/