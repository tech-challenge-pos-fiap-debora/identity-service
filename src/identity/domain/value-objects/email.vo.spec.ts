import { describe, expect, it } from '@jest/globals';
import { EmailVO } from './email.vo';

describe('EmailVO', () => {
  it('normalizes to lowercase and trims', () => {
    const e = EmailVO.parse('  User@Example.COM ');
    expect(e.value).toBe('user@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => EmailVO.parse('not-an-email')).toThrow('Invalid email');
  });

  it('equals compares normalized form', () => {
    const a = EmailVO.parse('User@Example.COM');
    const b = EmailVO.parse('user@example.com');
    expect(a.equals(b)).toBe(true);
  });

  it('create delegates to parse', () => {
    expect(EmailVO.create('User@Example.COM').value).toBe('user@example.com');
  });

  it('isValid returns true/false', () => {
    expect(EmailVO.isValid('user@example.com')).toBe(true);
    expect(EmailVO.isValid('not-an-email')).toBe(false);
  });
});
