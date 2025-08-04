import { useState, useRef, useEffect } from 'react';
import { Send, Globe, UserCheck, AlertTriangle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickActions } from './QuickActions';
import { CrisisModal } from './CrisisModal';
import { useChat } from '@/hooks/useChat';
import { getLanguageDisplayName } from '@/lib/languageDetection';

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, sendMessage, isTyping, detectedLanguage, isLoading, sessionInitialized } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() && sessionInitialized && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    if (sessionInitialized && !isLoading) {
      sendMessage(action);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Crisis Alert Bar */}
      <div className="crisis-alert text-white py-3 px-4 text-center text-sm font-medium">
        <AlertTriangle className="inline w-4 h-4 mr-2" />
        <span>In crisis? Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line)</span>
        <button
          onClick={() => setShowCrisisModal(true)}
          className="ml-4 underline hover:no-underline"
        >
          More Resources
        </button>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="support-gradient w-12 h-12 rounded-xl flex items-center justify-center text-white">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SupportGPT</h1>
                <p className="text-support-text text-sm">Free 24/7 Mental Health Support</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Indicator */}
              <div className="bg-support-secondary/10 text-support-secondary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <span>{getLanguageDisplayName(detectedLanguage)} Detected</span>
              </div>
              
              {/* Anonymous Status */}
              <div className="bg-support-online/10 text-support-online px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                <span>Anonymous</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Messages Area */}
          <div className="chat-container overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            <TypingIndicator isVisible={isTyping} />
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind... I'm here to listen and support you."
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-support-primary focus:border-transparent resize-none text-sm sm:text-base min-h-[48px]"
                  rows={1}
                  disabled={!sessionInitialized || isLoading}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || !sessionInitialized || isLoading}
                className="support-gradient text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed h-12"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <UserCheck className="w-5 h-5 text-support-secondary" />
              <h3 className="font-semibold text-gray-900">Completely Anonymous</h3>
            </div>
            <p className="text-support-text text-sm">No registration, no data storage. Your privacy is our priority.</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="w-5 h-5 text-support-accent" />
              <h3 className="font-semibold text-gray-900">24/7 Available</h3>
            </div>
            <p className="text-support-text text-sm">Get support whenever you need it, day or night.</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <Globe className="w-5 h-5 text-support-primary" />
              <h3 className="font-semibold text-gray-900">Multilingual</h3>
            </div>
            <p className="text-support-text text-sm">Communicate in your preferred language automatically.</p>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-support-accent mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Important Notice</h4>
              <p className="text-amber-700 text-sm">
                SupportGPT provides peer support and is not a replacement for professional mental health services. 
                If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Resources Modal */}
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </div>
  );
}
