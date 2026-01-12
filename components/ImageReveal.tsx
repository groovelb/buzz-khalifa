import React, { useEffect, useRef, useState } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  className = '',
  delay = 0,
  duration = 800,
  threshold = 0.3,
  direction = 'up',
  distance = 30,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (imageRef.current) {
            observer.unobserve(imageRef.current);
          }
        }
      },
      { threshold }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // 방향에 따른 시작 위치
  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return `translate(0, ${distance}px)`;
      case 'down':
        return `translate(0, -${distance}px)`;
      case 'left':
        return `translate(${distance}px, 0)`;
      case 'right':
        return `translate(-${distance}px, 0)`;
      default:
        return `translate(0, ${distance}px)`;
    }
  };

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    />
  );
};

export default ImageReveal;
