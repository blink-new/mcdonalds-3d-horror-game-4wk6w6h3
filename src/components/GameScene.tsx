import React, { Suspense } from 'react'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import Player from './Player'
import McdonaldsEnvironment from './McdonaldsEnvironment'
import Enemy from './Enemy'
import { useGame } from '../contexts/GameContext'

interface GameSceneProps {
  playerRef: React.RefObject<{
    handleMobileMove: (direction: { x: number, z: number }) => void
    handleMobileJump: () => void
    handleMobileRun: (running: boolean) => void
  }>
}

export default function GameScene({ playerRef }: GameSceneProps) {
  const { gameState } = useGame()

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ff4444" />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Fog for spooky atmosphere */}
      <fog attach="fog" args={['#330000', 5, 50]} />
      
      <Suspense fallback={null}>
        {/* McDonald's Restaurant Environment */}
        <McdonaldsEnvironment />
        
        {/* Player */}
        <Player ref={playerRef} />
        
        {/* Enemies */}
        <Enemy position={[10, 1, 5]} type="ronald" />
        <Enemy position={[-8, 1, 10]} type="grimace" />
        
        {/* Diaper status indicator in 3D space */}
        {gameState.wearingDiapers && (
          <Text
            position={[0, 8, 0]}
            fontSize={2}
            color="#ff69b4"
            anchorX="center"
            anchorY="middle"
          >
            👶 DIAPER CURSE ACTIVE! 👶
          </Text>
        )}
      </Suspense>
      
      {/* Camera controls (for debugging - remove in final) */}
      <OrbitControls enabled={false} />
    </>
  )
}