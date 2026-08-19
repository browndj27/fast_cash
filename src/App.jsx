import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import ModeScreen from "./screens/ModeScreen";
import PositionScreen from "./screens/PositionScreen";
import GameScreen from "./screens/game/GameScreen";
import ResultsScreen from "./screens/ResultsScreen";
import SkillsGameScreen from "./screens/skills/SkillsGameScreen";
import SkillsResultsScreen from "./screens/skills/SkillsResultsScreen";
import WheelGameScreen from "./screens/wheel/WheelGameScreen";
import SoloWheelGameScreen from "./screens/wheel/SoloWheelGameScreen";
import SoloSeasonResultsScreen from "./screens/wheel/SoloSeasonResultsScreen";

// Skills Cash and Spin the NFL Wheel both draft the same fixed QB/RB/WR/TE/
// FLEX roster, so neither needs the single-position picker Fast Cash uses.
const SKIPS_POSITION_SCREEN = new Set(["skills", "wheel"]);

export default function App() {
  const [screen, setScreen] = useState("home");
  const [gameMode, setGameMode] = useState("fastcash");
  const [vsAI, setVsAI] = useState(false);
  const [position, setPosition] = useState(null);
  const [finalPayload, setFinalPayload] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  function resetToHome() {
    setScreen("home");
    setGameMode("fastcash");
    setVsAI(false);
    setPosition(null);
    setFinalPayload(null);
  }

  function resetGame() {
    setGameKey((k) => k + 1);
  }

  function startMode(mode) {
    setGameMode(mode);
    if (mode === "solo") {
      // Solo Season has no opponent to pick — go straight to the draft.
      setGameKey((k) => k + 1);
      setScreen("game");
    } else {
      setScreen("mode");
    }
  }

  if (screen === "home") {
    return (
      <HomeScreen
        onStart={() => startMode("fastcash")}
        onStartSkills={() => startMode("skills")}
        onStartWheel={() => startMode("wheel")}
        onStartSolo={() => startMode("solo")}
      />
    );
  }

  if (screen === "mode") {
    return (
      <ModeScreen
        onSelect={(isAI) => {
          setVsAI(isAI);
          if (SKIPS_POSITION_SCREEN.has(gameMode)) {
            setGameKey((k) => k + 1);
            setScreen("game");
          } else {
            setScreen("position");
          }
        }}
        onBack={() => setScreen("home")}
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
        onBack={() => setScreen("mode")}
      />
    );
  }

  if (screen === "game") {
    const onGameOver = (payload) => {
      setFinalPayload(payload);
      setScreen("results");
    };

    if (gameMode === "solo") {
      return (
        <SoloWheelGameScreen
          key={gameKey}
          onGameOver={onGameOver}
          onResetGame={resetGame}
          onFullRestart={resetToHome}
        />
      );
    }

    if (gameMode === "skills") {
      return (
        <SkillsGameScreen
          key={gameKey}
          vsAI={vsAI}
          onGameOver={onGameOver}
          onResetGame={resetGame}
          onFullRestart={resetToHome}
        />
      );
    }

    if (gameMode === "wheel") {
      return (
        <WheelGameScreen
          key={gameKey}
          vsAI={vsAI}
          onGameOver={onGameOver}
          onResetGame={resetGame}
          onFullRestart={resetToHome}
        />
      );
    }

    return (
      <GameScreen
        key={gameKey}
        position={position}
        vsAI={vsAI}
        onGameOver={onGameOver}
        onResetGame={resetGame}
        onFullRestart={resetToHome}
      />
    );
  }

  if (screen === "results") {
    if (gameMode === "solo") {
      return <SoloSeasonResultsScreen roster={finalPayload} onBackToHome={resetToHome} />;
    }

    if (gameMode === "skills" || gameMode === "wheel") {
      return <SkillsResultsScreen rosters={finalPayload} vsAI={vsAI} onBackToHome={resetToHome} />;
    }

    return (
      <ResultsScreen
        rosters={finalPayload}
        position={position}
        vsAI={vsAI}
        onBackToHome={resetToHome}
      />
    );
  }

  return null;
}
