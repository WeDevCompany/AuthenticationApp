import { DateTime } from '../../../OAuth/Domain/DateTime';

const VALID_DATE = new Date();
// the second argument is the month and starts from 0 to 11
const FIXED_DATE = new Date(2018, 11, 24, 10, 33, 30, 0);
const FIXED_DATE_STRING = '2018-12-24 10:33:30';
const UNKNOWN_DATE = undefined;
const NULL_DATE = null;
const EMPTY_STRING: string = '';

describe('[UNIT] Test for DateTime value object', () => {
  it('should create a DateTime with valid data', () => {
    expect(DateTime.fromDate(VALID_DATE)).toBeInstanceOf(DateTime);
  });

  it('should NOT create a DateTime with null data', () => {
    expect(() => DateTime.fromString(null)).toThrowError(/^InvalidDateTime.*/);
  });

  it('should NOT create a DateTime with null data', () => {
    expect(() => DateTime.fromDate(null)).toThrowError(/^InvalidDateTime.*/);
  });

  it('should create a DateTime with fixed valid data and return a Date object', () => {
    expect(DateTime.fromDate(FIXED_DATE).toDate()).toBe(FIXED_DATE);
  });

  it('should return a DateTime string with fixed valid data', () => {
    expect(DateTime.fromDate(FIXED_DATE).toString()).toBe(FIXED_DATE_STRING);
  });

  it('should fail to create a DateTime with undefined value', () => {
    expect(() => DateTime.fromDate(UNKNOWN_DATE)).toThrowError(/^InvalidDateTime.*/);
    expect(() => DateTime.fromString(UNKNOWN_DATE)).toThrowError(/^InvalidDateTime.*/);
  });

  it('should fail to create a DateTime with null value', () => {
    expect(() => DateTime.fromDate(NULL_DATE)).toThrowError(/^InvalidDateTime.*/);
    expect(() => DateTime.fromString(NULL_DATE)).toThrowError(/^InvalidDateTime.*/);
  });

  it('should fail to create a DateTime with null value', () => {
    expect(() => DateTime.fromString(EMPTY_STRING)).toThrowError(/^InvalidDateTime.*/);
  });

  it('should return true when two DateTimes are equal', () => {
    expect(DateTime.fromDate(FIXED_DATE).equals(DateTime.fromDate(FIXED_DATE))).toBe(true);
  });
});
