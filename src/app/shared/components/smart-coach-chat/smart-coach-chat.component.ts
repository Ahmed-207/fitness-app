import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

@Component({
  selector: 'app-smart-coach-chat',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './smart-coach-chat.component.html',
  styleUrl: './smart-coach-chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartCoachChatComponent {
  private readonly messagesEnd = viewChild<ElementRef<HTMLDivElement>>('messagesEnd');

  readonly isOpen = signal(false);
  readonly isHistoryOpen = signal(false);
  readonly draft = signal('');

  /** Sample rows from Figma; replace when a history API exists. */
  readonly historyItems = signal([
    'ASSISTANT.HISTORY_SAMPLE',
    'ASSISTANT.HISTORY_SAMPLE',
    'ASSISTANT.HISTORY_SAMPLE',
    'ASSISTANT.HISTORY_SAMPLE',
    'ASSISTANT.HISTORY_SAMPLE',
  ]);

  readonly messages = signal<ChatMessage[]>([
    { id: '1', role: 'assistant', text: 'ASSISTANT.GREETING' },
    { id: '2', role: 'user', text: 'ASSISTANT.SAMPLE_USER' },
    { id: '3', role: 'assistant', text: 'ASSISTANT.GREETING' },
  ]);

  toggleOpen(): void {
    this.isOpen.update((open) => !open);
    if (!this.isOpen()) {
      this.isHistoryOpen.set(false);
    }
  }

  toggleHistory(): void {
    this.isHistoryOpen.update((open) => !open);
  }

  closeHistory(): void {
    this.isHistoryOpen.set(false);
  }

  sendMessage(): void {
    const text = this.draft().trim();
    if (!text) {
      return;
    }

    this.messages.update((list) => [
      ...list,
      { id: this.nextId(), role: 'user', text },
      {
        id: this.nextId(),
        role: 'assistant',
        text: 'ASSISTANT.GREETING',
      },
    ]);
    this.draft.set('');
    this.queueScrollToBottom();
  }

  onDraftKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  messageText(message: ChatMessage): string {
    return message.text;
  }

  isTranslationKey(text: string): boolean {
    return text.startsWith('ASSISTANT.');
  }

  private queueScrollToBottom(): void {
    queueMicrotask(() => {
      const el = this.messagesEnd()?.nativeElement;
      el?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }

  private nextId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
