import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Sparkles, Brain, Star, Clock, Shield, Users } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 導航列 */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/astrolabe">
              <Button variant="ghost">線上排盤</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">歡迎, {user?.name}</span>
                <Button variant="outline" onClick={() => logout()}>登出</Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>登入</Button>
              </a>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>結合傳統智慧與 AI 問答技術</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              專業紫微斗數
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI 智能命理服務
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              運用千年紫微斗數智慧,結合最先進的 AI 問答技術,為您提供精準的星盤分析與互動式問答服務,助您洞察人生運勢,把握關鍵機遇。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/astrolabe">
                <Button size="lg" className="text-lg px-8">
                  <Star className="w-5 h-5 mr-2" />
                  立即體驗 AI 排盤
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                了解更多
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* 服務特色 */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">為什麼選擇我們</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              我們將傳統命理學的深厚底蘊與現代 AI 技術完美結合,為您提供前所未有的命理體驗
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">精準排盤</h3>
              <p className="text-muted-foreground leading-relaxed">
                採用業界領先的 iztro 排盤引擎,確保每一張紫微斗數星盤都精準無誤,涵蓋所有主星、輔星、四化及神煞。
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI 智能問答</h3>
              <p className="text-muted-foreground leading-relaxed">
                運用先進的大型語言模型,根據您的星盤資訊,提供互動式的命理問答服務,讓您可以針對任何疑問獲得專業解答。
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">專業諮詢</h3>
              <p className="text-muted-foreground leading-relaxed">
                提供一對一的深度命理諮詢服務,由資深命理師親自解答您的人生疑惑,助您在關鍵時刻做出明智決策。
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">即時排盤</h3>
              <p className="text-muted-foreground leading-relaxed">
                無需等待,輸入出生資料後即可立即獲得完整的紫微斗數星盤,並可透過 AI 問答系統詢問任何問題,隨時隨地了解您的命運。
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">隱私保護</h3>
              <p className="text-muted-foreground leading-relaxed">
                我們高度重視您的個人隱私,所有排盤資料均採用加密儲存,絕不外洩,讓您安心使用我們的服務。
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">持續優化</h3>
              <p className="text-muted-foreground leading-relaxed">
                我們不斷優化 AI 解讀模型,並根據用戶反饋持續改進服務品質,為您提供越來越精準的命理分析。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 服務流程 */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">簡單三步驟</h2>
            <p className="text-muted-foreground text-lg">
              輕鬆獲得專業的紫微斗數命理分析
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold">輸入資料</h3>
              <p className="text-muted-foreground">
                填寫您的出生日期、時間、性別等基本資料
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold">AI 排盤</h3>
              <p className="text-muted-foreground">
                系統自動生成精準的紫微斗數星盤並建立知識庫
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold">查看結果</h3>
              <p className="text-muted-foreground">
                獲得完整的星盤圖表並可透過 AI 問答系統互動提問
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            準備好探索您的命運了嗎?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            立即體驗我們的 AI 線上排盤與問答服務,開啟您的命理探索之旅。無需等待,即刻獲得專業的紫微斗數分析與互動問答。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/astrolabe">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Star className="w-5 h-5 mr-2" />
                免費開始排盤
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img src={APP_LOGO} alt="Logo" className="h-6 w-6" />
              <span className="font-semibold">{APP_TITLE}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 {APP_TITLE}. 專業紫微斗數命理服務。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
