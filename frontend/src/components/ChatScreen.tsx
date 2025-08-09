import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, User, Bot, Loader2 } from 'lucide-react';

interface ChatScreenProps {
  onBack: () => void;
  question?: string;
  expertName?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'expert';
  timestamp: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, question, expertName = 'Dr. Priya Kumari' }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const initialMessages: Message[] = [];
    if (question) {
      initialMessages.push({
        id: 1,
        text: question,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
    initialMessages.push({
      id: initialMessages.length + 1,
      text: "Hello! I'm here to help with your crop issue. Please provide any additional details you may have.",
      sender: 'expert',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    return initialMessages;
  });
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  console.log("ChatScreen component is rendering.");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callBackendAPIForExpert = async (userPrompt: string) => {
    setIsLoading(true);
    
    try {
      const API_BASE = 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, expertName })
});
      const result = await response.json();
      
      if (response.ok && result.success) {
        const expertResponse: Message = {
          id: messages.length + 2,
          text: result.response,
          sender: 'expert',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, expertResponse]);
      } else {
        const expertResponse: Message = {
          id: messages.length + 2,
          text: result.error || "I'm sorry, I couldn't get a response. Please try again.",
          sender: 'expert',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, expertResponse]);
      }
    } catch (error) {
      console.error('Error calling backend API:', error);
      const expertResponse: Message = {
        id: messages.length + 2,
        text: "I'm having trouble with the connection. Please try again in a moment.",
        sender: 'expert',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, expertResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    console.log("handleSendMessage function called. Current message:", newMessage);
    if (!newMessage.trim() || isLoading) {
      console.log("Message is empty or loading, not sending.");
      return;
    }
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    callBackendAPIForExpert(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // A log to confirm key presses are being captured
    console.log("Key pressed:", e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Chat with Expert</h2>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#0A7B31]" />
            {expertName} - Plant Pathology
          </CardTitle>
          <p className="text-sm text-muted-foreground">Available now • Responds within 5 minutes</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#0A7B31] text-white'
                      : 'bg-accent text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'expert' && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 prose prose-sm dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-accent text-foreground max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} variant="farmer" size="sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
