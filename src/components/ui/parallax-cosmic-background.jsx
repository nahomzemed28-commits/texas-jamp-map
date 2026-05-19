import { useEffect, useState } from 'react';

const generateStarBoxShadow = (count) => {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    shadows.push(`${x}px ${y}px #FFF`);
  }
  return shadows.join(', ');
};

const CosmicParallaxBg = ({ head, text, loop = true, className = '' }) => {
  const [smallStars,  setSmallStars]  = useState('');
  const [mediumStars, setMediumStars] = useState('');
  const [bigStars,    setBigStars]    = useState('');

  const textParts = text.split(',').map(p => p.trim());

  useEffect(() => {
    setSmallStars(generateStarBoxShadow(700));
    setMediumStars(generateStarBoxShadow(200));
    setBigStars(generateStarBoxShadow(100));
    document.documentElement.style.setProperty(
      '--animation-iteration',
      loop ? 'infinite' : '1'
    );
  }, [loop]);

  return (
    <div className={`cosmic-parallax-container ${className}`}>
      <div id="stars"  style={{ boxShadow: smallStars  }} className="cosmic-stars" />
      <div id="stars2" style={{ boxShadow: mediumStars }} className="cosmic-stars-medium" />
      <div id="stars3" style={{ boxShadow: bigStars    }} className="cosmic-stars-large" />

      <div id="horizon"><div className="glow" /></div>
      <div id="earth" />

      <div id="title">{head.toUpperCase()}</div>
      <div id="subtitle">
        {textParts.map((part, i) => (
          <span key={i} className={`subtitle-part-${i + 1}`}>
            {part.toUpperCase()}{i < textParts.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export { CosmicParallaxBg };
