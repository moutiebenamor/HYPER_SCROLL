# HYPER SCROLL // BRUTAL MODE

> A cinematic 3D scroll experience built with **React**, **Vite**, and the **Web Audio API**.

![Hyper Scroll Preview](https://opengraph.githubassets.com/1/moutiebenamor/HYPER_SCROLL)

## 🌐 Overview

**Hyper Scroll** turns a standard webpage into an immersive journey. As you scroll, the world reacts:
- **Visuals**: A 3D parallax environment with floating glassmorphism cards.
- **Motion**: Simulated camera weight, tilt, and perspective warping based on velocity.
- **Audio**: A real-time procedural sound engine that "revs up" the background drone and pitch as you scroll faster.

## ✨ Features

- **Tech Stack**: React 19, Vite, Vanilla CSS.
- **Smooth Scrolling**: Integrated [Lenis](https://github.com/studio-freight/lenis) for silky smooth inertia.
- **Procedural Audio**: No MP3s. Background drones and UI effects are synthesized in real-time using the **Web Audio API**.
- **Post-Processing**: Pure CSS scanlines, vignette, and grain overlays for a retro-futuristic aesthetic.
- **Performance**: Optimized `requestAnimationFrame` loop driving CSS Transforms directly (bypassing React state for 60fps animations).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/moutiebenamor/HYPER_SCROLL.git
   cd HYPER_SCROLL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎧 Audio System

The project features a custom `useSynthesizer` hook that creates:
- **Drone Layer**: Dual oscillators (Sawtooth + Sine) slightly detuned for texture.
- **Velocity Engine**: A Low-pass filter that opens up (120Hz → 800Hz) based on scroll speed.
- **UI FX**: High-frequency sine sweeps when hovering cards.

*Note: You must click "INITIALIZE SYSTEM" on load to enable the AudioContext.*

## 📜 Credits

- Original concept based on [Hyper Scroll](https://codepen.io/aleksa-rakocevic/pen/pvbboZx) by Aleksa Rakocevic.
- Refactored to React & Enhanced by **Moutie Ben Amor**.

## 📄 License

MIT License.
