import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: 'default' | 'farmer' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      farmer: "bg-[#0A7B31] text-white shadow hover:bg-[#0A7B31]/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    };
    const combinedClasses = `${baseClasses} ${variants[variant!] || variants.default} ${sizes[size!] || sizes.default} ${className || ''}`;
    return <button className={combinedClasses} ref={ref} {...props} />;
  }
);

const Card = ({ className, ...props }) => {
  const combinedClasses = `rounded-xl border bg-card text-card-foreground shadow ${className || ''}`;
  return <div className={combinedClasses} {...props} />;
};

const CardHeader = ({ className, ...props }) => {
  const combinedClasses = `flex flex-col space-y-1.5 p-6 ${className || ''}`;
  return <div className={combinedClasses} {...props} />;
};

const CardTitle = ({ className, ...props }) => {
  const combinedClasses = `text-2xl font-semibold leading-none tracking-tight ${className || ''}`;
  return <h3 className={combinedClasses} {...props} />;
};

const CardContent = ({ className, ...props }) => {
  const combinedClasses = `p-6 pt-0 ${className || ''}`;
  return <div className={combinedClasses} {...props} />;
};

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const combinedClasses = `flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`;
  return <input type={type} className={combinedClasses} ref={ref} {...props} />;
});

const Badge = ({ className, variant, ...props }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };
  const combinedClasses = `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant] || variants.default} ${className || ''}`;
  return <div className={combinedClasses} {...props} />;
};

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'expert';
  timestamp: string;
}

export const ChatBot = ({ onStartChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I\'m your agricultural assistant. I can help you with crop diseases, farming tips, and expert advice. How can I assist you today?',
      sender: 'expert',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    'How to identify crop diseases?',
    'Best fertilizers for crops',
    'Weather impact on farming',
    'Pest control methods',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callGeminiAPI = async (userPrompt) => {
    setIsLoading(true);
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: `Act as a friendly, concise, and helpful agricultural assistant. Respond to this question: ${userPrompt}` }] });
    const payload = { contents: chatHistory };
    const apiKey =  'AIzaSyBItHMcDz_NkJ4iWl3SmgFPM7QlMCo83ZQ';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const botResponseText = result.candidates[0].content.parts[0].text;
        const botResponse: Message = {
          id: messages.length + 2,
          text: botResponseText,
          sender: 'expert',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Sorry, I couldn't generate a response. Please try again.",
          sender: 'expert',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const botResponse: Message = {
        id: messages.length + 2,
        text: "I'm having trouble connecting right now. Please check your network connection.",
        sender: 'expert',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    callGeminiAPI(inputValue);
    setInputValue('');
  };

  const handleQuickQuestion = (question) => {
    onStartChat(question);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#0A7B31] text-white hover:bg-[#0A7B31]/90 shadow-lg animate-pulse-glow z-[110]"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
  <Card className="fixed bottom-6 right-6 w-80 h-100 bg-card shadow-xl z-[110] animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#0A7B31] p-2 rounded-full">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg">Farm Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-80">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'expert' && (
                <div className="bg-[#0A7B31] p-1 rounded-full h-6 w-6 flex items-center justify-center">
                  <Bot className="h-3 w-3 text-white" />
                </div>
              )}
              <div
                className={`max-w-[200px] p-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {/* Using ReactMarkdown to render the message text */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
              {message.sender === 'user' && (
                <div className="bg-primary p-1 rounded-full h-6 w-6 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground max-w-[200px] p-2 rounded-lg text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-3 border-t">
          <div className="flex flex-wrap gap-1 mb-3">
            {quickQuestions.map((question) => (
              <Badge
                key={question}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-[#0A7B31] hover:text-white transition-colors"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Badge>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about farming..."
              className="text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-9 w-9 bg-[#0A7B31] hover:bg-[#0A7B31]/90"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
