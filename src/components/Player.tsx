import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useSphere } from '@react-three/cannon'
import { Vector3 } from 'three'

import { useGame } from '../contexts/GameContext'

interface PlayerMethods {
  handleMobileMove: (direction: { x: number, z: number }) => void
  handleMobileJump: () => void
  handleMobileRun: (running: boolean) => void
}

const Player = forwardRef<PlayerMethods>((props, ref) => {
  const { gameState, updatePlayerPosition, updateStamina, setRunning, decreaseFear } = useGame()
  const [, get] = useKeyboardControls()
  
  // Mobile control states
  const [mobileMovement, setMobileMovement] = useState({ x: 0, z: 0 })
  const [mobileJump, setMobileJump] = useState(false)
  const [mobileRun, setMobileRun] = useState(false)
  
  const [sphereRef, api] = useSphere(() => ({
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

  // Mobile control handlers
  const handleMobileMove = (direction: { x: number, z: number }) => {
    setMobileMovement(direction)
  }

  const handleMobileJump = () => {
    setMobileJump(true)
    setTimeout(() => setMobileJump(false), 100)
  }

  const handleMobileRun = (running: boolean) => {
    setMobileRun(running)
  }

  // Expose mobile controls to parent
  useImperativeHandle(ref, () => ({
    handleMobileMove,
    handleMobileJump,
    handleMobileRun,
  }))

  useFrame((state) => {
    const { forward, back, left, right, jump, run } = get()
    
    // Combine keyboard and mobile inputs
    const keyboardX = (left ? 1 : 0) - (right ? 1 : 0)
    const keyboardZ = (forward ? 1 : 0) - (back ? 1 : 0)
    const combinedX = keyboardX + mobileMovement.x
    const combinedZ = keyboardZ + mobileMovement.z
    
    const shouldJump = jump || mobileJump
    const shouldRun = (run || mobileRun) && gameState.stamina > 0
    
    setRunning(shouldRun)
    
    // Movement speed
    const speed = shouldRun ? 8 : 5
    
    // Calculate movement direction
    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, -combinedZ)
    const sideVector = new Vector3(-combinedX, 0, 0)
    
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed)
    
    // Apply movement
    api.velocity.set(direction.x, velocity.current[1], direction.z)
    
    // Jumping
    if (shouldJump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2])
    }
    
    // Update stamina
    if (shouldRun) {
      updateStamina(gameState.stamina - 20) // Drain stamina when running
    } else if (gameState.stamina < 100) {
      updateStamina(gameState.stamina + 10) // Regenerate stamina when not running
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
      0.1
    )
    
    state.camera.lookAt(position.current[0], position.current[1], position.current[2])
  })

  return (
    <group>
      {/* Player body */}
      <mesh ref={sphereRef} castShadow>
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
})

Player.displayName = 'Player'

export default Player