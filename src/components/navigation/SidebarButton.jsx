import React from 'react'

function SidebarButton({ text, onClick, isActive = false }) {
  return (
    <button
      style={{
        width: '100%',
        padding: '12px 20px',
        backgroundColor: isActive ? '#aed6f1' : '#ecf0f1',
        color: '#2c3e50',
        border: 'none',
        borderBottom: '1px solid #bdc3c7',
        fontSize: '15px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = '#d5dbdb'
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = isActive ? '#aed6f1' : '#ecf0f1'
      }}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default SidebarButton 