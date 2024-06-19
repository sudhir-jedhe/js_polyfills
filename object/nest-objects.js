const nest = (items, id = null, link = 'parentId') =>
    items
      .filter(item => item[link] === id)
      .map(item => ({ ...item, children: nest(items, item.id, link) }));
  
  const comments = [
    { id: 1, parentId: null },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 1 },
    { id: 4, parentId: 2 },
    { id: 5, parentId: 4 }
  ];
  const nestedComments = nest(comments);
  /*
  [
    {
      id: 1,
      parentId: null,
      children: [
        {
          id: 2,
          parentId: 1,
          children: [
            {
              id: 4,
              parentId: 2,
              children: [
                {
                  id: 5,
                  parentId: 4,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 3,
          parentId: 1,
          children: []
        }
      ]
    }
  ]
  */