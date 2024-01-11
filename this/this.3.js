/ This is a JavaScript quiz from BFE.dev

const obj = {
  prefix: 'BFE',
  list: ['1', '2', '3'],
  log() {
    this.list.forEach(function (item) {
      console.log(this.prefix + item);
    });
  },
};

obj.log();