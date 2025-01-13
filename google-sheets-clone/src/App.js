import React, { useState , useEffect} from 'react';
import './App.css';

// Helper function to create an empty 10x10 spreadsheet
const createEmptySpreadsheet = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
};

// Mathematical functions
const sumCells = (range, grid) => {
  let total = 0;
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      const cellValue = parseFloat(grid[i][j]);
      if (!isNaN(cellValue)) {
        total += cellValue;
      }
    }
  }
  return total;
};

const averageCells = (range, grid) => {
  let total = 0;
  let count = 0;
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      const cellValue = parseFloat(grid[i][j]);
      if (!isNaN(cellValue)) {
        total += cellValue;
        count++;
      }
    }
  }
  return count > 0 ? total / count : 0;
};

const maxCells = (range, grid) => {
  let max = -Infinity;
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      const cellValue = parseFloat(grid[i][j]);
      if (!isNaN(cellValue)) {
        max = Math.max(max, cellValue);
      }
    }
  }
  return max === -Infinity ? 'No numbers in range' : max;
};

const minCells = (range, grid) => {
  let min = Infinity;
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      const cellValue = parseFloat(grid[i][j]);
      if (!isNaN(cellValue)) {
        min = Math.min(min, cellValue);
      }
    }
  }
  return min === Infinity ? 'No numbers in range' : min;
};

const countCells = (range, grid) => {
  let count = 0;
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      const cellValue = parseFloat(grid[i][j]);
      if (!isNaN(cellValue)) {
        count++;
      }
    }
  }
  return count;
};

// Data quality functions
const trimCells = (range, grid) => {
  const newGrid = [...grid];
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      newGrid[i][j] = newGrid[i][j].trim();
    }
  }
  return newGrid;
};

const upperCells = (range, grid) => {
  const newGrid = [...grid];
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      newGrid[i][j] = newGrid[i][j].toUpperCase();
    }
  }
  return newGrid;
};

const lowerCells = (range, grid) => {
  const newGrid = [...grid];
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      newGrid[i][j] = newGrid[i][j].toLowerCase();
    }
  }
  return newGrid;
};

const removeDuplicates = (range, grid) => {
  const newGrid = [...grid];
  const seen = new Set();
  for (let i = range.startRow; i <= range.endRow; i++) {
    const rowKey = newGrid[i].slice(range.startCol, range.endCol + 1).join(',');
    if (seen.has(rowKey)) {
      newGrid[i] = Array(newGrid[i].length).fill(''); // Clear duplicate rows
    } else {
      seen.add(rowKey);
    }
  }
  return newGrid;
};

const findAndReplace = (range, grid, findText, replaceText) => {
  const newGrid = [...grid];
  for (let i = range.startRow; i <= range.endRow; i++) {
    for (let j = range.startCol; j <= range.endCol; j++) {
      if (newGrid[i][j].includes(findText)) {
        newGrid[i][j] = newGrid[i][j].replace(new RegExp(findText, 'g'), replaceText);
      }
    }
  }
  return newGrid;
};

function App() {
  // Spreadsheet grid initialization
  const [grid, setGrid] = useState(createEmptySpreadsheet(10, 10));
  const [selectedRange, setSelectedRange] = useState({
    startRow: 0,
    startCol: 0,
    endRow: 0,
    endCol: 0,
  });
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [calculationResult, setCalculationResult] = useState('');

  useEffect(() => {
    const savedGrid = JSON.parse(localStorage.getItem('spreadsheet'));
    if (savedGrid) setGrid(savedGrid);
  }, []);

  // Save spreadsheet to localStorage
  useEffect(() => {
    localStorage.setItem('spreadsheet', JSON.stringify(grid));
  }, [grid]);

  // Handle cell value change
  const handleCellChange = (row, col, value) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  // Handle selection of a cell range
  const handleCellSelection = (row, col) => {
    setSelectedRange((prevRange) => {
      if (prevRange.startRow === row && prevRange.startCol === col) {
        return { startRow: 0, startCol: 0, endRow: 0, endCol: 0 };
      } else {
        return {
          startRow: Math.min(prevRange.startRow, row),
          startCol: Math.min(prevRange.startCol, col),
          endRow: Math.max(prevRange.endRow, row),
          endCol: Math.max(prevRange.endCol, col),
        };
      }
    });
  };

  // Apply mathematical functions and update calculation result
  const handleSum = () => {
    const result = sumCells(selectedRange, grid);
    setCalculationResult(`SUM: ${result}`);
  };

  const handleAverage = () => {
    const result = averageCells(selectedRange, grid);
    setCalculationResult(`AVERAGE: ${result}`);
  };

  const handleMax = () => {
    const result = maxCells(selectedRange, grid);
    setCalculationResult(`MAX: ${result}`);
  };

  const handleMin = () => {
    const result = minCells(selectedRange, grid);
    setCalculationResult(`MIN: ${result}`);
  };

  const handleCount = () => {
    const result = countCells(selectedRange, grid);
    setCalculationResult(`COUNT: ${result}`);
  };

  // Apply Data Quality Functions
  const handleTrim = () => {
    const updatedGrid = trimCells(selectedRange, grid);
    setGrid(updatedGrid);
  };

  const handleUpper = () => {
    const updatedGrid = upperCells(selectedRange, grid);
    setGrid(updatedGrid);
  };

  const handleLower = () => {
    const updatedGrid = lowerCells(selectedRange, grid);
    setGrid(updatedGrid);
  };

  const handleRemoveDuplicates = () => {
    const updatedGrid = removeDuplicates(selectedRange, grid);
    setGrid(updatedGrid);
  };

  const handleFindAndReplace = () => {
    const updatedGrid = findAndReplace(selectedRange, grid, findText, replaceText);
    setGrid(updatedGrid);
  };

  return (
    <div className="App">
      <h1>Google Sheet</h1>
      <div className="spreadsheet">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                className={`cell ${selectedRange.startRow <= rowIndex && selectedRange.endRow >= rowIndex && selectedRange.startCol <= colIndex && selectedRange.endCol >= colIndex ? 'selected' : ''}`}
                value={cell}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                onClick={() => handleCellSelection(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="controls">
        <button onClick={handleSum}>Calculate SUM</button>
        <button onClick={handleAverage}>Calculate AVERAGE</button>
        <button onClick={handleMax}>Calculate MAX</button>
        <button onClick={handleMin}>Calculate MIN</button>
        <button onClick={handleCount}>Calculate COUNT</button>
      </div>

      <div className="controls">
        <button onClick={handleTrim}>Trim Whitespace</button>
        <button onClick={handleUpper}>Convert to Uppercase</button>
        <button onClick={handleLower}>Convert to Lowercase</button>
        <button onClick={handleRemoveDuplicates}>Remove Duplicates</button>
      </div>

      <div className="find-replace">
        <input
          type="text"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          placeholder="Find"
        />
        <input
          type="text"
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          placeholder="Replace"
        />
        <button onClick={handleFindAndReplace}>Find and Replace</button>
      </div>

      {/* Display calculation result */}
      <div className="calculation-result">
        <h3>{calculationResult}</h3>
      </div>
    </div>
  );
}

export default App;
