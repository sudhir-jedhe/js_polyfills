Javascript try catch
Posted on July 20, 2019 | by Prashant Yadav

Posted in Javascript

Learn how to handle error in javascript with try, catch and finally.

No matter how good you have programmed your application there is always a chance that something may result in error which can break your application. You can minimize this with use of try & catch in javascript.

Syntax
try{
  //code to be executed which may result in error
}catch(error){
  //code to handle error
}finally{
  //code to be executed regardless of try/catch result
}
Copy
try
In try statement you can execute block of codes that can result in error.

catch(err)
In catch statement you can handle the error that is thrown while executing the code inside try. It is not necessary to declare catch block but it is a good practice to do so.

err
Required if catch is used to know exactly what error is thrown.

finally
To run block of code irrespective of what happens in try and catch. It is not necessary to declare this block you can use it as per need.

Example
 try{
   if((3 + 2) !== 4){
      throw 'Not equal to 4';
   }else{
      console.log('2 + 2 is 4');
   }
}catch(err){
  console.log('There is new error ' + err);
}

//"There is new error Not equal to 4"
Copy
Using finally
try{
   if((2 + 2) !== 4){
     throw 'Not equal to 4';
   }else{
     console.log('2 + 2 is 4');
   }
}catch(err){
   console.log('There is new error ' + err);
}finally{
   console.log('I don't really care whether 2 + 2 is 4 or not');
}

//"2 + 2 is 4"
//"I dont really care whether 2 + 2 is 4 or not"
Copy
catch & finally both are optional and can be avoided.

try with finally
try{
  if((2 + 2) === 4){
    console.log('I was right');
  }
}finally{
   console.log('I am finally free');
}

//"I was right"
//"I am finally free"
Copy
Javascript does not allow multiple catch statements, however you can use logical conditioning like if else or switch case to handle this type of situations.

try{
   if((2 + 2) !== 4){
      throw new Error('It is not equal to 4');
   }else{
      return true;
   }
}catch(err){
  if(err instanceOf TypeError){
    console.log(`There is new TypeError ${err}`);
  }else if(err instanceOf RangeError){
    console.log(`There is new RangeError ${err}`);
  }else{
    console.log(`There is new error ${err}`);
  }
}
Copy
You can also use nested try & catch if you want.

Handling error with single catch.
try{
  try{
    throw 'I was inside the nested try at level 2';
  }finally{
    console.log('I will execute no matter what');
  }
}catch(err){
  console.log(`There is a error caught at level 1:-  ${err}`);
}

//"I will execute no matter what"
//"There is a error caught at level 1:-  I was inside the nested try at level 2"
Copy
Parent catch will handle all the error which are thrown by it’s children try and are not handled at their level.

Handling error with nested catch.
try{
  try{
    throw 'I was inside the nested try at level 2';
  }catch(err){
    console.log(`There is a error caught at level 2:-  ${err}`);  
  }finally{
    console.log('I will execute no matter what');
  }
}catch(err){
  console.log(`There is a error caught at level 1:-  ${err}`);
}

//"There is a error caught at level 2:-  I was inside the nested try at level 2"
//"I will execute no matter what"
Copy
Error was handled by the nested catch only.

Re throwing the error with nested catch.
try{
  try{
    throw 'I was inside the nested try at level 2';
  }catch(err){
    console.log(`There is a error caught at level 2:-  ${err}`);
    throw 'I was inside the nested catch at level 2';  
  }finally{
    console.log('I will execute no matter what');
  }
}catch(err){
  console.log(`There is a error caught at level 1:-  ${err}`);
}

//"There is a error caught at level 2:-  I was inside the nested try at level 2"
//"I will execute no matter what"
//"There is a error caught at level 1:-  I was inside the nested catch at level 2"
Copy
Checkout the sequence of execution here.

First the code inside the nested try at level 2 is executed.
Then error is handled by the level 2 catch and it re – throws the error.
Now the code inside the Finally is executed.
At last the parent catch statement handles the error thrown inside the level 2 catch.