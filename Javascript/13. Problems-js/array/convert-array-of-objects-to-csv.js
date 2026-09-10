/**
 * Convert an array of objects to a CSV string containing only the specified
 * columns.
 *
 * The part people get wrong: escaping. A field containing a comma, a quote
 * or a newline must be wrapped in double quotes, with inner quotes doubled.
 */

/** Escape one field per RFC 4180. */
function escapeField(value, delimiter = ',') {
  if (value === null || value === undefined) return '';

  const str = String(value);
  const needsQuotes = str.includes(delimiter) || str.includes('"') || /[\r\n]/.test(str);

  return needsQuotes ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * @param {object[]} rows
 * @param {string[]} columns keys to include, in order
 * @param {{ delimiter?: string, header?: boolean }} [options]
 * @returns {string}
 */
function toCsv(rows, columns, { delimiter = ',', header = true } = {}) {
  const lines = [];

  if (header) lines.push(columns.map((c) => escapeField(c, delimiter)).join(delimiter));

  for (const row of rows) {
    lines.push(columns.map((col) => escapeField(row[col], delimiter)).join(delimiter));
  }

  return lines.join('\n');
}

/** Infer the columns from the union of all keys, preserving first-seen order. */
function toCsvAuto(rows, options) {
  const columns = [...new Set(rows.flatMap(Object.keys))];
  return toCsv(rows, columns, options);
}

/**
 * Parse CSV back into objects. Handles quoted fields, doubled quotes and
 * newlines inside quotes.
 */
function fromCsv(csv, delimiter = ',') {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];

    if (inQuotes) {
      if (ch === '"' && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((key, i) => [key, r[i] ?? ''])));
}

// ---- Examples ----
const people = [
  { id: 1, name: 'Ada, Lovelace', role: 'admin', secret: 'x' },
  { id: 2, name: 'Bob "The Builder"', role: 'user', secret: 'y' },
];

console.log(toCsv(people, ['id', 'name', 'role']));
// id,name,role
// 1,"Ada, Lovelace",admin
// 2,"Bob ""The Builder""",user

console.log(toCsvAuto([{ a: 1 }, { b: 2 }]));  // a,b / 1, / ,2
console.log(fromCsv('id,name\n1,"Ada, L"'));   // [{ id: '1', name: 'Ada, L' }]

module.exports = { toCsv, toCsvAuto, fromCsv, escapeField };
