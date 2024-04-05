const aggregateValues = (id) => {
  // get the element
  const element = document.querySelector(`#${id}`);

  // get all the input elements under it
  // change the type depending on the requirement
  // can take it as a argument
  const inputs = element.querySelectorAll('input[type="text"]');

  // aggregate the input values
  return Array.from(inputs).reduce((prev, current) => {
    // split the name and from an array of keys
    const names = current.name.split(".");

    // store the previous object
    // for traversing the object
    // parent -> child -> grandchild
    let temp = prev;

    // iterate each key in the name
    names.forEach((name, index) => {
      // if the key is not already present,
      // create an empty object
      if (!(name in temp)) {
        temp[name] = {};
      }

      // if the current key is the last one
      // assign the value to it
      if (index == names.length - 1) {
        temp[name] = current.value;
      }

      // reference the next value to current
      temp = temp[name];
    });

    // return the formed object
    return prev;
  }, {});
};


Input:
<form id="parent">
	<input type="text" name="a.c" value="1"/>
	<input type="text" name="a.b.d" value="2"/>
  <input type="text" name="a.b.e" value="3"/>
</form>

console.log(aggregateValues('parent'));

Output:
{
  "a": {
    "c": "1",
    "b": {
      "d": "2",
      "e": "3"
    }
  }
}