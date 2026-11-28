import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import type { NotificationItem } from '@/types';

const items: NotificationItem[] = [
  { id: 1, title: 'Deadline soon', message: 'Closes in 3 days', timestamp: '3 days left', read: false, type: 'deadline', opportunityId: 4 },
  { id: 2, title: 'New listing', message: 'New job', timestamp: 'Recently', read: false, type: 'opportunity' },
  { id: 3, title: 'Crawler sync', message: 'ok', timestamp: 'x', read: true, type: 'system' },
];

const setup = (isOpen = true) => {
  const props = { onClose: vi.fn(), onMarkAllAsRead: vi.fn(), onSelectNotification: vi.fn() };
  render(<NotificationDropdown notifications={items} isOpen={isOpen} {...props} />);
  return { ...props, user: userEvent.setup() };
};

describe('<NotificationDropdown>', () => {
  it('renders nothing when closed', () => {
    setup(false);
    expect(screen.queryByText('Deadline soon')).not.toBeInTheDocument();
  });

  it('lists notifications and the unread count', () => {
    setup();
    expect(screen.getByText('Deadline soon')).toBeInTheDocument();
    expect(screen.getByText('Crawler sync')).toBeInTheDocument();
    expect(screen.getByText('2 new')).toBeInTheDocument();
  });

  it('selects a notification', async () => {
    const { user, onSelectNotification } = setup();
    await user.click(screen.getByText('Deadline soon'));
    expect(onSelectNotification).toHaveBeenCalledWith(items[0]);
  });
});
