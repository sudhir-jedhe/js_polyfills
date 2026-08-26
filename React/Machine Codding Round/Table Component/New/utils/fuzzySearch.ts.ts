import { matchSorter } from 'match-sorter';

export const fuzzySearch = (data: any[], searchTerm: string, keys: string[]) => {
  return matchSorter(data, searchTerm, { keys });
};

