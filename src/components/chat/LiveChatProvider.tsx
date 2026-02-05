'use client';

import { useLiveChat } from '@/hooks/useLiveChat';
import { LiveChatWidget } from './LiveChatWidget';

export function LiveChatProvider() {
  const chat = useLiveChat();

  return (
    <LiveChatWidget
      visible={chat.visible}
      panelOpen={chat.panelOpen}
      chatActive={chat.chatActive}
      messages={chat.messages}
      onSend={chat.send}
      onTogglePanel={chat.togglePanel}
      hasHistory={chat.hasHistory}
    />
  );
}
