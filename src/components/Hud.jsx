import React from 'react'

export default function Hud({ fps, velocity, coord }) {
    return (
        <div className="hud">
            <div className="hud-top">
                <span>SYS.READY</span>
                <div className="hud-line" />
                <span>
                    FPS: <strong>{fps}</strong>
                </span>
            </div>

            <div
                className="center-nav"
                style={{
                    alignSelf: 'flex-start',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                }}
            >
                SCROLL VELOCITY // <strong>{velocity}</strong>
            </div>

            <div className="hud-bottom">
                <span>
                    COORD: <strong>{coord}</strong>
                </span>
                <div className="hud-line" />
                <span>VER 2.0.4 [BETA]</span>
            </div>
        </div>
    )
}
