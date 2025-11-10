import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Iztrolabe } from "react-iztro";
import { Streamdown } from "streamdown";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Astrolabe() {
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    birthTime: 0,
    birthdayType: "solar" as "solar" | "lunar",
    gender: "male" as "male" | "female",
  });
  
  const [result, setResult] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{question: string, answer: string}>>([]);
  
  const createMutation = trpc.astrolabe.create.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setChatHistory([]);
    },
  });
  
  const askMutation = trpc.qa.ask.useMutation({
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, { question, answer: data.answer }]);
      setQuestion("");
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createMutation.mutate(formData);
  };
  
  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result || !question.trim()) return;
    
    askMutation.mutate({
      astrolabeId: result.id,
      question: question.trim(),
    });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="border-b bg-background">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">
              <span className="text-xl font-bold cursor-pointer">專屬命理網站</span>
            </Link>
            <a href={getLoginUrl()}>
              <Button>登入</Button>
            </a>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">請先登入</h2>
            <p className="text-muted-foreground">您需要登入才能使用 AI 線上排盤功能</p>
            <a href={getLoginUrl()}>
              <Button size="lg">立即登入</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">專屬命理網站</span>
          </Link>
          <Link href="/">
            <Button variant="ghost">返回首頁</Button>
          </Link>
        </div>
      </nav>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">AI 線上排盤與問答</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: 輸入表單 */}
          <div className="space-y-6">
            <div className="bg-card text-card-foreground p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">請輸入出生資料</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">姓名 (選填)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="請輸入姓名"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthday">出生日期</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthTime">出生時辰</Label>
                  <Select
                    value={formData.birthTime.toString()}
                    onValueChange={(v) => setFormData({ ...formData, birthTime: parseInt(v) })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "子時 (23:00-01:00)",
                        "丑時 (01:00-03:00)",
                        "寅時 (03:00-05:00)",
                        "卯時 (05:00-07:00)",
                        "辰時 (07:00-09:00)",
                        "巳時 (09:00-11:00)",
                        "午時 (11:00-13:00)",
                        "未時 (13:00-15:00)",
                        "申時 (15:00-17:00)",
                        "酉時 (17:00-19:00)",
                        "戌時 (19:00-21:00)",
                        "亥時 (21:00-23:00)",
                      ].map((time, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>曆法</Label>
                  <RadioGroup
                    value={formData.birthdayType}
                    onValueChange={(v) => setFormData({ ...formData, birthdayType: v as any })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solar" id="solar" />
                      <Label htmlFor="solar" className="font-normal cursor-pointer">陽曆 (公曆)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lunar" id="lunar" />
                      <Label htmlFor="lunar" className="font-normal cursor-pointer">陰曆 (農曆)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>性別</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(v) => setFormData({ ...formData, gender: v as any })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">男</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">女</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {createMutation.isPending ? "排盤中..." : "開始排盤"}
                </Button>
                
                {createMutation.error && (
                  <p className="text-sm text-destructive">
                    排盤失敗: {createMutation.error.message}
                  </p>
                )}
              </form>
            </div>
            
            {/* AI 問答區 */}
            {result && (
              <div className="bg-card text-card-foreground p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">AI 命理問答</h2>
                
                <ScrollArea className="h-[300px] mb-4 p-4 bg-muted/30 rounded-lg">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>您可以針對排盤結果提問</p>
                      <p className="text-sm mt-2">例如: 我的事業運勢如何? 命宮有哪些主星?</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatHistory.map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="bg-primary text-primary-foreground p-3 rounded-lg ml-8">
                            <p className="text-sm font-medium">您的提問:</p>
                            <p>{item.question}</p>
                          </div>
                          <div className="bg-secondary text-secondary-foreground p-3 rounded-lg mr-8">
                            <p className="text-sm font-medium mb-1">AI 回答:</p>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <Streamdown>{item.answer}</Streamdown>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                
                <form onSubmit={handleAsk} className="flex gap-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="輸入您的問題..."
                    disabled={askMutation.isPending}
                  />
                  <Button type="submit" disabled={askMutation.isPending || !question.trim()}>
                    {askMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                
                {askMutation.error && (
                  <p className="text-sm text-destructive mt-2">
                    提問失敗: {askMutation.error.message}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* 右側: 排盤結果 */}
          <div>
            {result ? (
              <div className="bg-card text-card-foreground p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">紫微斗數星盤</h2>
                <div className="overflow-x-auto">
                  <Iztrolabe
                    birthday={formData.birthday}
                    birthTime={formData.birthTime}
                    birthdayType={formData.birthdayType}
                    gender={formData.gender}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-card text-card-foreground p-6 rounded-lg border h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>請在左側填寫出生資料後開始排盤</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
