import React from 'react'
import SidebarButton from './SidebarButton'
import { sidebarConfig } from '../../config/sidebarConfig'
import { useTextSizeMultiplier } from '../../constants/textSize'

// Section header component
function SectionHeader({ title }) {

  const textSizeMultiplier = useTextSizeMultiplier()

  return (
    <div style={{
      backgroundColor: '#bdc3c7',
      color: '#2c3e50',
      padding: '15px 20px',
      fontSize: `${18 * Math.sqrt(textSizeMultiplier)}px`,
      fontWeight: 'bold',
      borderBottom: '1px solid #95a5a6',
      textAlign: 'center'
    }}>
      {title}
    </div>
  )
}

function Sidebar({ isOpen, onToggle, onSceneChange, activeScene }) {
  const handleButtonClick = (button) => {
    if (button.scene) {
      onSceneChange(button.scene)
    } else {
      console.log(`${button.text} clicked (inactive)`)
    }
  }

  return (
    <>
      {/* Collapsible Left Panel */}
      <div
        data-sidebar
        style={{
          position: 'fixed',
          left: isOpen ? '0' : '-300px',
          top: '0',
          width: '300px',
          height: '100vh',
          backgroundColor: '#ecf0f1',
          color: '#2c3e50',
          zIndex: 1000,
          transition: 'left 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: isOpen ? '2px 0 10px rgba(0,0,0,0.3)' : 'none',
          padding: '0',
          boxSizing: 'border-box',
          overflow: 'auto'
        }}
      >
        {sidebarConfig.map((section) => (
          <div key={section.title}>
            <SectionHeader title={section.title} />
            {section.buttons.map((button) => (
              <SidebarButton
                key={button.text}
                text={button.text}
                onClick={() => handleButtonClick(button)}
                isActive={button.scene === activeScene}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Panel Toggle Button - Quarter Circle */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          left: isOpen ? '300px' : '0px',
          top: '0px',
          width: '55px',
          height: '55px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          zIndex: 999,
          padding: '0',
          outline: 'none',
          transition: 'left 0.3s ease-in-out',
          filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.2))'
        }}
      >
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          style={{
            overflow: 'visible'
          }}
        >
          {/* Quarter circle background */}
          <path
            d="M 0 0 L 55 0 A 55 55 0 0 1 0 55 Z"
            fill="#d5dbdb"
            stroke="none"
            style={{
              transition: 'fill 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.fill = '#bdc3c7'
            }}
            onMouseLeave={(e) => {
              e.target.style.fill = '#d5dbdb'
            }}
          />
          
          {/* Three lines morphing to right arrow */}
          {/* Top line -> top half of arrow */}
          <path
            d={isOpen ? "M 18 23 L 27 17" : "M 15 18 L 30 18"}
            fill="none"
            stroke="#2c3e50"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transition: 'd 0.3s ease-in-out'
            }}
          />
          
          {/* Middle line -> merges with arrow tip */}
          <path
            d={isOpen ? "M 18 23 L 18 23" : "M 15 23 L 30 23"}
            fill="none"
            stroke="#2c3e50"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transition: 'd 0.3s ease-in-out'
            }}
          />
          
          {/* Bottom line -> bottom half of arrow */}
          <path
            d={isOpen ? "M 18 23 L 27 29" : "M 15 28 L 30 28"}
            fill="none"
            stroke="#2c3e50"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transition: 'd 0.3s ease-in-out'
            }}
          />
        </svg>
      </button>
    </>
  )
}

export default Sidebar 