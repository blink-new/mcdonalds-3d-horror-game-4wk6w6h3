import React, { useRef, useState, useEffect } from 'react'
import { Button } from './ui/button'

interface MobileControlsProps {
  onMove: (direction: { x: number, z: number }) => void
  onJump: () => void
  onRun: (running: boolean) => void
}



export default function MobileControls({ onMove, onJump, onRun }: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    window.innerWidth <= 768
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Don't render on desktop
  if (!isMobile) return null

  const handleJoystickStart = () => {
    setIsDragging(true)
  }

  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!isDragging || !joystickRef.current) return

    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = rect.width / 2 - 20
    
    if (distance <= maxDistance) {
      setJoystickPosition({ x: deltaX, y: deltaY })
    } else {
      const angle = Math.atan2(deltaY, deltaX)
      setJoystickPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      })
    }
    
    // Convert to movement direction
    const normalizedX = joystickPosition.x / maxDistance
    const normalizedZ = joystickPosition.y / maxDistance
    onMove({ x: normalizedX, z: normalizedZ })
  }

  const handleJoystickEnd = () => {
    setIsDragging(false)
    setJoystickPosition({ x: 0, y: 0 })
    onMove({ x: 0, z: 0 })
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleJoystickStart()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleJoystickMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleJoystickEnd()
  }

  // Mouse events for testing
  const handleMouseDown = () => {
    handleJoystickStart()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleJoystickMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleJoystickEnd()
  }

  const toggleRun = () => {
    const newRunning = !isRunning
    setIsRunning(newRunning)
    onRun(newRunning)
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Virtual Joystick */}
      <div className="absolute bottom-20 left-6 pointer-events-auto">
        <div 
          ref={joystickRef}
          className="relative w-24 h-24 bg-black/40 rounded-full border-2 border-white/30 backdrop-blur-sm"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Joystick knob */}
          <div 
            className="absolute w-8 h-8 bg-white/80 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px) translate(-50%, -50%)`
            }}
          />
          
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-white/60 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Joystick label */}
        <p className="text-white/70 text-xs text-center mt-2 font-medium">MOVE</p>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 right-6 flex flex-col gap-4 pointer-events-auto">
        {/* Jump Button */}
        <Button
          onTouchStart={onJump}
          onMouseDown={onJump}
          className="w-16 h-16 rounded-full bg-green-600/80 hover:bg-green-700 border-2 border-white/30 backdrop-blur-sm text-white text-2xl"
        >
          ⬆️
        </Button>
        
        {/* Run Toggle Button */}
        <Button
          onTouchStart={toggleRun}
          onMouseDown={toggleRun}
          className={`w-16 h-16 rounded-full border-2 border-white/30 backdrop-blur-sm text-white text-xl ${
            isRunning 
              ? 'bg-orange-600/80 hover:bg-orange-700' 
              : 'bg-blue-600/80 hover:bg-blue-700'
          }`}
        >
          {isRunning ? '🏃' : '🚶'}
        </Button>
      </div>

      {/* Control Labels */}
      <div className="absolute bottom-4 right-6 pointer-events-auto">
        <div className="text-white/70 text-xs text-right space-y-1">
          <p>⬆️ JUMP</p>
          <p>{isRunning ? '🏃 RUN' : '🚶 WALK'}</p>
        </div>
      </div>

      {/* Mobile UI Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
          📱 Mobile Mode
        </div>
      </div>
    </div>
  )
}