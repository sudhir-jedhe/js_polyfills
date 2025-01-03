const hashValue = val =>
    crypto.subtle
      .digest('SHA-256', new TextEncoder('utf-8').encode(val))
      .then(h => {
        let hexes = [],
          view = new DataView(h);
        for (let i = 0; i < view.byteLength; i += 4)
          hexes.push(('00000000' + view.getUint32(i).toString(16)).slice(-8));
        return hexes.join('');
      });
  
  hashValue(
    JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } })
  ).then(console.log);
  // '04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393'


// node Js

  import { createHash } from 'crypto';

const hashValue = val =>
  new Promise(resolve =>
    setTimeout(
      () => resolve(createHash('sha256').update(val).digest('hex')),
      0
    )
  );

hashValue(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } })).then(
  console.log
);
// '04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393'