import { NotificationBell } from './NotificationBell'

/**
 * TopBar - Brand anchor with notification bell
 */
export function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 12px' }}>
        {/* Brand logo */}
        <img
          src="/logo.png"
          alt="What's Good Here"
          className="top-bar-icon"
          style={{ height: '28px', width: 'auto' }}
        />

        {/* Notification Bell */}
        <NotificationBell />
      </div>
    </div>
  )
}
