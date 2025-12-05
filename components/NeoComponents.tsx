import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string; // Tailwind bg class
  noPadding?: boolean;
}

export const NeoCard: React.FC<NeoCardProps> = ({ children, className = '', color = 'bg-white', noPadding = false }) => {
  return (
    <div className={`border-4 border-black shadow-neo transition-transform hover:-translate-y-1 hover:translate-x-1 ${color} ${className}`}>
      <div className={`${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'black';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon: Icon, 
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "font-display font-black uppercase tracking-wider py-3 px-6 border-4 border-black shadow-neo active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-rap-pink hover:bg-rap-pink/90 text-black",
    secondary: "bg-white hover:bg-gray-50 text-black",
    accent: "bg-rap-green hover:bg-rap-green/90 text-white",
    black: "bg-black text-white hover:bg-gray-900",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={20} strokeWidth={3} />}
      {children}
    </button>
  );
};

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={label ? "mb-4" : ""}>
      {label && (
        <label className="block font-display font-bold text-black mb-2 uppercase text-sm tracking-wide bg-white inline-block px-2 border-2 border-black transform -rotate-1">
          {label}
        </label>
      )}
      <input 
        className={`w-full bg-white border-4 border-black p-3 font-mono focus:outline-none focus:ring-4 focus:ring-rap-purple/50 transition-all shadow-neo-sm ${className}`}
        {...props}
      />
    </div>
  );
};

interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const NeoSelect: React.FC<NeoSelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block font-display font-bold text-black mb-2 uppercase text-sm tracking-wide bg-white inline-block px-2 border-2 border-black transform rotate-1">
        {label}
      </label>
      <select 
        className={`w-full bg-white border-4 border-black p-3 font-mono focus:outline-none shadow-neo-sm appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export const Badge: React.FC<{ text: string; color?: string }> = ({ text, color = 'bg-black' }) => (
  <span className={`${color} text-white text-xs font-bold px-2 py-1 uppercase tracking-widest border-2 border-black`}>
    {text}
  </span>
);

export const PostSkeleton = () => (
  <div className="border-4 border-black h-full bg-white shadow-neo flex flex-col">
    <div className="h-48 bg-gray-200 animate-pulse border-b-4 border-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
    </div>
    <div className="p-6 space-y-4 flex-grow">
      <div className="flex justify-between">
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="pt-4 flex justify-between items-center mt-auto">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  </div>
);