import { createPortal } from 'react-dom'
import { ReviewFlow } from './ReviewFlow'

export function DishModal({ dish, onClose, onVote, onLoginRequired }) {
  if (!dish) return null

  return createPortal(
    <div
      key={`modal-${dish.dish_id}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        ref={(el) => { if (el) el.scrollTop = 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px',
          maxHeight: '85vh',
          overflowY: 'auto',
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#e5e5e5',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        {/* Dish name + restaurant */}
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', paddingRight: '30px' }}>
          {dish.dish_name}
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          {dish.restaurant_name}
          {dish.price && ` · $${Number(dish.price).toFixed(0)}`}
        </p>

        {/* Review Flow - this is where thumbs up/down appears */}
        <ReviewFlow
          dishId={dish.dish_id}
          dishName={dish.dish_name}
          category={dish.category}
          totalVotes={dish.total_votes || 0}
          yesVotes={dish.yes_votes || 0}
          onVote={onVote}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </div>,
    document.body
  )
}
