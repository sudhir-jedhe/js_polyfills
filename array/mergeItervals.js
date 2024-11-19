Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].

Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.


const merge = (intervals) => {
    //If empty
    if (!intervals.length) return [];
    
    //Sort the array based on the start time
    intervals.sort(([i, j], [m, n]) => m - i || n - j);
    
    //stack 
    let stack = []
    
    //Iterate the intervals
    while (intervals.length) {
        //Get the start and end
        let [start1, end1] = intervals.pop();
      
        // squeeze adjacent intervals
        while (intervals.length) {
            let [start2, end2] = intervals.pop();
          
            // check if overlapping -> merge
            if (start2 <= end1){ 
              [start1, end1] = [start1, Math.max(end1, end2)];
            }
            else {
                //Push original
                stack.push([start1, end1]);
                //Replace with next one
                [start1, end1] = [start2, end2];
            }
        }
        
        //Push the merged interval
        stack.push([start1, end1]);
    }
  
    return stack;
};


const merge = (intervals) => {
    //Sort the intervals based on the start time
    intervals.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    
    //Iterate the intervals
    for(let i = 0; i < intervals.length-1; i++) {
        //Get the start and end time of each interval
        const [start1, end1] = intervals[i];
        const [start2, end2] = intervals[i+1];
        
        //if there is overlapp then merge the index
        if(start2 <= end1) {
          
            //Get the min of start of interval and max of end.
            const newInterval = [Math.min(start1, start2), Math.max(end1, end2)];
          
            //Add the new interval to the array
            intervals.splice(i, 2, newInterval);
          
            //keep the i at the same index to continue the comparing
            i--;
        }
    }
   
    //Return the merged intervals.
    return intervals;
};