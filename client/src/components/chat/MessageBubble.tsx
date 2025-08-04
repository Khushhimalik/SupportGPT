import { format } from 'date-fns';
import { Heart, User } from 'lucide-react';
import type { Message } from '@shared/schema';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const timeStr = format(message.timestamp, 'h:mm a');

  if (message.isUser) {
    return (
      <div className="message-bubble">
        <div className="flex items-start space-x-3 justify-end">
          <div className="bg-support-primary text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs sm:max-w-md">
            <p className="text-sm sm:text-base">{message.content}</p>
            <div className="text-xs text-blue-100 mt-2">{timeStr}</div>
          </div>
          <div className="w-10 h-10 bg-support-accent rounded-full flex items-center justify-center text-white flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-bubble">
      <div className="flex items-start space-x-3">
        <div className="support-gradient w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0">
          <Heart className="w-5 h-5" />
        </div>
        <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs sm:max-w-md">
          <p className="text-gray-800 text-sm sm:text-base">{message.content}</p>
          <div className="text-xs text-support-text mt-2">{timeStr}</div>
        </div>
      </div>
    </div>
  );
}
