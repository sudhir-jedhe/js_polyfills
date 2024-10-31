// Frequency Tracker
// Medium
// Topics
// Companies
// Hint
// Design a data structure that keeps track of the values in it and answers some queries regarding their frequencies.

// Implement the FrequencyTracker class.

// FrequencyTracker(): Initializes the FrequencyTracker object with an empty array initially.
// void add(int number): Adds number to the data structure.
// void deleteOne(int number): Deletes one occurrence of number from the data structure. The data structure may not contain number, and in this case nothing is deleted.
// bool hasFrequency(int frequency): Returns true if there is a number in the data structure that occurs frequency number of times, otherwise, it returns false.
 

// Example 1:

// Input
// ["FrequencyTracker", "add", "add", "hasFrequency"]
// [[], [3], [3], [2]]
// Output
// [null, null, null, true]

// Explanation
// FrequencyTracker frequencyTracker = new FrequencyTracker();
// frequencyTracker.add(3); // The data structure now contains [3]
// frequencyTracker.add(3); // The data structure now contains [3, 3]
// frequencyTracker.hasFrequency(2); // Returns true, because 3 occurs twice

// Example 2:

// Input
// ["FrequencyTracker", "add", "deleteOne", "hasFrequency"]
// [[], [1], [1], [1]]
// Output
// [null, null, null, false]

// Explanation
// FrequencyTracker frequencyTracker = new FrequencyTracker();
// frequencyTracker.add(1); // The data structure now contains [1]
// frequencyTracker.deleteOne(1); // The data structure becomes empty []
// frequencyTracker.hasFrequency(1); // Returns false, because the data structure is empty

// Example 3:

// Input
// ["FrequencyTracker", "hasFrequency", "add", "hasFrequency"]
// [[], [2], [3], [1]]
// Output
// [null, false, null, true]

// Explanation
// FrequencyTracker frequencyTracker = new FrequencyTracker();
// frequencyTracker.hasFrequency(2); // Returns false, because the data structure is empty
// frequencyTracker.add(3); // The data structure now contains [3]
// frequencyTracker.hasFrequency(1); // Returns true, because 3 occurs once


class FrequencyTracker {
    constructor() {
        this.numCount = new Map();
        this.freqCount = new Map();
    }
    
    add(number) {
        // Get current count of number
        const currentCount = this.numCount.get(number) || 0;
        
        // Update numCount map
        this.numCount.set(number, currentCount + 1);
        
        // Update freqCount map
        if (currentCount > 0) {
            this.freqCount.set(currentCount, this.freqCount.get(currentCount) - 1);
            if (this.freqCount.get(currentCount) === 0) {
                this.freqCount.delete(currentCount);
            }
        }
        
        const newCount = currentCount + 1;
        if (newCount > 0) {
            this.freqCount.set(newCount, (this.freqCount.get(newCount) || 0) + 1);
        }
    }
    
    deleteOne(number) {
        // Check if number exists
        if (!this.numCount.has(number)) {
            return;
        }
        
        // Get current count of number
        const currentCount = this.numCount.get(number);
        
        // Update numCount map
        this.numCount.set(number, currentCount - 1);
        
        // Update freqCount map
        this.freqCount.set(currentCount, this.freqCount.get(currentCount) - 1);
        if (this.freqCount.get(currentCount) === 0) {
            this.freqCount.delete(currentCount);
        }
        
        const newCount = currentCount - 1;
        if (newCount > 0) {
            this.freqCount.set(newCount, (this.freqCount.get(newCount) || 0) + 1);
        }
    }
    
    hasFrequency(frequency) {
        return this.freqCount.has(frequency);
    }
}



/*************************************** */

class FrequencyTracker {
    constructor() {
      // Use a hash table to store frequencies (number as key, frequency as value)
      this.count = {};
    }
  
    add(number) {
      // Update the count for the number
      this.count[number] = (this.count[number] || 0) + 1;
    }
  
    deleteOne(number) {
      if (number in this.count) {
        // Decrement the count for the number and remove if it reaches 0
        this.count[number]--;
        if (this.count[number] === 0) {
          delete this.count[number];
        }
      }
    }
  
    hasFrequency(frequency) {
      // Check if any number has the specified frequency
      for (const count of Object.values(this.count)) {
        if (count === frequency) {
          return true;
        }
      }
      return false;
    }
  }
  
  // Example usage
  const tracker = new FrequencyTracker();
  tracker.add(3);
  tracker.add(3);
  console.log(tracker.hasFrequency(2)); // Output: true
  tracker.deleteOne(3);
  console.log(tracker.hasFrequency(2)); // Output: false
  