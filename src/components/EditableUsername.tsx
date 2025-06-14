
import React, { useState } from 'react';
import { Edit2, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EditableUsernameProps {
  currentName: string;
  onSave: (newName: string) => Promise<boolean>;
}

const EditableUsername: React.FC<EditableUsernameProps> = ({
  currentName,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  // Update editValue when currentName changes (to reflect successful saves)
  React.useEffect(() => {
    setEditValue(currentName);
  }, [currentName]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(currentName);
  };

  const handleSave = async () => {
    if (editValue.trim() === '' || editValue.trim() === currentName) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const success = await onSave(editValue.trim());
      if (success) {
        setIsEditing(false);
        // Don't reset editValue here - let it be updated by the effect when currentName changes
      }
    } catch (error) {
      console.error('Error saving username:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(currentName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:ring-0 px-2 py-1 flex-1 min-w-0"
          autoFocus
          disabled={isLoading}
          placeholder="Enter your name"
        />
        <div className="flex items-center space-x-1">
          <Button
            onClick={handleSave}
            disabled={isLoading || editValue.trim() === '' || editValue.trim() === currentName}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleStartEdit}
      variant="ghost"
      className={cn(
        "flex items-center space-x-2 hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200 group",
        "border border-transparent hover:border-gray-200 hover:shadow-sm"
      )}
    >
      <h1 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
        {currentName}
      </h1>
      <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110" />
    </Button>
  );
};

export default EditableUsername;
