let words = ['pen', 'pencil', 'falcon', 'rock', 'sky', 'earth'];

for (let i=0; i<words.length; i++) {

    console.log(words[i]);
}


const words = ["pen", "pencil", "rock", "sky", "earth"];

words.forEach(e => console.log(e));

for (let word of words) {

    console.log(word);
}

for (let idx in words) {

    console.log(words[idx]);
}

const len = words.length;

for (let i = 0; i < len; i++) {

    console.log(words[i]);
}

const i = 0;

while (i < len) {

    console.log(words[i]);
    i++;
}