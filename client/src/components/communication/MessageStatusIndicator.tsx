import React from 'react';
import { Clock, Check, CheckCheck, AlertCircle } from 'lucide-react';
import type { MessageStatus } from '../../types';

export interface MessageStatusIndicatorProps {
  status: MessageStatus;
  className?: string;
}

export const MessageStatusIndicator: React.FC<MessageStatusIndicatorProps> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'sending':
      return (
        <span title="Sending message..." className={className}>
          <Clock size={12} className="text-slate-400 dark:text-slate-500 animate-pulse" aria-hidden="true" />
          <span className="sr-only">Sending message</span>
        </span>
      );
    case 'sent':
      return (
        <span title="Sent to server" className={className}>
          <Check size={12} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <span className="sr-only">Message sent</span>
        </span>
      );
    case 'delivered':
      return (
        <span title="Delivered to recipient" className={className}>
          <CheckCheck size={12} className="text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <span className="sr-only">Message delivered</span>
        </span>
      );
    case 'read':
      return (
        <span title="Read by recipient" className={className}>
          <CheckCheck size={12} className="text-primary-600 dark:text-primary-400" aria-hidden="true" />
          <span className="sr-only">Message read</span>
        </span>
      );
    case 'failed':
      return (
        <span title="Message failed to send" className={className}>
          <AlertCircle size={12} className="text-red-600 dark:text-red-400" aria-hidden="true" />
          <span className="sr-only">Message failed to send</span>
        </span>
      );
    default:
      return null;
  }
};

export default MessageStatusIndicator;
