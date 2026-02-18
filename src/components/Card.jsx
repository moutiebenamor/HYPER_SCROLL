import React from 'react'

export default function Card({ id, title, grid, dataSize, index }) {
    return (
        <div className="card">
            <div className="card-header">
                <span className="card-id">ID-{id}</span>
                <div style={{ width: 10, height: 10, background: 'var(--accent)' }} />
            </div>
            <h2>{title}</h2>
            <div className="card-footer">
                <span>GRID: {grid}</span>
                <span>DATA_SIZE: {dataSize}MB</span>
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    right: '2rem',
                    fontSize: '4rem',
                    opacity: 0.1,
                    fontWeight: 900,
                }}
            >
                0{index}
            </div>
        </div>
    )
}
