import { useEffect, useEffectEvent, useRef, useState } from "react";

interface UseAutoScrollOptions {
  isStreaming?: boolean;
  content?: string;
}

export function useAutoScroll({ isStreaming = false, content }: UseAutoScrollOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const lastContentRef = useRef(content);

  const scrollToBottom = useEffectEvent((behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const handleScroll = useEffectEvent(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    if (!isAtBottom) {
      setUserHasScrolled(true);
    } else {
      setUserHasScrolled(false);
    }
  });

  useEffect(() => {
    if (lastContentRef.current !== content) {
      setUserHasScrolled(false);
      lastContentRef.current = content;
    }
  }, [content]);

  useEffect(() => {
    if (isStreaming && !userHasScrolled) {
      scrollToBottom("smooth");
    }
  }, [content, isStreaming, userHasScrolled, scrollToBottom]);

  return {
    scrollRef,
    handleScroll,
    userHasScrolled,
  };
}
