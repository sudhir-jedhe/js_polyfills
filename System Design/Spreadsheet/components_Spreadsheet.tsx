import React, { useState, useCallback } from 'react';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Cell from './Cell';

const ROWS = 26;
const COLS = 26;

interface CellData {
  value: string;
  formula: string;
}

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<CellData[][]>(
    Array(ROWS).fill(null).map(() => 
      Array(COLS).fill(null).map(() => ({ value: '', formula: '' }))
    )
  );
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [formulaBarValue, setFormulaBarValue] = useState('');

  const updateCell = useCallback((row: number, col: number, value: string, formula: string) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[row] = [...newData[row]];
      newData[row][col] = { value, formula };
      return newData;
    });
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    setActiveCell([row, col]);
    setFormulaBarValue(data[row][col].formula);
  }, [data]);

  const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaBarValue(e.target.value);
  };

  const handleFormulaBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && activeCell) {
      const [row, col] = activeCell;
      const result = evaluateFormula(formulaBarValue, data);
      updateCell(row, col, result, formulaBarValue);
    }
  };

  const evaluateFormula = (formula: string, data: CellData[][]): string => {
    if (formula.startsWith('=')) {
      try {
        // Simple formula evaluation (only supports basic arithmetic)
        const result = new Function('data', `return ${formula.slice(1)}`)(data);
        return result.toString();
      } catch (error) {
        return '#ERROR!';
      }
    }
    return formula;
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center space-x-2">
        <Input
          value={formulaBarValue}
          onChange={handleFormulaBarChange}
          onKeyDown={handleFormulaBarKeyDown}
          placeholder="Enter formula"
          className="flex-grow"
        />
        <Button onClick={() => activeCell && updateCell(activeCell[0], activeCell[1], evaluateFormula(formulaBarValue, data), formulaBarValue)}>
          Apply
        </Button>
      </div>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="w-10 h-10 bg-muted"></th>
            {Array(COLS).fill(null).map((_, index) => (
              <th key={index} className="w-24 h-10 bg-muted font-bold text-center">
                {String.fromCharCode(65 + index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="w-10 h-10 bg-muted font-bold text-center">{rowIndex + 1}</td>
              {row.map((cellData, colIndex) => (
                <Cell
                  key={colIndex}
                  value={cellData.value}
                  formula={cellData.formula}
                  isActive={activeCell?.[0] === rowIndex && activeCell?.[1] === colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onChange={(value) => updateCell(rowIndex, colIndex, value, value)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;

