import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterSidebar } from '@/components/FilterSidebar';
import type { FilterState } from '@/types';
import { emptyFilters } from '../fixtures';

// Real state holder so we can read the filters after each click.
function Harness({ onChange, onReset }: { onChange: (f: FilterState) => void; onReset: () => void }) {
  const [filters, setFilters] = useState(emptyFilters());
  onChange(filters);
  return <FilterSidebar filters={filters} setFilters={setFilters} onReset={onReset} />;
}

const setup = () => {
  let latest = emptyFilters();
  const onReset = vi.fn();
  render(<Harness onChange={(f) => (latest = f)} onReset={onReset} />);
  return { get filters() { return latest; }, onReset, user: userEvent.setup() };
};

describe('<FilterSidebar>', () => {
  it('switches Local / Overseas / All scope', async () => {
    const s = setup();
    await s.user.click(screen.getByRole('button', { name: 'Local' }));
    expect(s.filters.locationType).toBe('local');
    await s.user.click(screen.getByRole('button', { name: 'Overseas' }));
    expect(s.filters.locationType).toBe('international');
    await s.user.click(screen.getByRole('button', { name: 'All' }));
    expect(s.filters.locationType).toBe('all');
  });

  it('selects province and country', async () => {
    const s = setup();
    await s.user.selectOptions(screen.getByDisplayValue('All Provinces / Nationwide'), 'Siem Reap');
    expect(s.filters.provinceCity).toBe('Siem Reap');
    await s.user.selectOptions(screen.getByDisplayValue('Any Country'), 'Japan');
    expect(s.filters.country).toBe('Japan');
  });

  it('selects a delivery format', async () => {
    const s = setup();
    await s.user.click(screen.getByLabelText('100% Remote'));
    expect(s.filters.workFormat).toBe('remote');
  });

  it('toggles the quick checkboxes', async () => {
    const s = setup();
    const boxes = screen.getAllByRole('checkbox');
    for (const box of boxes) await s.user.click(box);
    expect(s.filters).toMatchObject({
      highMatchOnly: true, visaSponsorshipOnly: true, closingSoonOnly: true, verifiedOnly: true,
    });
  });

  it('calls onReset', async () => {
    const s = setup();
    await s.user.click(screen.getByRole('button', { name: /reset/i }));
    expect(s.onReset).toHaveBeenCalledTimes(1);
  });
});
