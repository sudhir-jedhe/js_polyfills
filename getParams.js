const getParams = function (url) {
    //Create a dummy link
      let link = document.createElement('a');
    link.href = url;
    
    //Get the query string
    let query = link.search.substring(1);
    
    //Split the params
      let parameters = query.split('&');
    
    //Object to store the key/value pair
    const vars = {};
    
    //Get the key/value pair
    for (let i = 0; i < parameters.length; i++) {
      let pair = parameters[i].split('=');
      vars[pair[0]] = decodeURIComponent(pair[1]);
    }
    
    return vars;
  };



  let url = 'https://learnersbucket.com?datastructure=linked%10list&algorithm=array';
console.log(getParams(url));

Output:
Object {
  algorithm: "array",
  datastructure: "linkedlist"
}