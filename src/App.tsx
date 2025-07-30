import React, { useEffect } from 'react'
import { useChat } from './hooks/useChat';
import { AdjustableTextarea } from './components/AdjustableTextarea';

function App() {
  const [input, setInput] = React.useState<string>('');
  const { messages, isLoading, submit } = useChat();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    submit(input);
    setInput('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);
  
  return (
    <div style={{margin: '20px'}}>
      <table>
        <tbody>
          {messages.map((message, index) => (
            <tr key={index}>
              <td><strong>{message.role === 'user' ? 'User' : 'AI'}</strong></td>
              <td><AdjustableTextarea text={message.content} /></td>
            </tr>
          ))}
          <tr>
            <td><strong>Input</strong></td>
            <td>
              <form onSubmit={handleSubmit}>
                <input ref={inputRef} style={{width: '600px'}} name="prompt" value={input} onChange={(event) => setInput(event.target.value)} disabled={isLoading} />
                <button type="submit">Submit</button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>

      {isLoading && <div>Loading...</div>}
    </div>
  );
}

export default App
