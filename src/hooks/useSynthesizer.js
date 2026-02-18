import { useEffect, useRef, useCallback } from 'react'

export function useSynthesizer() {
    const ctxRef = useRef(null)
    const masterGainRef = useRef(null)
    const engineFilterRef = useRef(null)
    const isInitialized = useRef(false)

    // Initialize Audio Context
    const initAudio = useCallback(() => {
        if (isInitialized.current) return

        const AudioContext = window.AudioContext || window.webkitAudioContext
        const ctx = new AudioContext()
        ctxRef.current = ctx

        // Master Gain
        const masterGain = ctx.createGain()
        masterGain.gain.value = 0.3 // Lower volume to prevent clipping
        masterGain.connect(ctx.destination)
        masterGainRef.current = masterGain

        // --- DRONE LAYER (Background sci-fi hum) ---
        // Two oscillators slightly detuned
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const droneGain = ctx.createGain()

        // Low pass filter
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 120
        engineFilterRef.current = filter

        osc1.type = 'sawtooth'
        osc1.frequency.value = 55 // A1
        osc2.type = 'sine'
        osc2.frequency.value = 57 // Detuned

        osc1.connect(filter)
        osc2.connect(filter)
        filter.connect(droneGain)
        droneGain.connect(masterGain)
        droneGain.gain.value = 0.5

        osc1.start()
        osc2.start()

        isInitialized.current = true
    }, [])

    // Modulate sound based on velocity (Engine Effect)
    const updateEngine = useCallback((velocity) => {
        if (!ctxRef.current || !engineFilterRef.current) return

        const time = ctxRef.current.currentTime
        const speed = Math.min(Math.abs(velocity), 100)

        // Map velocity to filter cutoff (engine revving up)
        // 120Hz -> 800Hz
        const targetFreq = 120 + (speed * 15)

        engineFilterRef.current.frequency.setTargetAtTime(targetFreq, time, 0.1)
    }, [])

    // UI Sounds
    const playHoverSound = useCallback(() => {
        if (!ctxRef.current) return
        const ctx = ctxRef.current
        const t = ctx.currentTime

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(masterGainRef.current)

        // High tech chirp
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1200, t)
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1)

        gain.gain.setValueAtTime(0.05, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)

        osc.start(t)
        osc.stop(t + 0.1)
    }, [])

    return {
        initAudio,
        updateEngine,
        playHoverSound,
        isInitialized
    }
}
