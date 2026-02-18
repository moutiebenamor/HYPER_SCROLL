import React, { useState } from 'react'

export default function AudioController({ onInit }) {
    const [initialized, setInitialized] = useState(false)

    const handleStart = () => {
        onInit()
        setInitialized(true)
    }

    if (initialized) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
            }}
        >
            <button
                onClick={handleStart}
                style={{
                    background: 'transparent',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                    padding: '1rem 3rem',
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    boxShadow: '0 0 20px rgba(255, 0, 60, 0.4)',
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'var(--accent)'
                    e.target.style.color = '#000'
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--accent)'
                }}
            >
                Initialize System
            </button>
        </div>
    )
}
