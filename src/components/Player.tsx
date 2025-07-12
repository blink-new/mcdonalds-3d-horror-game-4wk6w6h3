import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useSphere } from '@react-three/cannon'
import { Vector3 } from 'three'

import { useGame } from '../contexts/GameContext'


export default function Player() {
  const { gameState, updatePlayerPosition, updateStamina, setRunning, decreaseFear } = useGame()
  const [, get] = useKeyboardControls()
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 1, 0],
    args: [0.5],
  }))

  const velocity = useRef([0, 0, 0])
  const position = useRef([0, 1, 0])

  // Subscribe to velocity and position changes
  useEffect(() => {
    const unsubscribeVelocity = api.velocity.subscribe((v) => (velocity.current = v))
    const unsubscribePosition = api.position.subscribe((p) => {
      position.current = p
      updatePlayerPosition([p[0], p[1], p[2]])
    })
    
    return () => {
      unsubscribeVelocity()
      unsubscribePosition()
    }
  }, [api, updatePlayerPosition])

  useFrame((state, delta) => {
    const { forward, back, left, right, jump, run } = get()
    
    const isRunning = run && gameState.stamina > 0
    setRunning(isRunning)
    
    // Movement speed
    const speed = isRunning ? 8 : 5
    
    // Calculate movement direction
    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, (back ? 1 : 0) - (forward ? 1 : 0))
    const sideVector = new Vector3((left ? 1 : 0) - (right ? 1 : 0), 0, 0)
    
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed)
    
    // Apply movement
    api.velocity.set(direction.x, velocity.current[1], direction.z)
    
    // Jumping
    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2])
    }
    
    // Update stamina
    if (isRunning) {
      updateStamina(gameState.stamina - delta * 20) // Drain stamina when running
    } else if (gameState.stamina < 100) {
      updateStamina(gameState.stamina + delta * 10) // Regenerate stamina when not running
    }
    
    // Slowly decrease fear when moving
    if (direction.length() > 0) {
      decreaseFear()
    }
    
    // Camera follow (third person)
    state.camera.position.lerp(
      new Vector3(
        position.current[0] + 5,
        position.current[1] + 3,
        position.current[2] + 5
      ),
      delta * 2
    )
    
    state.camera.lookAt(position.current[0], position.current[1], position.current[2])
  })

  return (
    <group>
      {/* Player body */}
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={gameState.wearingDiapers ? "#ffb3d9" : "#4169E1"} />
      </mesh>
      
      {/* Player head */}
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#FFE4B5" />
      </mesh>
      
      {/* Diaper indicator */}
      {gameState.wearingDiapers && (
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
      
      {/* Player indicator light */}
      <pointLight 
        position={[0, 2, 0]} 
        intensity={0.5} 
        color={gameState.wearingDiapers ? "#ff69b4" : "#4169E1"} 
        distance={3}
      />
    </group>
  )
}