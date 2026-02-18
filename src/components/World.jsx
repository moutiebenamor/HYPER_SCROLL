import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Lenis from 'lenis'
import Card from './Card'
import Hud from './Hud'

// --- CONFIGURATION ---
const CONFIG = {
    itemCount: 20,
    starCount: 150,
    zGap: 800,
    loopSize: 0,
    camSpeed: 2.5,
    colors: ['#ff003c', '#00f3ff', '#ccff00', '#ffffff'],
}
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap

const TEXTS = [
    'IMPACT', 'VELOCITY', 'BRUTAL', 'SYSTEM', 'FUTURE',
    'DESIGN', 'PIXEL', 'HYPER', 'NEON', 'VOID',
]

// Pre-generate stable random data for cards so they don't change on re-render
function generateItemsData() {
    const data = []
    for (let i = 0; i < CONFIG.itemCount; i++) {
        const isHeading = i % 4 === 0
        if (isHeading) {
            data.push({
                type: 'text',
                text: TEXTS[i % TEXTS.length],
                x: 0,
                y: 0,
                rot: 0,
                baseZ: -i * CONFIG.zGap,
            })
        } else {
            const angle = (i / CONFIG.itemCount) * Math.PI * 6
            const x = Math.cos(angle) * (window.innerWidth * 0.3)
            const y = Math.sin(angle) * (window.innerHeight * 0.3)
            const rot = (Math.random() - 0.5) * 30
            data.push({
                type: 'card',
                text: TEXTS[i % TEXTS.length],
                cardId: Math.floor(Math.random() * 9999),
                grid: `${Math.floor(Math.random() * 10)}x${Math.floor(Math.random() * 10)}`,
                dataSize: (Math.random() * 100).toFixed(1),
                index: i,
                x, y, rot,
                baseZ: -i * CONFIG.zGap,
            })
        }
    }
    // Stars
    for (let i = 0; i < CONFIG.starCount; i++) {
        data.push({
            type: 'star',
            x: (Math.random() - 0.5) * 3000,
            y: (Math.random() - 0.5) * 3000,
            baseZ: -Math.random() * CONFIG.loopSize,
        })
    }
    return data
}

export default function World({ updateEngine, playHoverSound }) {
    const worldRef = useRef(null)
    const viewportRef = useRef(null)
    const itemRefs = useRef([])
    const stateRef = useRef({
        scroll: 0,
        velocity: 0,
        targetSpeed: 0,
        mouseX: 0,
        mouseY: 0,
    })

    const [hudData, setHudData] = useState({ fps: 60, velocity: '0.00', coord: '000' })

    // Generate items data once
    const itemsData = useMemo(() => generateItemsData(), [])

    useEffect(() => {
        const state = stateRef.current
        const world = worldRef.current
        const viewport = viewportRef.current
        const els = itemRefs.current

        // Mouse tracking
        const handleMouseMove = (e) => {
            state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
            state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('mousemove', handleMouseMove)

        // Lenis
        const lenis = new Lenis({
            smooth: true,
            lerp: 0.08,
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothTouch: true,
        })

        lenis.on('scroll', ({ scroll, velocity }) => {
            state.scroll = scroll
            state.targetSpeed = velocity
        })

        // RAF loop
        let lastTime = 0
        let frameCount = 0

        function raf(time) {
            lenis.raf(time)

            // FPS
            const delta = time - lastTime
            lastTime = time
            frameCount++

            // Smooth Velocity
            state.velocity += (state.targetSpeed - state.velocity) * 0.1

            // AUDIO MODULATION
            if (updateEngine) updateEngine(state.velocity)

            // Update HUD ~every 10 frames to avoid over-rendering
            if (frameCount % 10 === 0) {
                setHudData({
                    fps: Math.round(1000 / delta),
                    velocity: Math.abs(state.velocity).toFixed(2),
                    coord: state.scroll.toFixed(0),
                })
            }

            // --- RENDER LOGIC ---

            // 1. Camera Tilt & Shake
            const tiltX = state.mouseY * 5 - state.velocity * 0.5
            const tiltY = state.mouseX * 5

            world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`

            // 2. Dynamic Perspective (Warp)
            const baseFov = 1000
            const fov = baseFov - Math.min(Math.abs(state.velocity) * 10, 600)
            viewport.style.perspective = `${fov}px`

            // 3. Item Loop
            const cameraZ = state.scroll * CONFIG.camSpeed

            itemsData.forEach((item, idx) => {
                const el = els[idx]
                if (!el) return

                let relZ = item.baseZ + cameraZ
                const modC = CONFIG.loopSize

                let vizZ = ((relZ % modC) + modC) % modC
                if (vizZ > 500) vizZ -= modC

                // Opacity
                let alpha = 1
                if (vizZ < -3000) alpha = 0
                else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000

                if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 400)
                if (alpha < 0) alpha = 0

                el.style.opacity = alpha

                if (alpha > 0) {
                    let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`

                    if (item.type === 'star') {
                        const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.1, 10))
                        trans += ` scale3d(1, 1, ${stretch})`
                    } else if (item.type === 'text') {
                        trans += ` rotateZ(${item.rot}deg)`
                        if (Math.abs(state.velocity) > 1) {
                            const offset = state.velocity * 2
                            el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 cyan`
                        } else {
                            el.style.textShadow = 'none'
                        }
                    } else {
                        const t = time * 0.001
                        const float = Math.sin(t + item.x) * 10
                        trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`
                    }

                    el.style.transform = trans
                }
            })

            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            lenis.destroy()
        }
    }, [itemsData, updateEngine])

    return (
        <>
            <Hud fps={hudData.fps} velocity={hudData.velocity} coord={hudData.coord} />

            <div className="viewport" ref={viewportRef}>
                <div className="world" ref={worldRef}>
                    {itemsData.map((item, i) => {
                        if (item.type === 'text') {
                            return (
                                <div
                                    key={`text-${i}`}
                                    className="item"
                                    ref={(el) => { itemRefs.current[i] = el }}
                                >
                                    <div className="big-text">{item.text}</div>
                                </div>
                            )
                        } else if (item.type === 'card') {
                            return (
                                <div
                                    key={`card-${i}`}
                                    className="item"
                                    ref={(el) => { itemRefs.current[i] = el }}
                                    onMouseEnter={playHoverSound}
                                >
                                    <Card
                                        id={item.cardId}
                                        title={item.text}
                                        grid={item.grid}
                                        dataSize={item.dataSize}
                                        index={item.index}
                                    />
                                </div>
                            )
                        } else {
                            return (
                                <div
                                    key={`star-${i}`}
                                    className="star"
                                    ref={(el) => { itemRefs.current[i] = el }}
                                />
                            )
                        }
                    })}
                </div>
            </div>

            <div className="scroll-proxy" />
        </>
    )
}
