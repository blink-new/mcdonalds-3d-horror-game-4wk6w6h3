import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-red-900 via-red-800 to-black">
      <div className="text-center space-y-8 max-w-2xl px-6">
        {/* McDonald's Horror Logo */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg">
            🍟 McDONALD'S
          </h1>
          <h2 className="text-4xl font-bold text-red-500 drop-shadow-lg animate-pulse">
            NIGHTMARE ESCAPE
          </h2>
        </div>

        {/* Game Description Card */}
        <Card className="bg-black/80 border-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-red-400 text-2xl">🎭 The Horror Awaits</CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Welcome to the most twisted McDonald's you've ever seen...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="space-y-2">
              <h3 className="text-yellow-400 font-semibold">📖 Your Mission:</h3>
              <p className="text-gray-200">
                Survive and escape the haunted McDonald's restaurant. Avoid the possessed mascots 
                roaming the halls, solve puzzles, and find your way to freedom.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-yellow-400 font-semibold">⚠️ The Twist:</h3>
              <p className="text-orange-200 font-medium">
                If you get caught, you don't lose the game... but you'll be cursed to wear 
                diapers FOREVER! The humiliation continues as you keep playing!
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-yellow-400 font-semibold">🎮 Controls:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div>• WASD / Arrow Keys: Move</div>
                <div>• Space: Jump</div>
                <div>• Shift: Run (uses stamina)</div>
                <div>• Mouse: Look around</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <Button 
          onClick={onStart}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          🍟 ENTER THE NIGHTMARE 🍟
        </Button>

        {/* Warning */}
        <p className="text-yellow-300 text-sm animate-pulse">
          ⚡ Warning: This game contains horror elements and diaper-related humor
        </p>
      </div>
    </div>
  )
}