// Given a string and array of keywords, highlight the words in the string that are part of the array of keywords.

// Example
// const str = "Ultimate JavaScript / FrontEnd Guide";
// const words = ['Front', 'End', 'JavaScript'];

highlight(str, words);

// "Ultimate <strong>JavaScript</strong> / <strong>FrontEnd</strong> Guide"
// Copy
// If two words are overlapping or adjacent, combine them together. As you can see in the above example there are two different words Front and End but they are highlighted together.

// To implement this function we have to handle two different cases.

// Check if any of the words in the string is present in the keywords array then highlight it.
// Else, break each word into two sub-words and check for each sub-word if they are present or not, if any part is present highlight them separately if both the parts are present highlight them together.


function highlight(str, keywords) {
    // unique set of keywords
    const uniqueKeywords = new Set(keywords);
    
    // split the str into words
    let words = str.split(" ");
    
    // traverse each word
    const result = words.map(word => {
      // to track the embedding
      let output = '';
      
      // if the word is found in the keywords set
      // highLight it
      if (uniqueKeywords.has(word)) {
        output = `<strong>${word}</strong>`;
      } 
      // else check if the substring of the word is in the keywords set
      else {
        for (let i = 0; i < word.length; i++) {
          // break the word into two parts
          const prefix = word.slice(0, i + 1);
          const suffix = word.slice(i + 1);
           
          // if both the parts are present in keywords
          // embed them together
          if (uniqueKeywords.has(prefix) && uniqueKeywords.has(suffix)) {
            output = `<strong>${prefix}${suffix}</strong>`;
            break;
          } 
          // else if the only prefix is present
          // highlight it
          else if (uniqueKeywords.has(prefix) && !uniqueKeywords.has(suffix)) {
            output = `<strong>${prefix}</strong>${suffix}`;
          }
          // else if the only suffix is present
          // highlight it
          else if (!uniqueKeywords.has(prefix) && uniqueKeywords.has(suffix)) {
            output = `${prefix}<strong>${suffix}</strong>`;
          }
        }
      }
      
      // if no embedding has happened
      // return the original word
      return output !== '' ? output : word;
    });
    
    // from the string back
    return result.join(" ");
  }


  Input:
const str = "Ultimate JavaScript / FrontEnd Guide";
const words = ['Front', 'End', 'JavaScript'];

console.log(highlight(str, words));

Output:
// "Ultimate <strong>JavaScript</strong> / <strong>FrontEnd</strong> Guide"