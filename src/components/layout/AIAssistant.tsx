import { useState } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o assistente do AgrOmie. Como posso ajudá-lo hoje? Posso explicar qualquer funcionalidade ou ajudá-lo a navegar pelo sistema.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { message: input, history: messages },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast({
        title: "Erro ao contatar assistente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 h-20 w-20 rounded-full shadow-2xl bg-primary hover:bg-primary-dark transition-all z-50"
        size="icon"
        aria-label={isOpen ? "Fechar assistente de IA" : "Abrir assistente de IA"}
      >
        {isOpen ? (
          <X className="h-10 w-10" aria-hidden="true" />
        ) : (
          <MessageSquare className="h-10 w-10" aria-hidden="true" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-32 right-8 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col border-4 border-primary">
          <div className="bg-gradient-primary p-6 rounded-t-xl border-b-4 border-primary-dark">
            <h2 className="text-2xl font-bold text-primary-foreground flex items-center gap-3">
              <MessageSquare className="h-7 w-7" aria-hidden="true" />
              Assistente AgrOmie
            </h2>
            <p className="text-base text-primary-foreground/90 mt-1 font-medium">
              Sempre aqui para ajudar você
            </p>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-5 rounded-2xl text-lg leading-relaxed ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-foreground border-2 border-border"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-5 rounded-2xl border-2 border-border flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                    <span className="text-lg font-medium">Pensando...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t-4 border-border">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="flex-1 text-lg h-14 border-2 px-5"
                aria-label="Campo de mensagem"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-14 w-14"
                aria-label="Enviar mensagem"
              >
                <Send className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
