export function evaluateFormula(formula: string, rowData: Record<string, any>): number {
  try {
    // Replace column references with actual values
    const evaluatedFormula = formula.replace(/\{([^}]+)\}/g, (match, columnName) => {
      const value = rowData[columnName];
      return typeof value === 'number' ? value.toString() : '0';
    });

    // Add basic math functions with decimal precision
    const mathContext = {
      abs: (x: number) => Number(Math.abs(x).toFixed(2)),
      round: (x: number) => Number(Math.round(x * 100) / 100),
      floor: (x: number) => Number(Math.floor(x * 100) / 100),
      ceil: (x: number) => Number(Math.ceil(x * 100) / 100),
      min: (...args: number[]) => Number(Math.min(...args).toFixed(2)),
      max: (...args: number[]) => Number(Math.max(...args).toFixed(2)),
      pow: (x: number, y: number) => Number(Math.pow(x, y).toFixed(2))
    };

    // Safely evaluate the formula with math functions
    // eslint-disable-next-line no-new-func
    const result = new Function(...Object.keys(mathContext), `return ${evaluatedFormula}`)(...Object.values(mathContext));
    return typeof result === 'number' ? Number(result.toFixed(2)) : 0;
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return 0;
  }
}