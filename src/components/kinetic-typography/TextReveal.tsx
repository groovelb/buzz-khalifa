import React, { useEffect, useRef, useState } from 'react';

export interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;           // 시작 딜레이 (ms)
  staggerDelay?: number;    // 글자 간 딜레이 (ms)
  duration?: number;        // 애니메이션 지속 시간 (ms)
  threshold?: number;       // IntersectionObserver threshold
  once?: boolean;           // 한 번만 실행
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
  staggerDelay = 40,
  duration = 600,
  threshold = 0.3,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  // 텍스트를 단어와 글자로 분리
  const words = text.split(' ');

  let charIndex = 0;

  return (
    <Tag
      ref={(node) => {
        containerRef.current = node;
      }}
      className={className}
      style={{ display: 'block' }}
    >
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          {word.split('').map((char) => {
            const currentIndex = charIndex++;
            return (
              <span
                key={currentIndex}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'top',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
                    transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                    transitionDelay: isVisible ? `${delay + currentIndex * staggerDelay}ms` : '0ms',
                  }}
                >
                  {char}
                </span>
              </span>
            );
          })}
          {/* 단어 사이 공백 */}
          {wordIdx < words.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.3em' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
};
