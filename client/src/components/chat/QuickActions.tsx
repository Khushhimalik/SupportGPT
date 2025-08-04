interface QuickActionsProps {
  onActionClick: (message: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const quickActions = [
    "I'm feeling anxious",
    "I'm stressed about school", 
    "I need someone to talk to",
    "I'm having trouble sleeping",
    "I feel overwhelmed"
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onActionClick(action)}
          className="bg-white text-support-text px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-support-primary hover:text-white transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
