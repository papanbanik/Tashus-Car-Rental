// utils/calculations.js
import _ from 'lodash';

export type TLodashOperation = 'add' | 'subtract' | 'multiply' | 'divide';

// performs single operation with 2 decimal precision
export const calculateWithPrecision = (operation: TLodashOperation, numbers: number[], precision = 2): number => {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Please provide an array of numbers with at least one element.');
  }

  switch (operation) {
    case 'add':
      return _.round(_.sum(numbers), precision);
    case 'subtract':
      return _.round(
        numbers.reduce((acc, num) => acc - num),
        precision
      );
    case 'multiply':
      return _.round(
        numbers.reduce((acc, num) => acc * num, 1),
        precision
      );
    case 'divide':
      return _.round(
        numbers.reduce((acc, num) => acc / num),
        precision
      );
    default:
      throw new Error('Invalid operation');
  }
};

export type CalculateResultOperations = {
  type: TLodashOperation;
  value: number;
};

// performs multiple operations with 2 decimal precision
export const calculateMultipleOperation = (initialValue: number, operations: CalculateResultOperations[], precision: number = 2): number => {
  const result = operations?.reduce((acc, { type, value }) => {
    switch (type) {
      case 'add':
        return acc + value;
      case 'subtract':
        return acc - value;
      case 'multiply':
        return acc * value;
      case 'divide':
        return acc / value;
      default:
        throw new Error(`Unsupported operation: ${type}`);
    }
  }, initialValue);

  return _.round(result, precision);
};

export const compareValuesWithDetails = (value1: number = 0, value2: number = 0): { result: string; difference: number } => {
  if (value1 > value2) {
    return { result: 'G', difference: calculateWithPrecision('subtract', [value1, value2]) };
  } else if (value2 > value1) {
    return { result: 'L', difference: calculateWithPrecision('subtract', [value2, value1]) };
  } else {
    return { result: 'E', difference: 0 };
  }
};

export const parseFloatWithPrecision = (value: number): number => {
  if (value === undefined || Number.isNaN(value)) {
    return 0; // Return primitive number 0 instead of `new Number(0)`
  }
  return Number.parseFloat(Number(value ?? 0).toFixed(2)); // Return primitive number with precision
};
