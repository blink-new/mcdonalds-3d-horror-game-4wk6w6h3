import React from 'react'
import { useBox } from '@react-three/cannon'
import { Text } from '@react-three/drei'

// Floor component
function Floor() {
  const [ref] = useBox(() => ({
    args: [50, 1, 50],
    position: [0, -0.5, 0],
    type: 'Static',
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[50, 1, 50]} />
      <meshStandardMaterial color="#ffcc00" />
    </mesh>
  )
}

// Wall component
function Wall({ position, args }: { position: [number, number, number]; args: [number, number, number] }) {
  const [ref] = useBox(() => ({
    args,
    position,
    type: 'Static',
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#cc0000" />
    </mesh>
  )
}

// Counter component
function Counter({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    args: [8, 2, 1],
    position,
    type: 'Static',
  }))

  return (
    <group>
      <mesh ref={ref} castShadow receiveShadow position={position}>
        <boxGeometry args={[8, 2, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <Text
        position={[position[0], position[1] + 1.5, position[2] + 0.6]}
        fontSize={0.5}
        color="#ffcc00"
        anchorX="center"
        anchorY="middle"
      >
        🍟 ORDER HERE 🍟
      </Text>
    </group>
  )
}

// Table component
function Table({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    args: [2, 1.5, 2],
    position,
    type: 'Static',
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow position={position}>
      <boxGeometry args={[2, 1.5, 2]} />
      <meshStandardMaterial color="#ffcc00" />
    </mesh>
  )
}

// Play structure
function PlayStructure({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    args: [6, 4, 6],
    position,
    type: 'Static',
  }))

  return (
    <group>
      <mesh ref={ref} castShadow receiveShadow position={position}>
        <boxGeometry args={[6, 4, 6]} />
        <meshStandardMaterial color="#ff6666" />
      </mesh>
      <Text
        position={[position[0], position[1] + 2.5, position[2]]}
        fontSize={0.8}
        color="#ffcc00"
        anchorX="center"
        anchorY="middle"
      >
        🎪 PLAY AREA 🎪
      </Text>
    </group>
  )
}

// Spooky decorations
function SpookyDecoration({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Text
      position={position}
      fontSize={0.8}
      color="#ff0000"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}

export default function McdonaldsEnvironment() {
  return (
    <group>
      {/* Floor */}
      <Floor />
      
      {/* Walls */}
      <Wall position={[0, 5, -25]} args={[50, 10, 1]} />  {/* Back wall */}
      <Wall position={[0, 5, 25]} args={[50, 10, 1]} />   {/* Front wall */}
      <Wall position={[-25, 5, 0]} args={[1, 10, 50]} />  {/* Left wall */}
      <Wall position={[25, 5, 0]} args={[1, 10, 50]} />   {/* Right wall */}
      
      {/* McDonald's Counter */}
      <Counter position={[0, 1, -20]} />
      
      {/* Tables scattered around */}
      <Table position={[-10, 0.75, -5]} />
      <Table position={[8, 0.75, -8]} />
      <Table position={[-15, 0.75, 10]} />
      <Table position={[12, 0.75, 15]} />
      <Table position={[0, 0.75, 5]} />
      
      {/* Play structure */}
      <PlayStructure position={[15, 2, -10]} />
      
      {/* Spooky McDonald's decorations */}
      <SpookyDecoration position={[0, 8, -24]} text="🍟 I'M LOVIN' IT... FOREVER 🍟" />
      <SpookyDecoration position={[-20, 6, 0]} text="👻 McDONALD'S 👻" />
      <SpookyDecoration position={[20, 6, 0]} text="🎪 HAPPY MEAL NIGHTMARES 🎪" />
      <SpookyDecoration position={[0, 3, 20]} text="🚪 EXIT... IF YOU CAN 🚪" />
      
      {/* Additional atmospheric elements */}
      <Text
        position={[0, 9, 0]}
        fontSize={1.5}
        color="#ffcc00"
        anchorX="center"
        anchorY="middle"
      >
        🍟 McDONALD'S NIGHTMARE 🍟
      </Text>
      
      {/* Hidden collectibles */}
      <mesh position={[-18, 1, -18]} castShadow>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.3} />
      </mesh>
      
      <mesh position={[18, 1, 18]} castShadow>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}