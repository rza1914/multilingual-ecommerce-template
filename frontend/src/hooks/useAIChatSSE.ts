import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useAIChatSSE = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;

    setIsOnline(false); // assume offline until proven
    const url = `${API_URL}/api/v1/services/conversation_sse/stream?message=${encodeURIComponent(message)}`;

    // Always close previous connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    console.log('SSE: Creating connection to URL:', url);
    const es = new EventSource(url);
    console.log('SSE: Initial EventSource state:', es.readyState);
    eventSourceRef.current = es;

    es.onopen = () => {
      console.log("SSE: Connection opened successfully.");
      console.log("SSE: Ready state:", es.readyState);
      setIsOnline(true);
    };
    es.onerror = (e) => {
      console.error('SSE: Error occurred.', e);
      console.log('SSE: Ready state on error:', es.readyState);
      setIsOnline(false);
      es.close();
    };

    es.onmessage = (event) => {
      console.log('SSE: Message received.', { data: event.data });
      if (event.data === "[DONE]") {
        console.log("Received [DONE] signal, closing connection");
        es.close();
        return;
      }

      // Parse the event data in case it's a JSON string
      let content;
      try {
        const parsedData = JSON.parse(event.data);
        // If it's a valid JSON object, extract content appropriately
        if (typeof parsedData === 'object' && parsedData !== null) {
          content = parsedData.content || parsedData.text || parsedData.message || JSON.stringify(parsedData);
        } else {
          content = event.data;
        }
      } catch (e) {
        // If it's not valid JSON, use the raw data
        content = event.data;
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // unique ID
        content: content,
        role: "assistant",
        timestamp: new Date().toISOString()
      }]);
    };
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { messages, sendMessage, isOnline };
};