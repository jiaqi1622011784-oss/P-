import { motion } from 'motion/react';
import { PersonalityType } from '../types';
import { PUSHERS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PusherAvatarProps {
  personality: PersonalityType;
  status?: 'idle' | 'listening' | 'thinking' | 'speaking' | 'celebrating';
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PusherAvatar({ 
  personality, 
  status = 'idle', 
  onClick, 
  className,
  size = 'md'
}: PusherAvatarProps) {
  const pusher = PUSHERS[personality];
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={cn("relative cursor-pointer", className)} onClick={onClick}>
      {/* Wave effect for listening */}
      {status === 'listening' && (
        <>
          <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-wave" />
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-wave [animation-delay:0.5s]" />
          <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-wave [animation-delay:1s]" />
        </>
      )}

      {/* Main Avatar */}
      <motion.div
        animate={status === 'idle' ? { y: [0, -8, 0] } : {}}
        transition={status === 'idle' ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
        className={cn(
          "relative rounded-full overflow-hidden border-2 shadow-lg",
          sizeClasses[size]
        )}
        style={{ borderColor: pusher.accentColor }}
      >
        <img 
          src={pusher.avatar} 
          alt={pusher.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Thinking overlay */}
        {status === 'thinking' && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-white font-bold text-xl"
            >
              ...
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Speaking bubble */}
      {status === 'speaking' && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="absolute -top-4 -right-2 w-4 h-4 bg-white rounded-full border border-gray-200 shadow-sm"
        />
      )}
    </div>
  );
}
