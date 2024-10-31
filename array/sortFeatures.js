function sortFeatures(features, responses) {
    const counts = new Array(features.length).fill(0);

    for (let response of responses) {
        const words = response.toLowerCase().split(' ');
        const seen = new Set();
        
        for (let word of words) {
            for (let i = 0; i < features.length; i++) {
                if (!seen.has(i) && word.includes(features[i])) {
                    counts[i]++;
                    seen.add(i);
                }
            }
        }
    }

    const sortedFeatures = features.slice(); // Create a copy of features array
    sortedFeatures.sort((a, b) => counts[features.indexOf(b)] - counts[features.indexOf(a)]);
    
    return sortedFeatures;
}

// Example usage:
const features = ["battery", "screen", "camera", "resolution", "software"];
const responses = [
    "Best in class battery life and performance",
    "Excellent screen and resolution",
    "Camera could be better, software needs improvement",
    "Battery life is decent, screen is great",
    "Great camera quality, software is smooth"
];

console.log(sortFeatures(features, responses));



/******************************************* */

function sortFeaturesByPopularity(features, responses) {
    const featureCounts = {};
  
    // Count occurrences of each feature in all responses
    for (const response of responses) {
      const words = response.split(' '); // Split response into individual words
      const uniqueWords = new Set(words); // Remove duplicates using Set
  
      for (const word of uniqueWords) {
        if (word in features) { // Check if the word is a valid feature
          featureCounts[word] = (featureCounts[word] || 0) + 1; // Increment count or initialize to 1
        }
      }
    }
  
    // Sort features based on count (descending) and original index (ascending)
    return features.sort((feature1, feature2) => {
      const count1 = featureCounts[feature1] || 0;
      const count2 = featureCounts[feature2] || 0;
  
      // Sort by descending count first
      if (count1 !== count2) {
        return count2 - count1;
      }
  
      // If counts are equal, sort by original index (ascending)
      return features.indexOf(feature1) - features.indexOf(feature2);
    });
  }
  
  // Examples
  const features = ["cooler", "lock", "touch"];
  const responses = [
    "i like cooler cooler",
    "lock touch cool",
    "locker like touch"
  ];
  
  console.log(sortFeaturesByPopularity(features, responses)); // Output: ["touch", "cooler", "lock"]
  