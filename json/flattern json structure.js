const input = [
    {
      "value": "value0",
      "children": []
    },
    {
      "value": "value1",
      "children": [
        {
          "value": "value2",
          "children": [
            {
              "value": "value3",
              "children": []
            }
          ]
        },
        {
          "value": "value4",
          "children": []
        }
      ]
    },
    {
      "value": "value5",
      "children": []
    }, {
      "value": "value6",
      "children": []
    }
  ];
  
  async function getValueList(fromIndex, toIndex) {
      const flatten = (arr) => {
          return arr.reduce((acc, item) => {
              acc.push(item.value);
              if (item.children.length > 0) {
                  acc = acc.concat(flatten(item.children));
              }
              return acc;
          }, []);
      };
      
      return flatten(input.slice(fromIndex, toIndex));
  }
  
  // Example usage:
  getValueList(0, 3).then(result => {
      console.log(result); // Output: ['value0', 'value1', 'value2', 'value3', 'value4']
  });
  