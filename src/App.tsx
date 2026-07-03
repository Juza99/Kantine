import './i18n'
import { LanguageToggle } from './components/LanguageToggle'
import { HomeScreen } from './screens/HomeScreen'
import { CreateNameScreen } from './screens/CreateNameScreen'
import { JoinScreen } from './screens/JoinScreen'
import { LobbyScreen } from './screens/LobbyScreen'
import { StartingScreen } from './screens/StartingScreen'
import { AnsweringScreen } from './screens/AnsweringScreen'
import { RevealScreen } from './screens/RevealScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import { useGameStore } from './store/gameStore'
import { useRoomConnection } from './hooks/useRoomConnection'

function App() {
  const view = useGameStore((s) => s.view)
  useRoomConnection()

  return (
    <>
      <LanguageToggle />
      {view === 'home' && <HomeScreen />}
      {view === 'createName' && <CreateNameScreen />}
      {view === 'join' && <JoinScreen />}
      {view === 'lobby' && <LobbyScreen />}
      {view === 'starting' && <StartingScreen />}
      {view === 'answering' && <AnsweringScreen />}
      {view === 'reveal' && <RevealScreen />}
      {view === 'gameover' && <GameOverScreen />}
    </>
  )
}

export default App
