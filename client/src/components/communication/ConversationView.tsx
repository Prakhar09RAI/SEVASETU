import React, { useRef, useEffect } from 'react';
import {
  User,
  LifeBuoy,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ConversationContext } from './ConversationContext';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import type {
  ConversationSummary,
  ConversationContextData,
  MessageItem,
} from '../../types';

export interface ConversationViewProps {
  conversation?: ConversationSummary;
  context?: ConversationContextData;
  messages: MessageItem[];
  currentUserId: string;
  onSendMessage: (text: string, attachmentName?: string) => void;
  onOpenSupport?: () => void;
  isLoading?: boolean;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  context,
  messages,
  currentUserId,
  onSendMessage,
  onOpenSupport,
  isLoading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-950/50 text-center">
        <div className="max-w-sm space-y-3 text-slate-500 dark:text-slate-400">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare size={26} aria-hidden="true" />
          </div>
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-200 text-base">
            Select a conversation
          </h3>
          <p className="text-xs leading-relaxed">
            Choose an ongoing customer service booking thread from the list to exchange messages, coordination details, and on-site updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/40 dark:bg-slate-950 overflow-hidden text-left">
      {/* Conversation Top Header */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs shrink-0 overflow-hidden">
            {conversation.otherPartyAvatar ? (
              <img
                src={conversation.otherPartyAvatar}
                alt={conversation.otherPartyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={18} />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                {conversation.otherPartyName}
              </h3>
              <Badge variant="neutral" size="sm" className="text-[10px] uppercase py-0 px-1.5 font-semibold">
                {conversation.otherPartyRole}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {conversation.serviceTitle}
            </p>
          </div>
        </div>

        {/* Support Action Pathway */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenSupport && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LifeBuoy size={14} className="text-amber-500" />}
              onClick={onOpenSupport}
              className="text-xs h-9"
            >
              Support
            </Button>
          )}
        </div>
      </div>

      {/* Context Banner */}
      {context && <ConversationContext context={context} />}

      {/* Message Stream with role="log" and aria-live="polite" */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation message history"
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-xs text-slate-400 py-12">
            <span>No messages yet. Send a message to coordinate your appointment!</span>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSelf={msg.senderId === currentUserId}
            />
          ))
        )}
      </div>

      {/* Message Input Composer */}
      <MessageComposer onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ConversationView;
