import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationTrackerView } from '@/components/ApplicationTrackerView';
import type { ApplicationStatus } from '@/types';
import { makeOpportunity } from '../fixtures';

const opps = [
  makeOpportunity({ id: 1, title: 'Job One', organization: 'Org A' }),
  makeOpportunity({ id: 2, title: 'Job Two', organization: 'Org B' }),
  makeOpportunity({ id: 3, title: 'Job Three', organization: 'Org C' }),
];

const setup = (trackers: Record<number, ApplicationStatus>, opportunities = opps) => {
  const onUpdateStatus = vi.fn();
  const onSelect = vi.fn();
  render(<ApplicationTrackerView opportunities={opportunities} trackers={trackers}
    onUpdateStatus={onUpdateStatus} onSelect={onSelect} />);
  return { onUpdateStatus, onSelect, user: userEvent.setup() };
};

describe('<ApplicationTrackerView>', () => {
  it('shows the KPI counts', () => {
    setup({ 1: 'applied', 2: 'interviewing', 3: 'offered' });
    expect(screen.getByText('3 Total Tracked')).toBeInTheDocument();
    expect(screen.getByText('1 Submitted')).toBeInTheDocument();
    expect(screen.getByText('1 Interviewing')).toBeInTheDocument();
    expect(screen.getByText('1 Offers')).toBeInTheDocument();
  });

  it('only shows tracked opportunities', () => {
    setup({ 1: 'saved' });
    expect(screen.getByText('Job One')).toBeInTheDocument();
    expect(screen.queryByText('Job Two')).not.toBeInTheDocument();
  });

  it('puts each card in its stage column (the select shows the stage)', () => {
    setup({ 1: 'saved', 2: 'applied' });
    expect(screen.getAllByRole('combobox').map((s) => (s as HTMLSelectElement).value).sort())
      .toEqual(['applied', 'saved']);
  });

  it('moves a card to a new stage', async () => {
    const { user, onUpdateStatus } = setup({ 1: 'saved' });
    await user.selectOptions(screen.getByRole('combobox'), 'interviewing');
    expect(onUpdateStatus).toHaveBeenCalledWith(1, 'interviewing');
  });

  it('opens details when a card title is clicked', async () => {
    const { user, onSelect } = setup({ 2: 'preparing' });
    await user.click(screen.getByText('Job Two'));
    expect(onSelect).toHaveBeenCalledWith(opps[1]);
  });

  it('has all five pipeline columns', () => {
    setup({});
    for (const t of ['Saved for Later', 'Preparing Documents', 'Applied / Submitted', 'Interview Scheduled', 'Offers Received'])
      expect(screen.getByText(t)).toBeInTheDocument();
  });

  it('FE-05 fixed: a rejected ("Archived") application stays visible', () => {
    setup({ 1: 'rejected' });
    expect(screen.getByText('Job One')).toBeInTheDocument();
  });

  it('FE-05 fixed: applications outside the current catalogue page are shown', () => {
    setup({ 1: 'applied', 99: 'interviewing' }, [opps[0]]);
    expect(within(document.body).getAllByRole('combobox')).toHaveLength(2);
  });
});
