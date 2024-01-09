/*************************** Array For Fill method ***************************/

Array.prototype.customFill = function (filledValue, start = 0, end = this.length) {
  for (let i = start; i < end; i++) {
    this[i] = filledValue;
  }
  return this;
};
