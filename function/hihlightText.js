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