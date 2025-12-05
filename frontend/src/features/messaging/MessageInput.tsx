import { FormEvent, useRef, useState } from 'react';
import { SendMessagePayload } from './types';
import './messaging.css';

interface MessageInputProps {
  onSend: (payload: SendMessagePayload) => Promise<void> | void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      setError('Le message ne peut pas être vide');
      return;
    }

    setError(null);
    const clientMessageId = crypto.randomUUID();

    await onSend({ content: content.trim(), attachmentUrl: attachmentUrl || undefined, clientMessageId });
    setContent('');
    setAttachmentUrl('');
    inputRef.current?.focus();
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={content}
        disabled={disabled}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Écrire un message"
      />
      <input
        value={attachmentUrl}
        disabled={disabled}
        onChange={(event) => setAttachmentUrl(event.target.value)}
        placeholder="URL de pièce jointe (optionnel)"
      />
      <button type="submit" disabled={disabled}>
        Envoyer
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
