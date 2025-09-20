import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sparkles, setSparkles] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [fireworks, setFireworks] = useState([]);
  const [floatingDiyas, setFloatingDiyas] = useState([]);
  const [stickAngle1, setStickAngle1] = useState(0);
  const [stickAngle2, setStickAngle2] = useState(45);
  const [textPulse, setTextPulse] = useState(1);
  const [stars, setStars] = useState([]);
  const [showSparkleToggle, setShowSparkleToggle] = useState(true);
  const [beatIntensity, setBeatIntensity] = useState(1);
  const [danceMode, setDanceMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('traditional');
  const [userScore, setUserScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [wishes, setWishes] = useState([]);
  
  const animationRef = useRef();
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const audioRef = useRef(null);
  
  const colorThemes = {
    traditional: {
      bg: 'linear-gradient(135deg, #581c87 0%, #be185d 50%, #7c2d12 100%)',
      primary: '#FFD700',
      secondary: '#FF6B6B'
    },
    royal: {
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #312e81 100%)',
      primary: '#FFD700',
      secondary: '#8B5CF6'
    },
    festive: {
      bg: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #84cc16 100%)',
      primary: '#FBBF24',
      secondary: '#F87171'
    }
  };

  // Initialize all particles and elements
  useEffect(() => {
    initializeElements();
  }, []);

  const initializeElements = () => {
    // Initialize twinkling stars
    const initialStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 3,
      twinkle: Math.random() * 2 * Math.PI,
      speed: 0.3 + Math.random() * 0.7
    }));
    setStars(initialStars);
    
    // Initialize falling confetti
    const initialConfetti = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * -1000,
      rotation: Math.random() * 360,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF8A95', '#A8E6CF', '#FFD93D'][Math.floor(Math.random() * 8)],
      speed: 1 + Math.random() * 5,
      rotationSpeed: (Math.random() - 0.5) * 20,
      size: 3 + Math.random() * 8,
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    }));
    setConfetti(initialConfetti);
    
    // Initialize floating diyas (like air balloons)
    const initialDiyas = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 200,
      sway: Math.random() * 2 * Math.PI,
      speed: 0.8 + Math.random() * 1.2,
      glow: Math.random() * 2 * Math.PI,
      size: 20 + Math.random() * 15,
      swayAmount: 20 + Math.random() * 30
    }));
    setFloatingDiyas(initialDiyas);
  };

  // Create audio context for beat simulation
  const createAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : 0.1, audioContextRef.current.currentTime);
    }
  }, [isMuted]);

  // Simulate Chogada beats
  const playBeat = useCallback(() => {
    createAudioContext();
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }
    
    oscillatorRef.current = audioContextRef.current.createOscillator();
    oscillatorRef.current.connect(gainNodeRef.current);
    oscillatorRef.current.frequency.setValueAtTime(danceMode ? 300 : 200, audioContextRef.current.currentTime);
    oscillatorRef.current.type = 'sine';
    
    oscillatorRef.current.start();
    oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.1);
    
    setBeatIntensity(danceMode ? 2 : 1.5);
    setTimeout(() => setBeatIntensity(1), 200);
  }, [createAudioContext, danceMode]);

  // Main animation loop
  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        setCurrentTime(prev => prev + 16.67);
        
        // Update stick rotations
        const rotationSpeed = danceMode ? 6 : 4;
        setStickAngle1(prev => prev + rotationSpeed);
        setStickAngle2(prev => prev - (rotationSpeed - 0.5));
        
        // Beat simulation
        const beatInterval = danceMode ? 400 : 600;
        const timeSinceLastBeat = currentTime % beatInterval;
        
        if (timeSinceLastBeat < 16.67) {
          playBeat();
        }
        
        // Update text pulse
        setTextPulse(1 + (danceMode ? 0.5 : 0.3) * Math.sin(currentTime * 0.01) * beatIntensity);
        
        // Update twinkling stars
        setStars(prev => prev.map(star => ({
          ...star,
          twinkle: star.twinkle + star.speed * 0.1,
          y: star.y + Math.sin(star.twinkle) * 0.2
        })));
        
        // Update confetti
        setConfetti(prev => prev.map(item => ({
          ...item,
          y: item.y > window.innerHeight + 100 ? Math.random() * -300 : item.y + item.speed * beatIntensity,
          x: item.x + Math.sin(currentTime * 0.002 + item.id) * (danceMode ? 1.5 : 1),
          rotation: item.rotation + item.rotationSpeed
        })));
        
        // Update floating diyas (rising sky lanterns)
        setFloatingDiyas(prev => prev.map(item => ({
          ...item,
          y: item.y < -150 ? window.innerHeight + Math.random() * 200 : item.y - item.speed,
          x: item.x + Math.sin(item.sway) * 0.3, // Gentler sway
          sway: item.sway + 0.01, // Slower sway
          glow: item.glow + 0.05 // Slower glow pulse
        })));
        
        // Generate sparkles
        if (showSparkleToggle && Math.random() < (danceMode ? 0.25 : 0.15) * beatIntensity) {
          const newSparkle = {
            id: Date.now() + Math.random(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 1,
            scale: 0.3 + Math.random() * 0.9,
            color: colorThemes[colorTheme].primary
          };
          setSparkles(prev => [...prev.slice(-40), newSparkle]);
        }
        
        // Update sparkles
        setSparkles(prev => prev.map(sparkle => ({
          ...sparkle,
          opacity: sparkle.opacity - 0.03,
          scale: sparkle.scale + 0.03,
          y: sparkle.y - 2
        })).filter(sparkle => sparkle.opacity > 0));
        
        // Generate fireworks
        if (isPlaying && Math.floor(currentTime / (danceMode ? 2000 : 3200)) !== Math.floor((currentTime - 16.67) / (danceMode ? 2000 : 3200))) {
          const fireworkCount = danceMode ? 4 : 2;
          for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
              const newFirework = {
                id: Date.now() + i,
                x: 100 + Math.random() * (window.innerWidth - 200),
                y: 50 + Math.random() * 200,
                particles: Array.from({ length: danceMode ? 20 : 16 }, (_, j) => ({
                  angle: (j * (360 / (danceMode ? 20 : 16))) * Math.PI / 180,
                  distance: 0,
                  color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF8A95', '#A8E6CF'][Math.floor(Math.random() * 7)],
                  speed: 2 + Math.random() * 3
                })),
                age: 0
              };
              setFireworks(prev => [...prev.slice(-12), newFirework]);
            }, i * 150);
          }
        }
        
        // Update fireworks
        setFireworks(prev => prev.map(fw => ({
          ...fw,
          age: fw.age + 1,
          particles: fw.particles.map(p => ({
            ...p,
            distance: p.distance + p.speed,
            speed: p.speed * 0.98
          }))
        })).filter(fw => fw.age < 100));
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, currentTime, showSparkleToggle, beatIntensity, playBeat, danceMode, colorTheme]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleTap = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only create fireworks if not in active game mode
    if (!(currentPage === 'game' && gameActive)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const tapFirework = {
        id: Date.now() + Math.random(),
        x, y,
        particles: Array.from({ length: 15 }, (_, i) => ({
          angle: (i * 24) * Math.PI / 180,
          distance: 0,
          color: colorThemes[colorTheme].primary,
          speed: 3 + Math.random() * 3
        })),
        age: 0
      };
      setFireworks(prev => [...prev.slice(-20), tapFirework]);
      
      playBeat();
    }
  };

  const handleDiyaClick = (e, diyaId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentPage === 'game' && gameActive) {
      // Award points for touching a diya
      setUserScore(prev => prev + 25);
      
      // Create special effect at diya location
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const diyaFirework = {
        id: Date.now() + Math.random(),
        x, y,
        particles: Array.from({ length: 20 }, (_, i) => ({
          angle: (i * 18) * Math.PI / 180,
          distance: 0,
          color: '#FFD700',
          speed: 4 + Math.random() * 3
        })),
        age: 0
      };
      setFireworks(prev => [...prev.slice(-20), diyaFirework]);
      
      // Remove the touched diya temporarily
      setFloatingDiyas(prev => prev.filter(d => d.id !== diyaId));
      
      playBeat();
    }
  };

  const launchWishDiya = (wish) => {
    const newDiya = {
      id: Date.now(),
      x: window.innerWidth / 2 - 50 + Math.random() * 100, // Launch from center area
      y: window.innerHeight - 50,
      sway: 0,
      speed: 1.2 + Math.random() * 0.8, // Faster launch speed
      glow: 0,
      size: 30 + Math.random() * 15, // Larger wish lanterns
      swayAmount: 20 + Math.random() * 30,
      wish: wish,
      opacity: 0.9 + Math.random() * 0.1,
      glowIntensity: 0.8 + Math.random() * 0.2
    };
    setFloatingDiyas(prev => [newDiya, ...prev.slice(-14)]);
    setWishes(prev => [...prev, { id: Date.now(), text: wish, timestamp: new Date().toLocaleTimeString() }]);
  };

  // Page Components
  const HomePage = () => (
    <div className="home-page" style={{ background: colorThemes[colorTheme].bg }} onClick={handleTap}>
      
      {/* Background Effects */}
      <div className="background-effects">
        <div className="gradient-overlay" />
      </div>

      {/* Twinkling stars */}
      {stars.map(star => (
        <div 
          key={star.id} 
          className="star"
          style={{
            left: star.x, 
            top: star.y, 
            width: star.size, 
            height: star.size,
            opacity: 0.3 + 0.7 * Math.sin(star.twinkle),
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5)`
          }} 
        />
      ))}

      {/* Floating Diyas */}
      {floatingDiyas.map(diya => (
        <div 
          key={diya.id} 
          className="floating-diya"
          style={{
            left: diya.x + Math.sin(diya.sway) * diya.swayAmount,
            top: diya.y
          }}
        >
          <div className="diya-container">
            {/* Diya flame */}
            <div 
              className="diya-flame"
              style={{
                width: diya.size * 0.3,
                height: diya.size * 0.4
              }} 
            />
            
            {/* Diya body */}
            <div 
              className="diya-body"
              style={{
                width: diya.size,
                height: diya.size * 0.7,
                boxShadow: `0 0 ${20 + 10 * Math.sin(diya.glow)}px rgba(255,165,0,0.8)`
              }}
            >
              {/* Wish text */}
              {diya.wish && (
                <div className="wish-text">
                  {diya.wish}
                </div>
              )}
            </div>

            {/* String/rope effect */}
            <div className="diya-string" />
          </div>
        </div>
      ))}

      {/* Main title */}
      <div className="main-title">
        <h1 
          className="title-text"
          style={{
            transform: `scale(${textPulse})`,
            textShadow: `0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,107,107,0.6)`,
            filter: `drop-shadow(0 0 10px rgba(255,215,0,0.8))`
          }}
        >
          Happy Dandiya Night
        </h1>
        <div className="subtitle">
          🎉💃🕺✨ {danceMode && "DANCE MODE ON!"} 🪔
        </div>
      </div>

      {/* Dandiya Sticks */}
      <div className="sticks-container">
        <div 
          className="stick stick-1"
          style={{ transform: `rotate(${stickAngle1}deg)` }}
        >
          <div className="stick-tip" />
        </div>
        
        <div 
          className="stick stick-2"
          style={{ transform: `rotate(${stickAngle2}deg)` }}
        >
          <div className="stick-tip stick-tip-2" />
        </div>

        {/* Collision effects */}
        {Math.abs(stickAngle1 - stickAngle2) < 30 && (
          <div className="collision-effects">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="collision-particle"
                style={{
                  left: Math.cos(i * 45 * Math.PI / 180) * 20,
                  top: Math.sin(i * 45 * Math.PI / 180) * 20,
                  animationDelay: `${i * 0.1}s`
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced confetti */}
      {confetti.map(item => (
        <div 
          key={item.id} 
          className="confetti"
          style={{
            left: item.x, 
            top: item.y,
            transform: `rotate(${item.rotation}deg)`,
            backgroundColor: item.color,
            width: item.size, 
            height: item.size,
            borderRadius: item.shape === 'circle' ? '50%' : '2px',
            boxShadow: `0 0 ${item.size}px ${item.color}50`
          }} 
        />
      ))}

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div 
          key={sparkle.id} 
          className="sparkle"
          style={{
            left: sparkle.x, 
            top: sparkle.y,
            opacity: sparkle.opacity,
            transform: `scale(${sparkle.scale})`,
            color: sparkle.color,
            filter: `drop-shadow(0 0 4px ${sparkle.color})`
          }}
        >
          ✨
        </div>
      ))}

      {/* Fireworks */}
      {fireworks.map(fw => (
        <div key={fw.id} className="firework">
          {fw.particles.map((particle, i) => (
            <div 
              key={i} 
              className="firework-particle"
              style={{
                left: fw.x + Math.cos(particle.angle) * particle.distance,
                top: fw.y + Math.sin(particle.angle) * particle.distance,
                backgroundColor: particle.color,
                opacity: Math.max(0, 1 - fw.age / 80),
                boxShadow: `0 0 10px ${particle.color}`
              }} 
            />
          ))}
        </div>
      ))}
    </div>
  );

  const WishPage = () => {
    const [currentWish, setCurrentWish] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleWishSubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentWish.trim()) {
        launchWishDiya(currentWish.trim());
        setCurrentWish('');
      }
    };

    const handleTextareaChange = (e) => {
      e.stopPropagation();
      setCurrentWish(e.target.value);
    };

    const handleTextareaFocus = (e) => {
      e.stopPropagation();
      setIsInputFocused(true);
    };

    const handleTextareaBlur = (e) => {
      e.stopPropagation();
      setIsInputFocused(false);
    };

    const handleFormClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <div className="wish-page" style={{ background: colorThemes[colorTheme].bg }}>
        <div className="wish-container">
          <h1 className="wish-title">
  🪔 Make a Wish & Send a Diya 🪔
</h1>
<p className="wish-note" style={{ 
    fontStyle: 'italic', 
    color: '#FF8C00', 
    
  }}>
  ✨ Please pause the music gently before sending your wish, so your heartfelt message can soar to the skies. After you can start it✨
</p>

          
          <div className="wish-form" onClick={handleFormClick}>
            <textarea
              value={currentWish}
              onChange={handleTextareaChange}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              placeholder="Write your festive wish here..."
              className={`wish-textarea ${isInputFocused ? 'focused' : ''}`}
              maxLength={100}
              autoComplete="off"
              spellCheck={false}
            />
            
            <button
              onClick={handleWishSubmit}
              onMouseDown={(e) => e.stopPropagation()}
              className="wish-button"
              disabled={!currentWish.trim()}
            >
              🚀 Send Wish Diya to Sky ({currentWish.length}/100)
            </button>
          </div>

          <div className="wishes-list">
            <h3 className="wishes-title">Recent Wishes:</h3>
            <div className="wishes-scroll">
              {wishes.length === 0 ? (
                <div className="no-wishes">No wishes yet. Make your first wish! ✨</div>
              ) : (
                wishes.slice(-5).reverse().map(wish => (
                  <div key={wish.id} className="wish-item">
                    <p className="wish-text">{wish.text}</p>
                    <p className="wish-time">{wish.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Floating Sky Lanterns for wishes page - Reduced when input focused */}
        {floatingDiyas.slice(0, isInputFocused ? 5 : floatingDiyas.length).map(diya => (
          <div 
            key={diya.id} 
            className="floating-diya"
            style={{
              left: diya.x + Math.sin(diya.sway) * diya.swayAmount,
              top: diya.y,
              pointerEvents: 'none',
              opacity: isInputFocused ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div className="lantern-container">
              <div 
                className="lantern-body"
                style={{
                  width: diya.size,
                  height: diya.size * 1.3,
                  opacity: (diya.opacity || 0.8) * (isInputFocused ? 0.5 : 1),
                  boxShadow: `
                    0 0 ${15 + 10 * Math.sin(diya.glow)}px rgba(255,165,0,${(diya.glowIntensity || 0.7) * 0.8 * (isInputFocused ? 0.3 : 1)}),
                    0 0 ${25 + 15 * Math.sin(diya.glow)}px rgba(255,100,0,${(diya.glowIntensity || 0.7) * 0.4 * (isInputFocused ? 0.3 : 1)}),
                    inset 0 0 ${8}px rgba(255,200,100,0.3)
                  `
                }}
              >
                <div className="lantern-inner-glow" 
                     style={{
                       opacity: (0.6 + 0.4 * Math.sin(diya.glow * 1.5)) * (isInputFocused ? 0.3 : 1),
                       transform: `scale(${0.8 + 0.2 * Math.sin(diya.glow)})`
                     }}
                />
                
                <div className="lantern-lines">
                  <div className="line line-1"></div>
                  <div className="line line-2"></div>
                  <div className="line line-3"></div>
                </div>
                
                <div className="lantern-bottom"></div>
              </div>

              {diya.wish && (
                <div className="lantern-wish-text" 
                     style={{
                       opacity: Math.max(0.7, 1 - (window.innerHeight - diya.y) / 400) * (isInputFocused ? 0.3 : 1)
                     }}>
                  {diya.wish}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const GamePage = () => (
    <div className="game-page" style={{ background: colorThemes[colorTheme].bg }}>
      
      <div className="game-ui">
        <h2 className="game-title">🏮 Touch the Lanterns!</h2>
        <p className="game-score">Lanterns Touched: {userScore}</p>
        <p className="game-points">Points: {userScore * 25}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setGameActive(!gameActive);
            if (!gameActive) {
              setUserScore(0);
              // Add more diyas when game starts
              const extraDiyas = Array.from({ length: 10 }, (_, i) => ({
                id: Date.now() + i + 1000,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + Math.random() * 300,
                sway: Math.random() * 2 * Math.PI,
                speed: 0.8 + Math.random() * 1.2,
                glow: Math.random() * 2 * Math.PI,
                size: 25 + Math.random() * 20,
                swayAmount: 15 + Math.random() * 25,
                opacity: 0.8 + Math.random() * 0.2,
                glowIntensity: 0.6 + Math.random() * 0.4
              }));
              setFloatingDiyas(prev => [...prev, ...extraDiyas]);
            }
          }}
          className={`game-button ${gameActive ? 'stop' : 'start'}`}
        >
          {gameActive ? 'Stop Game' : 'Start Game'}
        </button>
      </div>

      {gameActive && (
        <div className="game-target">
          <div className="target-icon">🏮</div>
          <p className="target-text">Touch the floating lanterns!</p>
          <p className="target-subtext">Each lantern = 25 points</p>
        </div>
      )}

      <div className="game-content" onClick={handleTap} style={{ background: colorThemes[colorTheme].bg }}>
        {/* Background Effects */}
        <div className="background-effects">
          <div className="gradient-overlay" />
        </div>

        {/* Twinkling stars */}
        {stars.map(star => (
          <div 
            key={star.id} 
            className="star"
            style={{
              left: star.x, 
              top: star.y, 
              width: star.size, 
              height: star.size,
              opacity: 0.3 + 0.7 * Math.sin(star.twinkle),
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5)`
            }} 
          />
        ))}

        {/* Floating Sky Lanterns - Game Version */}
        {floatingDiyas.map(diya => (
          <div 
            key={diya.id} 
            className="floating-diya"
            style={{
              left: diya.x + Math.sin(diya.sway) * diya.swayAmount,
              top: diya.y,
              zIndex: 10
            }}
            onClick={(e) => handleDiyaClick(e, diya.id)}
          >
            <div className="lantern-container">
              <div 
                className={`lantern-body ${gameActive ? 'clickable' : ''}`}
                style={{
                  width: diya.size,
                  height: diya.size * 1.3,
                  opacity: diya.opacity || 0.8,
                  boxShadow: `
                    0 0 ${15 + 10 * Math.sin(diya.glow)}px rgba(255,165,0,${(diya.glowIntensity || 0.7) * 0.8}),
                    0 0 ${25 + 15 * Math.sin(diya.glow)}px rgba(255,100,0,${(diya.glowIntensity || 0.7) * 0.4}),
                    inset 0 0 ${8}px rgba(255,200,100,0.3)
                    ${gameActive ? ', 0 0 5px rgba(255,255,255,0.5)' : ''}
                  `
                }}
              >
                <div className="lantern-inner-glow" 
                     style={{
                       opacity: 0.6 + 0.4 * Math.sin(diya.glow * 1.5),
                       transform: `scale(${0.8 + 0.2 * Math.sin(diya.glow)})`
                     }}
                />
                
                <div className="lantern-lines">
                  <div className="line line-1"></div>
                  <div className="line line-2"></div>
                  <div className="line line-3"></div>
                </div>
                
                <div className="lantern-bottom"></div>
                
                {/* Game mode indicator */}
                {gameActive && (
                  <div className="touch-indicator">
                    👆
                  </div>
                )}
              </div>

              {diya.wish && (
                <div className="lantern-wish-text" 
                     style={{
                       opacity: Math.max(0.7, 1 - (window.innerHeight - diya.y) / 400)
                     }}>
                  {diya.wish}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Enhanced confetti */}
        {confetti.map(item => (
          <div 
            key={item.id} 
            className="confetti"
            style={{
              left: item.x, 
              top: item.y,
              transform: `rotate(${item.rotation}deg)`,
              backgroundColor: item.color,
              width: item.size, 
              height: item.size,
              borderRadius: item.shape === 'circle' ? '50%' : '2px',
              boxShadow: `0 0 ${item.size}px ${item.color}50`
            }} 
          />
        ))}

        {/* Sparkles */}
        {sparkles.map(sparkle => (
          <div 
            key={sparkle.id} 
            className="sparkle"
            style={{
              left: sparkle.x, 
              top: sparkle.y,
              opacity: sparkle.opacity,
              transform: `scale(${sparkle.scale})`,
              color: sparkle.color,
              filter: `drop-shadow(0 0 4px ${sparkle.color})`
            }}
          >
            ✨
          </div>
        ))}

        {/* Fireworks */}
        {fireworks.map(fw => (
          <div key={fw.id} className="firework">
            {fw.particles.map((particle, i) => (
              <div 
                key={i} 
                className="firework-particle"
                style={{
                  left: fw.x + Math.cos(particle.angle) * particle.distance,
                  top: fw.y + Math.sin(particle.angle) * particle.distance,
                  backgroundColor: particle.color,
                  opacity: Math.max(0, 1 - fw.age / 80),
                  boxShadow: `0 0 10px ${particle.color}`
                }} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="settings-page" style={{ background: colorThemes[colorTheme].bg }}>
      
      <div className="settings-container">
        <h1 className="settings-title">⚙️ Settings</h1>
        
        <div className="settings-group">
          <div className="setting-item">
            <label className="setting-label">🎨 Color Theme:</label>
            <select
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
              className="setting-select"
            >
              <option value="traditional">Traditional</option>
              <option value="royal">Royal</option>
              <option value="festive">Festive</option>
            </select>
          </div>

          <div className="setting-item">
            <span className="setting-label">💃 Dance Mode:</span>
            <button
              onClick={() => setDanceMode(!danceMode)}
              className={`setting-toggle ${danceMode ? 'on' : 'off'}`}
            >
              {danceMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-item">
            <span className="setting-label">✨ Sparkles:</span>
            <button
              onClick={() => setShowSparkleToggle(!showSparkleToggle)}
              className={`setting-toggle ${showSparkleToggle ? 'on' : 'off'}`}
            >
              {showSparkleToggle ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="setting-item">
            <span className="setting-label">🔊 Sound:</span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`setting-toggle ${!isMuted ? 'on' : 'off'}`}
            >
              {!isMuted ? 'ON' : 'OFF'}
            </button>
          </div>

          <button
            onClick={() => {
              initializeElements();
              setUserScore(0);
            }}
            className="reset-button"
          >
            🔄 Reset All
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Audio element */}
      <audio 
        ref={audioRef}
        src="Chogada Loveyatri A Journey Of Love 320 Kbps.mp3"
        loop
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime * 1000)}
        style={{ display: 'none' }}
      />

      {/* Page Content */}
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'wishes' && <WishPage />}
      {currentPage === 'game' && <GamePage />}
      {currentPage === 'settings' && <SettingsPage />}

      {/* Navigation Bar */}
      <div className="nav-bar">
        {/* Play/Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className="play-button"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {/* Navigation buttons */}
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'wishes', icon: '🪔', label: 'Wishes' },
          { id: 'game', icon: '🎯', label: 'Game' },
          { id: 'settings', icon: '⚙️', label: 'Settings' }
        ].map(page => (
          <button
            key={page.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage(page.id);
            }}
            className={`nav-button ${currentPage === page.id ? 'active' : ''}`}
            title={page.label}
          >
            <span className="nav-icon">{page.icon}</span>
            <span className="nav-label">{page.label}</span>
          </button>
        ))}

        {/* Volume Control */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="volume-button"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="fab-container">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDanceMode(!danceMode);
          }}
          className={`fab ${danceMode ? 'active' : ''}`}
          title="Toggle Dance Mode"
        >
          💃
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSparkleToggle(!showSparkleToggle);
          }}
          className={`fab ${showSparkleToggle ? 'active' : ''}`}
          title="Toggle Sparkles"
        >
          ✨
        </button>
      </div>

      {/* Status Display */}
      {(danceMode || gameActive) && (
        <div className="status-display">
          {danceMode && (
            <div className="status-item">
              <span className="status-icon">💃</span>
              <span className="status-text">DANCE MODE ACTIVE</span>
            </div>
          )}
          {gameActive && (
            <div className="status-item">
              <span>🏮</span>
              <span>Lanterns Touched: <span className="score-highlight">{userScore}</span></span>
            </div>
          )}
        </div>
      )}

      {/* Instructions Overlay */}
      {currentPage === 'home' && (
        <div className="instructions">
          <div className="instruction-item">🎊 Tap anywhere for fireworks!</div>
          <div className="instruction-item">🪔 Diyas float up like balloons</div>
          <div className="instruction-item">✨ Navigate between pages below</div>
        </div>
      )}
    </div>
  );
};

export default App;