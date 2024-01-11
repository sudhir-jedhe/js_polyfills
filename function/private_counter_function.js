// Design a private counter function which exposes increment and retrive functionalities


function privateCounter(){
    var count = 0;
    return {
        increment: function(val = 1){
            count += val;
        }
        retrieve: function(){
            return count;
        }
    }
}
 
// driver code
const counter = privateCounter();
counter.increment();
counter.increment();
counter.retrieve();             // 2
counter.increment(5);
counter.increment();
counter.retrieve();             // 8