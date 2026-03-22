import { motion } from 'motion/react';
import { PersonalityType } from '../types';
import { PUSHERS } from '../constants';
import PusherAvatar from '../components/PusherAvatar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OnboardingProps {
  onSelect: (type: PersonalityType) => void;
}

export default function Onboarding({ onSelect }: OnboardingProps) {
  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-black text-text-primary mb-4 tracking-tight">P人救星</h1>
        <p className="text-text-secondary text-lg">嗨，我是你的 DDL Pusher~ 先选个合眼缘的性格吧，之后也可以换哦 ✨</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        {(Object.keys(PUSHERS) as PersonalityType[]).map((type) => {
          const pusher = PUSHERS[type];
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(type)}
              className="relative group p-6 bg-white rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left flex items-center gap-6"
            >
              <PusherAvatar personality={type} size="lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-text-primary">{pusher.name}</h3>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                    type === 'toxic' ? "bg-toxic-primary/10 text-toxic-primary" :
                    type === 'cute' ? "bg-cute-primary/10 text-cute-primary" :
                    "bg-gentle-primary/10 text-gentle-primary"
                  )}>
                    {type === 'toxic' ? '毒舌犀利' : type === 'cute' ? '活泼可爱' : '温柔耐心'}
                  </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2 italic">
                  "{pusher.greetings[0]}"
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
