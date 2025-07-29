import { createOpenAI } from '@ai-sdk/openai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { experimental_createMCPClient, generateText, tool, type ToolSet } from 'ai';
import { useEffect, useState } from 'react';
import z from 'zod';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const mcpUrl = new URL('http://localhost:8099/mcp');

const buidTools = async (): Promise<ToolSet> => {
  const mcpClient = await experimental_createMCPClient({
    transport: new StreamableHTTPClientTransport(mcpUrl),
  });

  return await mcpClient.tools();
};

// Local tool for testing only
const weatherTool = tool({
  description: "Get the weather in a location",
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 12,
  }),
});

const context = `You are a helpful assistant. You can answer questions and do action about the software Akeneo PIM based on the user's input.
You must use the MCP tools to get API documentation for this software.
To search entities based on a specific criteria, you must use the MCP tools to get information about how to use filters and search queries.
Try to execute the command yourself. If you can't, try to explain which information is wrong and which is missing.
For API with methods that modify resources, like POST, PATCH, or DELETE, ask the user for confirmation before proceeding by explaining the changes and impacts.
`;

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tools, setTools] = useState<ToolSet|null>(null);

  useEffect(() => {
    buidTools().then((tools) => {
      setTools(tools);
      console.log('Tools found:', tools);
    }).catch((error) => {
      console.error('Error building tools:', error);
    });
  }, []);

  const submit = (prompt: string) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      console.error('API key is not set. Please set the VITE_API_KEY environment variable.');
      setIsLoading(false);
      return;
    }
    
    if (!prompt || '' === prompt.trim()) {
      return;
    }
    if (null === tools) {
      console.log('No tools available yet, please wait or check errors in console');
      return;
    }

    const newMessages = [...messages, {
      role: 'user',
      content: prompt,
    } as Message];
    setMessages(newMessages);

    setIsLoading(true);

    const openai = createOpenAI({
      apiKey,
    })
    generateText({
      model: openai('gpt-4.1'),
      messages: [
        {role: 'user', content: context},
        ...newMessages
      ],
      tools,
      // tools: {weatherTool},
      maxSteps: 10,
    }).then((response) => {
      console.log('response', response);
      
      setMessages(previousMessages => [...previousMessages, {
        role: 'assistant',
        content: response.text,
      }]);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error generating text:', error);
      setIsLoading(false);
    })
  };

  return {messages, isLoading, submit};
};

export {useChat};
