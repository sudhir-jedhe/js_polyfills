const work = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve('doing work'), 3000);
    })
}

const doWork = async () => {
    console.log(await work());
}

console.log('before');
doWork();
console.log('after');
/*  before
    after
    doing work
*/


/******************************** */
const work = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve('doing work'), 3000);
    })
}

console.log('before');

work().then(e => {
    console.log(e);
    console.log('finished');
});

console.log('after');
/**************************************************** */
async function doRequest() {
    let url = 'http://webcode.me';
    let res = await fetch(url);

    if (res.ok) {

        let text = await res.text();

        return text;
    } else {
        return `HTTP error: ${res.status}`;
    }
}

doRequest().then(data => {
    console.log(data);
});

/**************************** */