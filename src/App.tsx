import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import GameScene from './components/GameScene'
import GameUI from './components/GameUI'
import StartScreen from './components/StartScreen'
import MobileControls from './components/MobileControls'
import { GameProvider, useGame } from './contexts/GameContext'

// Key mapping for controls
export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  jump: 'jump',
  run: 'run',
} as const

const keyboardMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.run, keys: ['ShiftLeft'] },
]

function GameContent() {
  const { gameState, startGame } = useGame()
  const playerRef = useRef<{
    handleMobileMove: (direction: { x: number, z: number }) => void
    handleMobileJump: () => void
    handleMobileRun: (running: boolean) => void
  }>(null)

  const handleMobileMove = (direction: { x: number, z: number }) => {
    if (playerRef.current) {
      playerRef.current.handleMobileMove(direction)
    }
  }

  const handleMobileJump = () => {
    if (playerRef.current) {
      playerRef.current.handleMobileJump()
    }
  }

  const handleMobileRun = (running: boolean) => {
    if (playerRef.current) {
      playerRef.current.handleMobileRun(running)
    }
  }

  if (gameState.gameStarted) {
    return (
      <>
        <KeyboardControls map={keyboardMap}>
          <Canvas 
            shadows 
            camera={{ position: [0, 5, 10], fov: 60 }}
            style={{ height: '100vh', width: '100vw' }}
          >
            <Physics gravity={[0, -30, 0]}>
              <GameScene playerRef={playerRef} />
            </Physics>
          </Canvas>
        </KeyboardControls>
        <GameUI />
        <MobileControls 
          onMove={handleMobileMove}
          onJump={handleMobileJump}
          onRun={handleMobileRun}
        />
      </>
    )
  }

  return <StartScreen onStart={startGame} />
}

function App() {
  return (
    <GameProvider>
      <div className="w-full h-screen bg-black overflow-hidden">
        <GameContent />
      </div>
    </GameProvider>
  )
}

export default App