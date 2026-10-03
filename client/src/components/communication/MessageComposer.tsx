import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

export interface MessageComposerProps {
  onSendMessage: (content: string, attachmentName?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message to service partner...',
  className,
}) => {
  const [content, setContent] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [content]);

  const handleSend = () => {
    if ((!content.trim() && !attachmentName) || disabled) return;
    onSendMessage(content.trim(), attachmentName || undefined);
    setContent('');
    setAttachmentName(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSimulateAttachment = () => {
    const fileName = prompt(
      'Simulate attachment file name (e.g., photo-of-leak.jpg or meter-reading.png):',
      'photo-of-site.jpg'
    );
    if (fileName && fileName.trim()) {
      setAttachmentName(fileName.trim());
    }
  };

  return (
    <div className={cn('p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800', className)}>
      {/* Attachment Pill if active */}
      {attachmentName && (
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs text-primary-800 dark:text-primary-300">
          <Paperclip size={13} aria-hidden="true" />
          <span className="truncate max-w-xs">{attachmentName}</span>
          <button
            type="button"
            onClick={() => setAttachmentName(null)}
            className="text-primary-600 hover:text-primary-900 dark:hover:text-white p-0.5 rounded focus-ring cursor-pointer"
            aria-label="Remove attachment"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2.5">
        {/* Attachment Trigger Button (min 44px tap target) */}
        <button
          type="button"
          onClick={handleSimulateAttachment}
          disabled={disabled}
          title="Attach site photo or document"
          aria-label="Attach site photo or document"
          className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <Paperclip size={18} aria-hidden="true" />
        </button>

        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            maxLength={1000}
            className={cn(
              'w-full min-h-[44px] py-2.5 px-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:bg-white dark:focus:bg-slate-900 transition-all scrollbar-none',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500'
            )}
            aria-label="Message text"
          />
        </div>

        {/* Send Action Button (44px min tap target) */}
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSend}
          disabled={disabled || (!content.trim() && !attachmentName)}
          aria-label="Send message"
          className="w-11 h-11 p-0 flex items-center justify-center shrink-0 rounded-xl shadow-xs"
        >
          <Send size={18} aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
        <span>Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Shift + Enter</kbd> for new line</span>
        <span>{content.length}/1000</span>
      </div>
    </div>
  );
};

export default MessageComposer;
