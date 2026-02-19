'use client';
import React, { useState } from 'react';
import styles from '@/app/chat/chat.module.css';

export default function MessageComposer({
  onSend,
  placeholder,
}: {
  onSend: (text: string) => void | Promise<void>;
  placeholder?: string;
}) {
  const [text, setText] = useState('');

  const submit = async () => {
    const t = text.trim();
    if (!t) return;
    setText('');
    await onSend(t);
  };

  return (
    <div className={styles.composer}>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || 'Escribe…'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button type="button" className={styles.sendBtn} onClick={submit} aria-label="Enviar">
        ➤
      </button>
    </div>
  );
}
