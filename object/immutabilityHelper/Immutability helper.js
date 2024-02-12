/**
 * @param {any} data
 * @param {Object} command
 */
function update(data, command) {
  for (const [key, value] of Object.entries(command)) {
    switch (key) {
      case "$push":
        return [...data, ...value];
      case "$set":
        return value;
      case "$merge":
        if (!(data instanceof Object)) {
          throw Error("bad merge");
        }
        return { ...data, ...value };
      case "$apply":
        return value(data);
      default:
        if (data instanceof Array) {
          const res = [...data];
          res[key] = update(data[key], value);
          return res;
        } else {
          return {
            ...data,
            [key]: update(data[key], value),
          };
        }
    }
  }
}



/************************* */
**
 * @param { any } data
 * @param { Object } command
 */
const keyMap = ["$push", "$set", "$merge", "$apply"];
function update(data, command) {
  return walk(data, command);
}

function walk(data, command, pdata, commandkey) {
  // your code here
  for (let k in command) {
    if (keyMap.indexOf(k) !== -1) {
      switch (k) {
        case "$push":
          if (data instanceof Array) {
            data.push(...command[k]);
          } else {
            throw Error("no array");
          }
          break;
        case "$set":
          pdata[commandkey] = command[k];
          break;
        case "$merge":
          if (data instanceof Object) {
            pdata[commandkey] = Object.assign(data, command[k]);
          } else {
            throw Error("no Object");
          }
          break;
        case "$apply":
          pdata[commandkey] = command[k].call(null, pdata[commandkey]);
          break;
      }
    } else {
      if (command[k]) {
        walk(data[k], command[k], data, k);
      }
    }
  }
  return data;
}


/********************************** */
function update(...args) {
    return dfs(...args);
  }
  
  const dfs = (data, command, prevData, prevKey) => {
    for (const key of Object.keys(command)) {
      const nextCommand = command[key];
      const action = actions[key];
  
      if (action) {
        action(data, nextCommand, prevData, prevKey)
      } else {
        const nextData = data[key];
  
        dfs(nextData, nextCommand, data, key);
      }
    }
  
    return data;
  }
  
  const actions = {
  
    $push(data, commandData) {
      if(Array.isArray(data)) {
        data.push(...commandData)
      } else {
        throw new Error("not array")
      }
    },
  
    $set(data, commandData, prevData, prevKey) {
      prevData[prevKey] = commandData;
    },
  
    $merge(data, commandData, prevData, prevKey) {
      if(data instanceof Object) {
        prevData[prevKey] = {
          ...data,
          ...commandData
        };
      } else {
        throw new Error("not object")
      }
    },
  
    $apply(data, commandData, prevData, prevKey) {
      prevData[prevKey] = commandData.call(this, prevData[prevKey])
    }
  }
  


  /********************************************* */
  /**
 * @param {any} data
 * @param {Object} command
 */
function update(data, command) {
    if ("$push" in command) {
      const val = command['$push'];
      return [...data, ...(Array.isArray(val) ? val : [val])];
    }
  
    if ("$set" in command) {
      return command['$set']
    }
    
    if ('$apply' in command) {
      return command['$apply'](data)
    }
  
    if ("$merge" in command) {
      if(typeof data !== 'object' || data === null) {
        throw Error('data is not object');
      }
      return {
        ...data,
        ...command['$merge'],
      };
    }
  
    const newData = Array.isArray(data) ? [...data] : {...data}
    for (const key of Object.keys(command)) {
      newData[key] = update(newData[key], command[key]);
    }
    return newData;
  }
  
  
  console.log(update([1], {1: {$set: 2}}));