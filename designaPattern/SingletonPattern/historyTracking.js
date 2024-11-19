// Design a concurrent history tracking system where an entity and its different services can be registered and changes being made to them can be tracked.

// Example
// const historyTracking = HistoryTracking();
// historyTracking.registerEntity("document");
// historyTracking.registerService("document", 'JavaScript Ultimate Guide');
// historyTracking.track("document", 'JavaScript Ultimate Guide', "Problem 1");
// historyTracking.track("document", 'JavaScript Ultimate Guide', "Problem 1, Problem 2");
// historyTracking.track("document", 'JavaScript Ultimate Guide', "Problem 3");
// console.log(historyTracking.getHistory("document", 'JavaScript Ultimate Guide'));

// // ["Problem 1","Problem 1, Problem 2","Problem 3"]
// Copy
// This tracking system works similarly to Google drive tracking, where we can have an entity like Google Docs and multiple services (docs) inside that and each service will have its own historical record.

// To implement this system.

// We will use a map to store the unique entities. Each entity can have multiple services and its history stored as an object and this object will be stored as a value next to the entity in the map.

// Whenever a new history entry is requested, we will compare it with the last history, if data is changed, push it into the history.

// We will be using the singleton design pattern to make sure that one instance is used for tracking.

class HistoryTrackingHelper {
    constructor() {
      // to track unique entries
      this.entities = new Map();
    }
    
    // register a new entity
    registerEntity(entity) {
      this.entities.set(entity, {});
    };
    
    // register a new service to the entity
    registerService(entity, service) {
      const existingServices = this.entities.get(entity);
      
      // if the entity is not present
      // create a new entity with the service
      if(!existingServices){
        this.entities.set(entity, {[service]: []});
      }
      // add the service to the existing entity
      else{
        const merged = {...existingServices, [service]: []};
        this.entities.set(entity, merged);
      }
    }
    
    // track the history of the entity and its service
    track(entity, service, newData) {
      // get the last entry of the service
      const services = this.entities.get(entity);
      const history = services[service];
      const last = history[history.length - 1];
      
      // there is no previous entry
      // add the current as the latest
      if(!last){
        const serviceWithNewHistory = {...services, [service]: [newData]};
        this.entities.set(entity, serviceWithNewHistory);
      }
      // else compare the new one with the last one
      // if both are different then make the new entry
      else{
        const lastStr = JSON.stringify(last);
        const newDataStr = JSON.stringify(newData);
        
        if(lastStr !== newDataStr){
          const serviceWithNewHistory = {...services, [service]: [...history, newData]};
          this.entities.set(entity, serviceWithNewHistory);
        }
      }
    }
    
    // get the complete history
    getHistory(entity, service) {
      const services = this.entities.get(entity);
      return services[service];
    }
  }
  
  // create a single instance of the tracking
  // using single-ton design pattern
  const HistoryTracking = (function(){
    let instance;
    
    return function(){
      if(!instance){
        instance = new HistoryTrackingHelper();
      }
      
      return instance;
    };
  })();


  Input:
const historyTracking = HistoryTracking();
historyTracking.registerEntity("document");
historyTracking.registerService("document", 'JavaScript Ultimate Guide');
historyTracking.track("document", 'JavaScript Ultimate Guide', "Problem 1");
historyTracking.track("document", 'JavaScript Ultimate Guide', "Problem 1, Problem 2");
historyTracking.track("document", 'JavaScript Ultimate Guide', "Problem 3");
console.log(historyTracking.getHistory("document", 'JavaScript Ultimate Guide'));

Output:
["Problem 1","Problem 1, Problem 2","Problem 3"]