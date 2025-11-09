import { useState, useEffect } from 'react';

const ChatButton = () => {
  const [calculatedBottom, setCalculatedBottom] = useState(70);

  useEffect(() => {
    // Calculate dynamic position for different screen sizes
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Different bottom positions based on screen size
      let newBottom: number;
      if (viewportWidth < 768) { // Mobile
        newBottom = Math.min(60, viewportHeight - 80); // Ensure it's not too close to bottom
      } else if (viewportWidth < 1024) { // Tablet
        newBottom = Math.min(70, viewportHeight - 90);
      } else { // Desktop
        newBottom = Math.min(70, viewportHeight - 100);
      }

      setCalculatedBottom(newBottom);
    };

    // Initial calculation
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: `${calculatedBottom}px`,
        right: '20px',
        zIndex: 1000
      }}
      className="chat-button"
    >
      {/* Chat button content would go here */}
      <button className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600">
        💬
      </button>
    </div>
  );
};

export default ChatButton;