import React from 'react'
import Overlays from './components/Overlays'
import World from './components/World'
import AudioController from './components/AudioController'
import { useSynthesizer } from './hooks/useSynthesizer'

export default function App() {
    const { initAudio, updateEngine, playHoverSound } = useSynthesizer()

    return (
        <>
            <AudioController onInit={initAudio} />
            <Overlays />
            <World updateEngine={updateEngine} playHoverSound={playHoverSound} />
        </>
    )
}
