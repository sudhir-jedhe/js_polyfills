// Caesar Cipher

Input:
text = ABCD , Key = 13
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
13 shift to A is N
13 shift to B is O
13 shift to C is P
13 shift to D is Q

Output:
NOPQ


let ceaserCipher = (str) => {
    //Deciphered reference letters
    let decoded = {
      a: 'n', b: 'o', c: 'p',
      d: 'q', e: 'r', f: 's',
      g: 't', h: 'u', i: 'v',
      j: 'w', k: 'x', l: 'y',
      m: 'z', n: 'a', o: 'b',
      p: 'c', q: 'd', r: 'e',
      s: 'f', t: 'g', u: 'h',
      v: 'i', w: 'j', x: 'k',
      y: 'l', z: 'm'    
    }
    
    //convert the string to lowercase
    str = str.toLowerCase();
    
    //decipher the code
    let decipher = '';
    for(let i = 0 ; i < str.length; i++){
      decipher += decoded[str[i]];
    }
    
    //return the output
    return decipher;
  }



  let caesarCipher => (str, key) {
    return str.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65 + key ) % 26 + 65));
  }


  Input:
console.log(ceaserCipher('attackatonce'));
console.log(ceaserCipher('prashantyadav'));

Output:
"nggnpxngbapr"
"cenfunaglnqni"

  Input:
console.log(ceaserCipher('ATTACKATONCE', 13));
console.log(ceaserCipher('PRASHANTYADAV', 13));

Output:
"NGGNPXNGBAPR"
"CENFUNAGLNQNI"