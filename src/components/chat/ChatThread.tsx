'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/chat/chat.module.css';

type ActionVariant = 'primary' | 'ghost';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  actionCard?: {
    title: string;
    workoutTitle: string;
    zone?: string;
    duration?: string;
    bullets: { label: string; detail?: string; sub?: string }[];
    actions?: { id: string; label: string; variant: ActionVariant }[];
  };
};

export default function ChatThread({
  messages,
  onAction,
  userAvatarUrl,
}: {
  messages: ChatMessage[];
  onAction: (actionId: string) => void;
  userAvatarUrl?: string | null;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    // Solo hacer scroll si se añadieron nuevos mensajes, no en la carga inicial
    if (messages.length > prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  return (
    <div className={styles.thread}>
      <div className={styles.threadHeader}>
        <div className={styles.brandInline} aria-hidden>
          <Image 
            src="/pazey-logo.png" 
            alt="Pazey" 
            width={40} 
            height={40}
            className={styles.brandLogo}
          />
        </div>
        <div className={styles.threadTitle}>Pazey</div>
      </div>

      <div className={styles.messages}>
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? styles.msgRowRight : styles.msgRowLeft}>
            {m.role === 'assistant' && (
              <div className={styles.avatar} aria-hidden>
                <Image 
                  src="/pazey-logo.png" 
                  alt="" 
                  width={38} 
                  height={38}
                  className={styles.avatarLogo}
                />
              </div>
            )}

            <div className={m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}>
              <div className={styles.msgText} dangerouslySetInnerHTML={{ __html: markdownLite(m.content) }} />

              {m.actionCard && (
                <div className={styles.actionCard}>
                  <div className={styles.actionCardTop}>
                    <div className={styles.actionCardTitle}>{m.actionCard.title}</div>
                    {m.actionCard.duration ? <div className={styles.actionCardChip}>{m.actionCard.duration}</div> : null}
                  </div>

                  <div className={styles.actionCardWorkout}>{m.actionCard.workoutTitle}</div>
                  {m.actionCard.zone ? <div className={styles.actionCardZone}>{m.actionCard.zone}</div> : null}

                  <div className={styles.actionCardBullets}>
                    {m.actionCard.bullets.map((b, i) => (
                      <div key={i} className={styles.bulletRow}>
                        <span className={styles.bulletDot} aria-hidden>•</span>
                        <div className={styles.bulletText}>
                          <div className={styles.bulletMain}>
                            <span className={styles.bulletLabel}>{b.label}</span>
                            {b.detail ? <span className={styles.bulletDetail}>{b.detail}</span> : null}
                          </div>
                          {b.sub ? <div className={styles.bulletSub}>{b.sub}</div> : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  {m.actionCard.actions?.length ? (
                    <div className={styles.actionRow}>
                      {m.actionCard.actions.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => onAction(a.id)}
                          className={a.variant === 'primary' ? styles.actionPrimary : styles.actionGhost}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className={styles.avatarUser} aria-hidden>
                {userAvatarUrl ? (
                  <Image 
                    src={userAvatarUrl} 
                    alt="" 
                    width={38} 
                    height={38}
                    className={styles.avatarUserImage}
                  />
                ) : (
                  '🙂'
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/** markdown ultra simple: **bold** + saltos de línea */
function markdownLite(text: string) {
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}
