import { Trash2 } from 'lucide-react'
import Modal from './Modal'
export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <Modal
      title=""
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel} id="confirm-cancel">Cancel</button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            id="confirm-ok"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
        <div className="confirm-icon-wrap" style={{ margin: '0 auto' }}>
          <Trash2 size={22} />
        </div>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: '8px' }}>
          {title}
        </h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
          {message}
        </p>
      </div>
    </Modal>
  )
}