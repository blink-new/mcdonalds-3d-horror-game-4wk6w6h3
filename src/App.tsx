import React from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import GameScene from './components/GameScene'
import GameUI from './components/GameUI'
import StartScreen from './components/StartScreen'
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
              <GameScene />
            </Physics>
          </Canvas>
        </KeyboardControls>
        <GameUI />
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