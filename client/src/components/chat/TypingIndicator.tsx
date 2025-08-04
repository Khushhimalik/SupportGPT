import { Heart } from 'lucide-react';

interface TypingIndicatorProps {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator active items-start space-x-3">
      <div className="support-gradient w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0">
        <Heart className="w-5 h-5" />
      </div>
      <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-support-text rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-support-text rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-support-text rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
