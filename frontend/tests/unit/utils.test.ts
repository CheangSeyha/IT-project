import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn (class name helper)', () => {
  it('joins class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 0 && 'b', 'c')).toBe('a c');
  });

  it('lets the later Tailwind class win on conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', { 'text-blue-500': true })).toBe('text-blue-500');
  });
});
