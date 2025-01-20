import { CellData } from '../types';

export const evaluateFormula = (formula: string, data: CellData[][]): string => {
  if (formula.startsWith('=')) {
    try {
      const cellReferences = formula.match(/[A-Z]+[0-9]+/g) || [];
      let evaluatedFormula = formula.slice(1);

      cellReferences.forEach(ref => {
        const value = getCellValue(ref, data);
        evaluatedFormula = evaluatedFormula.replace(ref, value);
      });

      const result = new Function(`return ${evaluatedFormula}`)();
      return result.toString();
    } catch (error) {
      return '#ERROR!';
    }
  }
  return formula;
};

const getCellValue = (ref: string, data: CellData[][]): string => {
  const col = ref.charCodeAt(0) - 65;
  const row = parseInt(ref.slice(1)) - 1;
  return data[row][col].value;
};

