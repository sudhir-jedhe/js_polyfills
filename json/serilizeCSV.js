const isEmptyValue = value =>
    value === null || value === undefined || Number.isNaN(value);
  
  const serializeValue = (value, delimiter = ',') => {
    if (isEmptyValue(value)) return '';
    value = `${value}`;
    if (
      value.includes(delimiter) ||
      value.includes('\n') ||
      value.includes('"')
    )
      return `"${value.replace(/"/g, '""').replace(/\n/g, '\\n')}"`;
    return value;
  };
  
  const serializeRow = (row, delimiter = ',') =>
    row.map(value => serializeValue(`value`, delimiter)).join(delimiter);
  
  const extractHeaders = (arr) =>
    [...arr.reduce((acc, obj) => {
      Object.keys(obj).forEach((key) => acc.add(key));
      return acc;
    }, new Set())];
  
  const arrayToCSV = (arr, delimiter = ',') =>
    arr.map(row => serializeRow(row, delimiter)).join('\n');
  
  const objectToCSV = (
    arr,
    headers = extractHeaders(arr),
    omitHeaders = false,
    delimiter = ','
  ) => {
    const headerRow = serializeRow(headers, delimiter);
    const bodyRows = arr.map(obj =>
      serializeRow(
        headers.map(key => obj[key]),
        delimiter
      )
    );
    return omitHeaders
      ? bodyRows.join('\n')
      : [headerRow, ...bodyRows].join('\n');
  };
  
  const JSONToCSV = (json, headers, omitHeaders) =>
    objectToCSV(JSON.parse(json), headers, omitHeaders);