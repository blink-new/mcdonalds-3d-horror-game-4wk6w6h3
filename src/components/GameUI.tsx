import React from 'react'
import { useGame } from '../contexts/GameContext'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Card } from './ui/card'

export default function GameUI() {
  const { gameState } = useGame()

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Left side stats */}
        <Card className="bg-black/80 text-white p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💰</span>
            <span>Score: {gameState.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400">❤️</span>
            <span>Lives: {gameState.lives}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">🏆</span>
            <span>Survived: {gameState.timesSurvived}</span>
          </div>
        </Card>

        {/* Center status */}
        <div className="flex flex-col items-center gap-2">
          {gameState.wearingDiapers && (
            <Badge variant="destructive" className="bg-pink-600 text-white text-lg px-4 py-2 animate-pulse">
              👶 WEARING DIAPERS! 👶
            </Badge>
          )}
          
          {gameState.fearLevel > 50 && (
            <Badge variant="destructive" className="bg-purple-600 text-white animate-pulse">
              😱 TERRIFIED!
            </Badge>
          )}
        </div>

        {/* Right side - difficulty */}
        <Card className="bg-black/80 text-white p-4">
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🔥</span>
            <span>Level: {gameState.difficulty}</span>
          </div>
        </Card>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-center">
          <Card className="bg-black/80 text-white p-4 space-y-3 w-96">
            {/* Stamina Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">⚡ Stamina</span>
                <span>{gameState.stamina}%</span>
              </div>
              <Progress 
                value={gameState.stamina} 
                className="h-2"
              />
            </div>

            {/* Fear Level */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-purple-400">😨 Fear</span>
                <span>{gameState.fearLevel}%</span>
              </div>
              <Progress 
                value={gameState.fearLevel} 
                className="h-2"
              />
            </div>

            {/* Current Action */}
            <div className="text-center text-sm">
              {gameState.isRunning && gameState.stamina > 0 && (
                <span className="text-green-400 animate-pulse">🏃 RUNNING</span>
              )}
              {gameState.stamina === 0 && (
                <span className="text-red-400 animate-pulse">😵 EXHAUSTED</span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Game Over Effects */}
      {gameState.wearingDiapers && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-bounce opacity-20">
              👶
            </div>
          </div>
        </div>
      )}

      {/* Vignette effect based on fear */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, transparent ${100 - gameState.fearLevel}%, rgba(139, 0, 0, 0.${Math.floor(gameState.fearLevel / 10)}) 100%)`,
        }}
      />
    </div>
  )
}