export const sum = (cells) => {
    return cells.reduce((acc, cell) => {
      const num = parseFloat(cell);
      if (!isNaN(num)) acc += num;
      return acc;
    }, 0);
  };
  