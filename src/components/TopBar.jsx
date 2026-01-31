import { NotificationBell } from './NotificationBell'

/**
 * TopBar - Brand anchor with MV island silhouette and notification bell
 */
export function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 12px' }}>
        {/* Spacer for symmetry */}
        <div style={{ width: '28px' }} />

        {/* Martha's Vineyard island silhouette — centered */}
        <img
          src="/mv-outline.png"
          alt="Martha's Vineyard"
          className="top-bar-icon"
          style={{ height: '28px', width: 'auto', opacity: 0.9 }}
        />

        {/* Notification Bell */}
        <NotificationBell />
      </div>
    </div>
  )
}
