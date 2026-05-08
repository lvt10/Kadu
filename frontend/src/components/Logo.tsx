interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-base' },
    md: { container: 'w-14 h-14', text: 'text-xl' },
    lg: { container: 'w-20 h-20', text: 'text-2xl' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Logo Symbol - K Amigável */}
      <div className={`${sizeConfig.container} relative flex items-center justify-center bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-3xl shadow-lg`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Traço vertical do K */}
          <rect x="25" y="15" width="14" height="70" rx="7" fill="white" />
          
          {/* Perna superior do K - diagonal para cima/direita */}
          <path
            d="M 39 45 L 70 20 L 80 28 L 75 33 L 50 53 L 39 50 Z"
            fill="white"
          />
          
          {/* Perna inferior do K - diagonal para baixo/direita */}
          <path
            d="M 39 55 L 50 47 L 75 67 L 80 72 L 70 80 L 39 50 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Texto */}
      {showText && (
        <span 
          className={`${sizeConfig.text} font-bold tracking-wide`} 
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent">
            Kadu
          </span>
        </span>
      )}
    </div>
  );
}