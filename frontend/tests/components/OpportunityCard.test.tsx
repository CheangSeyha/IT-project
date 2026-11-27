import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OpportunityCard } from '@/components/OpportunityCard';
import { makeOpportunity } from '../fixtures';

const setup = (props: Partial<React.ComponentProps<typeof OpportunityCard>> = {}) => {
  const handlers = { onSelect: vi.fn(), onToggleBookmark: vi.fn(), onTrack: vi.fn(), onApply: vi.fn() };
  const opp = props.opportunity ?? makeOpportunity();
  render(<OpportunityCard opportunity={opp} {...handlers} {...props} />);
  return { opp, ...handlers, user: userEvent.setup() };
};

describe('<OpportunityCard>', () => {
  it('shows title, organisation and location', () => {
    setup();
    expect(screen.getByText('Backend Intern')).toBeInTheDocument();
    expect(screen.getByText('Wing Bank')).toBeInTheDocument();
    expect(screen.getByText('Phnom Penh')).toBeInTheDocument();
  });

  it('opens details when the title or Details is clicked', async () => {
    const { user, onSelect, opp } = setup();
    await user.click(screen.getByText('Backend Intern'));
    await user.click(screen.getByRole('button', { name: /details/i }));
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(opp);
  });

  it('toggles the bookmark with the opportunity id', async () => {
    const { user, onToggleBookmark } = setup();
    await user.click(screen.getByTitle('Save Bookmark'));
    expect(onToggleBookmark).toHaveBeenCalledWith(1);
  });

  it('shows "Remove Bookmark" when already bookmarked', () => {
    setup({ opportunity: makeOpportunity({ is_bookmarked: true }) });
    expect(screen.getByTitle('Remove Bookmark')).toBeInTheDocument();
  });

  it('calls onApply and onTrack', async () => {
    const { user, onApply, onTrack, onSelect } = setup();
    await user.click(screen.getByRole('button', { name: /apply as student/i }));
    await user.click(screen.getByTitle('Track in Pipeline'));
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onTrack).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled(); // buttons do not also open the modal
  });

  it('shows "Applied" instead of the Apply button once applied', () => {
    setup({ isApplied: true });
    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /apply as student/i })).not.toBeInTheDocument();
  });

  it('marks deadlines within 14 days as closing soon', () => {
    const soon = new Date(Date.now() + 5 * 86400000).toISOString();
    setup({ opportunity: makeOpportunity({ deadline: soon }) });
    expect(screen.getByText(/closing soon/i)).toBeInTheDocument();
  });

  it('does not mark far or past deadlines as closing soon', () => {
    setup({ opportunity: makeOpportunity({ deadline: new Date(Date.now() + 40 * 86400000).toISOString() }) });
    expect(screen.queryByText(/closing soon/i)).not.toBeInTheDocument();
  });
});
