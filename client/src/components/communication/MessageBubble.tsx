import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { MessageStatusIndicator } from './MessageStatusIndicator';
import type { MessageItem } from '../../types';
import { cn } from '../../lib/cn';

export interface MessageBubbleProps {
  message: MessageItem;
  isSelf: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSelf,
  className,
}) => {
  const isSystem = message.senderRole === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-medium max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col mb-3',
        isSelf ? 'items-end' : 'items-start',
        className
      )}
    >
      {/* Sender Name (shown when not self) */}
      {!isSelf && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1 ml-1">
          {message.senderName}
        </span>
      )}

      {/* Bubble Container */}
      <div
        className={cn(
          'relative max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs leading-relaxed',
          isSelf
            ? 'bg-primary-700 text-white rounded-tr-xs shadow-primary-950/10'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs'
        )}
      >
        {/* Attachment preview if present */}
        {message.attachment && (
          <div
            className={cn(
              'mb-2 p-2 rounded-xl flex items-center gap-2 border text-xs',
              isSelf
                ? 'bg-primary-800/80 border-primary-600 text-white'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            )}
          >
            {message.attachment.type === 'image' ? (
              <ImageIcon size={16} className={isSelf ? 'text-primary-200' : 'text-primary-600'} aria-hidden="true" />
            ) : (
              <FileText size={16} className={isSelf ? 'text-primary-200' : 'text-primary-600'} aria-hidden="true" />
            )}
            <div className="flex-1 min-w-0">
              <span className="truncate block font-medium">{message.attachment.name}</span>
              {message.attachment.sizeFormatted && (
                <span className={cn('text-[10px] block font-mono', isSelf ? 'text-primary-200' : 'text-slate-400')}>
                  {message.attachment.sizeFormatted}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Message Content */}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {/* Timestamp and Status Meta */}
        <div
          className={cn(
            'flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono',
            isSelf ? 'text-primary-100' : 'text-slate-400'
          )}
        >
          <span>{message.timestamp}</span>
          {isSelf && <MessageStatusIndicator status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
