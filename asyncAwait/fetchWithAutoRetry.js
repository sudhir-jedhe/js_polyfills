/**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE THE FUNCTION NAME
async function fetchWithAutoRetry(fetcher, maximumRetryCount) {
    // write your solution below
    try {
      const response = await fetcher();
      return response;
    } catch (error) {
      if (maximumRetryCount === 0) {
        throw new Error(error.message);
      }
  
      return fetchWithAutoRetry(fetcher, maximumRetryCount - 1)
    }
  }

  
  /************************** */


  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE THE FUNCTION NAME
function fetchWithAutoRetry(fetcher, maximumRetryCount) {
  
    // write your solution below
    return fetcher().catch(error=>{
      if (maximumRetryCount === 0) throw error;
      return fetchWithAutoRetry(fetcher, maximumRetryCount-1)
    })
  }
  
  // const fetcher = new Promise((resolve, reject) => {
  //   setTimeout(reject, 10)
  // })
  
  // fetchWithAutoRetry(fetcher, 3)
  //   .then((result) => console.log(result))  // Expected output: { data: 'API Data' }
  //   .catch((error) => console.error(error));  // If retry limit is exceeded

  /********************************* */

  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
function fetchWithAutoRetry(fetcherFunction, maximumRetryCount) {
    function retry() {
      if (maximumRetryCount > 0) {
        maximumRetryCount--;
  
        return fetcherFunction() 
          .then((res) => {
            return res; // If successful, return the result
          })
          .catch((err) => {
            if (maximumRetryCount === 0) {
              return Promise.reject(err); // Return rejected promise on last attempt
            } else {
              console.log("Retrying, attempts left: " + maximumRetryCount);
              return retry(); // Retry on failure
            }
          });
      }else{
        return Promise.reject("Error");
      }
    }
  
    return retry();
  }
  
  // // Create a function that returns a new promise each time
  // const fetcherFunction = () => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       reject("Error");
  //     }, 1000);
  //   });
  // };
  
  // fetchWithAutoRetry(fetcherFunction, 3)
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error)); 

  
  /*************** */


  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO NOT CHANGE THE FUNCTION NAME
function fetchWithAutoRetry(fetcher, maximumRetryCount) {
    // write your solution below
    return new Promise((resolve, reject) => {
      function attempt(count) {
        fetcher()
          .then(value => {
            resolve(value);
          })
          .catch(err => {
            if (count === maximumRetryCount) {
              reject(err);
            } else {
              attempt(count + 1);
            }
          })
      }
      attempt(0);
    })
  }
  