'use client';

import { useState, useEffect } from 'react';

interface UseTypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export function useTypewriter({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
}: UseTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const currentWord = words[wordIndex];

    if (isWaiting) {
      timeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, delayBetweenWords);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (displayedText === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }

      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
      return () => clearTimeout(timeout);
    }

    if (displayedText === currentWord) {
      setIsWaiting(true);
      return;
    }

    timeout = setTimeout(() => {
      setDisplayedText(currentWord.slice(0, displayedText.length + 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, wordIndex, isDeleting, isWaiting, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return displayedText;
} 
