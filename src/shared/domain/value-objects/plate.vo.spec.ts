import { describe, expect, it } from '@jest/globals';
import { PlateVO } from './plate.vo';

describe('PlateVO', () => {
  it('parses and normalizes plate with hyphen', () => {
    const p = PlateVO.parse('apl-1234');
    expect(p.value).toBe('APL1234');
  });

  it('accepts Mercosul format', () => {
    const p = PlateVO.parse('ABC1D23');
    expect(p.value).toBe('ABC1D23');
  });

  it('rejects invalid plate', () => {
    expect(() => PlateVO.parse('12ABCD3')).toThrow('Invalid vehicle plate');
  });

  it('create delegates to parse', () => {
    expect(PlateVO.create('apl-1234').value).toBe('APL1234');
  });

  it('isValid returns true/false', () => {
    expect(PlateVO.isValid('ABC1D23')).toBe(true);
    expect(PlateVO.isValid('12ABCD3')).toBe(false);
  });

  it('equals compares compact form', () => {
    const a = PlateVO.parse('apl-1234');
    const b = PlateVO.parse('APL1234');
    expect(a.equals(b)).toBe(true);
  });
});
