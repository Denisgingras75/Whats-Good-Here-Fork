import { NotificationBell } from './NotificationBell'

/**
 * TopBar - Brand anchor with notification bell
 */
export function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 12px' }}>
        {/* Fork + Knife checkmark logo */}
        <svg
          className="top-bar-icon"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Fork (short part of checkmark) */}
          <path
            d="M6 14L4 18M8 14L6 18M10 14L8 18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 18L10 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Knife (long part of checkmark) */}
          <path
            d="M10 24L26 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M26 6L28 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Notification Bell */}
        <NotificationBell />
      </div>
    </div>
  )
}
