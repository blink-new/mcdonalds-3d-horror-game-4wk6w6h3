import React, { createContext, useContext, useState, useCallback } from 'react'

interface GameState {
  gameStarted: boolean
  score: number
  lives: number
  wearingDiapers: boolean
  timesSurvived: number
  difficulty: number
  playerPosition: [number, number, number]
  isRunning: boolean
  stamina: number
  fearLevel: number
}

interface GameContextValue {
  gameState: GameState
  startGame: () => void
  restartGame: () => void
  updatePlayerPosition: (position: [number, number, number]) => void
  increaseFear: () => void
  decreaseFear: () => void
  getCapured: () => void
  updateStamina: (value: number) => void
  setRunning: (running: boolean) => void
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

const initialGameState: GameState = {
  gameStarted: false,
  score: 0,
  lives: 3,
  wearingDiapers: false,
  timesSurvived: 0,
  difficulty: 1,
  playerPosition: [0, 1, 0],
  isRunning: false,
  stamina: 100,
  fearLevel: 0,
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStarted: true }))
  }, [])

  const restartGame = useCallback(() => {
    setGameState(prev => ({
      ...initialGameState,
      wearingDiapers: prev.wearingDiapers, // Keep diaper status
      timesSurvived: prev.timesSurvived,
      difficulty: Math.min(prev.difficulty + 0.5, 5), // Increase difficulty
    }))
  }, [])

  const updatePlayerPosition = useCallback((position: [number, number, number]) => {
    setGameState(prev => ({ ...prev, playerPosition: position }))
  }, [])

  const increaseFear = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      fearLevel: Math.min(prev.fearLevel + 5, 100) 
    }))
  }, [])

  const decreaseFear = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      fearLevel: Math.max(prev.fearLevel - 1, 0) 
    }))
  }, [])

  const getCapured = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      wearingDiapers: true,
      fearLevel: 0,
      stamina: 100,
    }))
  }, [])

  const updateStamina = useCallback((value: number) => {
    setGameState(prev => ({ 
      ...prev, 
      stamina: Math.max(0, Math.min(100, value)) 
    }))
  }, [])

  const setRunning = useCallback((running: boolean) => {
    setGameState(prev => ({ ...prev, isRunning: running }))
  }, [])

  const value: GameContextValue = {
    gameState,
    startGame,
    restartGame,
    updatePlayerPosition,
    increaseFear,
    decreaseFear,
    getCapured,
    updateStamina,
    setRunning,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}