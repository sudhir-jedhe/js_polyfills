class CustomTokenizer {
  constructor(string, delimiters) {
    this.string = string;
    this.delimiters = delimiters;
    this.position = 0;
  }

  nextToken() {
    while (this.position < this.string.length) {
      const currentChar = this.string[this.position];
      if (this.delimiters.includes(currentChar)) {
        this.position++;
        continue;
      }

      const tokenStart = this.position;
      while (
        this.position < this.string.length &&
        !this.delimiters.includes(this.string[this.position])
      ) {
        this.position++;
      }

      const token = this.string.substring(tokenStart, this.position);
      return token;
    }

    return null;
  }
}

const string = "This is an example sentence!";
const delimiters = [" ", ","];

const tokenizer = new CustomTokenizer(string, delimiters);

while (true) {
  const token = tokenizer.nextToken();
  if (token === null) {
    break;
  }

  console.log(token);
}

// This
// is
// an
// example
// sentence!

const str = "this is some string";
String.prototype.customSplit = (sep = "") => {
  const res = [];
  let temp = "";
  for (let i = 0; i < str.length; i++) {
    const el = str[i];
    if (el === sep || (sep === "" && temp)) {
      res.push(temp);
      temp = "";
    }
    if (el !== sep) {
      temp += el;
    }
  }
  if (temp) {
    res.push(temp);
    temp = "";
  }
  return res;
};
console.log(str.customSplit(" "));
