import React from "react";
import { useEffect } from "react";

const AdjustableTextarea: React.FC<{ text: string }> = ({ text }) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      // Reset height to auto for accurate scrollHeight computation
      textAreaRef.current.style.height = 'auto';
      // Set the height to the scrollHeight of the textarea
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [textAreaRef, text]);

  return (
    <textarea
      ref={textAreaRef}
      cols={100}
      value={text}
      readOnly
    />
  );
};

export {AdjustableTextarea};
