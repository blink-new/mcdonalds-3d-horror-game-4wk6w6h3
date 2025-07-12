import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { Vector3 } from 'three'
import { useGame } from '../contexts/GameContext'
import { Text } from '@react-three/drei'
import { toast } from 'react-hot-toast'

interface EnemyProps {
  position: [number, number, number]
  type: 'ronald' | 'grimace'
}

export default function Enemy({ position: initialPosition, type }: EnemyProps) {
  const { gameState, getCapured, increaseFear } = useGame()
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: initialPosition,
    args: [0.8],
    type: 'Kinematic',
  }))

  const position = useRef(initialPosition)
  const [isChasing, setIsChasing] = useState(false)
  const [detectionRadius] = useState(8)
  const [speed] = useState(2 + gameState.difficulty * 0.5)

  // Subscribe to position changes
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => (position.current = p))
    return unsubscribe
  }, [api])

  useFrame((state) => {
    const playerPos = gameState.playerPosition
    const enemyPos = position.current
    
    // Calculate distance to player
    const distance = Math.sqrt(
      Math.pow(playerPos[0] - enemyPos[0], 2) +
      Math.pow(playerPos[2] - enemyPos[2], 2)
    )
    
    // Detection and chasing logic
    if (distance < detectionRadius) {
      setIsChasing(true)
      increaseFear() // Increase fear when enemy is nearby
      
      // Move towards player
      const direction = new Vector3(
        playerPos[0] - enemyPos[0],
        0,
        playerPos[2] - enemyPos[2]
      ).normalize()
      
      api.velocity.set(
        direction.x * speed,
        0,
        direction.z * speed
      )
      
      // Capture player if very close
      if (distance < 1.5) {
        getCapured()
        toast.error(
          `${type === 'ronald' ? '🤡 Ronald McDonald' : '💜 Grimace'} caught you! You must now wear diapers forever! 👶`,
          { duration: 4000 }
        )
      }
    } else {
      setIsChasing(false)
      // Patrol behavior - simple back and forth
      const time = state.clock.elapsedTime
      const patrolSpeed = 1
      api.velocity.set(
        Math.sin(time + initialPosition[0]) * patrolSpeed,
        0,
        Math.cos(time + initialPosition[2]) * patrolSpeed
      )
    }
  })

  const enemyConfig = {
    ronald: {
      color: '#ff0000',
      emissive: '#aa0000',
      emoji: '🤡',
      name: 'RONALD',
    },
    grimace: {
      color: '#800080',
      emissive: '#440044',
      emoji: '💜',
      name: 'GRIMACE',
    },
  }

  const config = enemyConfig[type]

  return (
    <group>
      {/* Enemy body */}
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.8]} />
        <meshStandardMaterial 
          color={config.color} 
          emissive={config.emissive}
          emissiveIntensity={isChasing ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Enemy head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial 
          color={config.color} 
          emissive={config.emissive}
          emissiveIntensity={isChasing ? 0.3 : 0.05}
        />
      </mesh>
      
      {/* Enemy name tag */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color={isChasing ? "#ff0000" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {config.emoji} {config.name} {config.emoji}
      </Text>
      
      {/* Chasing indicator */}
      {isChasing && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.3}
          color="#ff0000"
          anchorX="center"
          anchorY="middle"
        >
          👀 HUNTING YOU! 👀
        </Text>
      )}
      
      {/* Spooky light effect */}
      <pointLight 
        position={[0, 1, 0]} 
        intensity={isChasing ? 1 : 0.3} 
        color={config.color} 
        distance={isChasing ? 8 : 3}
      />
    </group>
  )
}