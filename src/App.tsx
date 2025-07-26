import React from 'react'
import { useChat } from './hooks/useChat';
import { AdjustableTextarea } from './components/AdjustableTextarea';

function App() {
  const [input, setInput] = React.useState<string>('');
  const { messages, isLoading, submit } = useChat();

  const handleSubmit = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    submit(input);
    setInput('');
  };
  
  return (
    <>
      <table>
        <tbody>
          {messages.map((message, index) => (
            <tr key={index}>
              <td><strong>{message.role === 'user' ? 'User' : 'AI'}</strong></td>
              <td><AdjustableTextarea text={message.content} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && <div>Loading...</div>}
      <br/><br/>
      <form onSubmit={handleSubmit}>
        <input style={{width: '800px'}} name="prompt" value={input} onChange={(event) => setInput(event.target.value)} disabled={isLoading} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App
