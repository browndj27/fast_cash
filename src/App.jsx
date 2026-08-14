import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import ModeScreen from "./screens/ModeScreen";
import PositionScreen from "./screens/PositionScreen";
import GameScreen from "./screens/game/GameScreen";
import ResultsScreen from "./screens/ResultsScreen";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [vsAI, setVsAI] = useState(false);
  const [position, setPosition] = useState(null);
  const [finalRosters, setFinalRosters] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  function resetToHome() {
    setScreen("home");
    setVsAI(false);
    setPosition(null);
    setFinalRosters(null);
  }

  function resetGame() {
    setGameKey((k) => k + 1);
  }

  if (screen === "home") {
    return <HomeScreen onStart={() => setScreen("mode")} />;
  }

  if (screen === "mode") {
    return (
      <ModeScreen
        onSelect={(isAI) => {
          setVsAI(isAI);
          setScreen("position");
        }}
      />
    );
  }

  if (screen === "position") {
    return (
      <PositionScreen
        onSelect={(pos) => {
          setPosition(pos);
          setGameKey((k) => k + 1);
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "game") {
    return (
      <GameScreen
        key={gameKey}
        position={position}
        vsAI={vsAI}
        onGameOver={(rosters) => {
          setFinalRosters(rosters);
          setScreen("results");
        }}
        onResetGame={resetGame}
        onFullRestart={resetToHome}
      />
    );
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        rosters={finalRosters}
        position={position}
        vsAI={vsAI}
        onBackToHome={resetToHome}
      />
    );
  }

  return null;
}
