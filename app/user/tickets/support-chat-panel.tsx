"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUp, MessageCircle, Sparkles } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

type FaqItem = {
  title: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    title: "Track my order",
    question: "Where is my order right now?",
    answer:
      "I can help with that. Share your order ID and I will check the latest status and delivery estimate for you.",
  },
  {
    title: "Payment help",
    question: "Why did my payment fail?",
    answer:
      "Payment failures are usually caused by bank verification or limits. Try another card or contact your bank, and I can review the details if you share the order ID.",
  },
  {
    title: "Account access",
    question: "I cannot log in to my account.",
    answer:
      "No worries. Try resetting your password from the login screen. If that does not work, tell me your email and I will guide you.",
  },
  {
    title: "Refunds",
    question: "How do refunds work?",
    answer:
      "Refunds are processed back to the original payment method within 5 to 10 business days after approval. I can start a request if you share your order details.",
  },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi there! I am your support assistant. Ask me anything about orders, payments, or your account.",
  timestamp: Date.now(),
};

const fallbackReplies = [
  "Got it. Can you share a little more detail so I can help faster?",
  "Thanks for reaching out. I can help with that. What is your order ID?",
  "I am on it. Let me know the exact issue and I will guide you.",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
    </div>
  );
}

export function SupportChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getReply = (question: string) => {
    const match = FAQS.find(
      (item) => item.question.toLowerCase() === question.toLowerCase()
    );
    if (match) return match.answer;
    return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
  };

  const enqueueAssistantReply = (question: string) => {
    setIsTyping(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: getReply(question),
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
    }, 700 + Math.floor(Math.random() * 600));
  };

  const handleSend = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      },
    ]);
    setInputValue("");
    enqueueAssistantReply(trimmed);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Support Chat</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ask a quick question or start a detailed conversation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                AI Support
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[360px] space-y-4 overflow-y-auto rounded-2xl border border-border/60 bg-muted/10 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground ring-1 ring-border/60"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping ? (
              <div className="flex w-full justify-start">
                <div className="flex max-w-[60%] items-center gap-2 rounded-2xl bg-background px-4 py-3 text-sm ring-1 ring-border/60">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <TypingDots />
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-border/60">
          <div className="flex w-full items-end gap-3 rounded-2xl border border-border/60 bg-background px-3 py-2 shadow-sm">
            <Textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type your question here..."
              className="min-h-[44px] flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend(inputValue);
                }
              }}
            />
            <Button
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full",
                inputValue.trim().length === 0 && "opacity-60"
              )}
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Quick questions:</span>
            {FAQS.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                className="h-auto rounded-full border border-border/60 px-3 py-1 text-xs text-foreground hover:bg-muted/60"
                onClick={() => handleSend(item.question)}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
