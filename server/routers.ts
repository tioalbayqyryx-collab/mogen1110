import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { astro } from "iztro";
import { invokeLLM } from "./_core/llm";
import { createAstrolabe, getUserAstrolabes, getAstrolabeById, createKnowledgeBase, getKnowledgeByAstrolabeId, createQARecord, getQARecordsByAstrolabeId } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  astrolabe: router({
    // 建立排盤
    create: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        birthday: z.string(),
        birthTime: z.number().min(0).max(12),
        birthdayType: z.enum(["solar", "lunar"]),
        gender: z.enum(["male", "female"]),
      }))
      .mutation(async ({ ctx, input }) => {
        // 使用 iztro 進行排盤計算
        const astroData = input.birthdayType === "solar" 
          ? astro.bySolar(input.birthday, input.birthTime, input.gender)
          : astro.byLunar(input.birthday, input.birthTime, input.gender, false);
        
        // 儲存排盤資料到資料庫
        const saved = await createAstrolabe({
          userId: ctx.user.id,
          name: input.name || `排盤_${new Date().toLocaleDateString()}`,
          birthday: input.birthday,
          birthTime: input.birthTime,
          birthdayType: input.birthdayType,
          gender: input.gender,
          astroData: JSON.stringify(astroData),
          aiInterpretation: null,
        });
        
        // 解析每個宮位的星曜資訊並儲存到知識庫
        const palaces = astroData.palaces;
        for (let i = 0; i < palaces.length; i++) {
          const palace = palaces[i];
          
          await createKnowledgeBase({
            astrolabeId: saved.id,
            palaceName: palace.name,
            palaceIndex: i,
            earthlyBranch: palace.earthlyBranch,
            heavenlyStem: palace.heavenlyStem,
            majorStars: JSON.stringify(palace.majorStars || []),
            minorStars: JSON.stringify(palace.minorStars || []),
            adjStars: JSON.stringify((palace as any).adjStars || []),
            changSheng12: (palace as any).changsheng12 || null,
            boshi12: (palace as any).boshi12 || null,
            jiangqian12: (palace as any).jiangqian12 || null,
            suiqian12: (palace as any).suiqian12 || null,
            decadal: JSON.stringify((palace as any).decadal || {}),
            ages: JSON.stringify((palace as any).ages || []),
          });
        }
        
        return {
          id: saved.id,
          astroData,
        };
      }),
    
    // 取得用戶的排盤歷史
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserAstrolabes(ctx.user.id);
    }),
    
    // 取得單一排盤詳情
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const astrolabe = await getAstrolabeById(input.id);
        if (!astrolabe) throw new Error("排盤紀錄不存在");
        
        return {
          ...astrolabe,
          astroData: JSON.parse(astrolabe.astroData),
        };
      }),
  }),
  
  qa: router({
    // 提問 AI
    ask: protectedProcedure
      .input(z.object({
        astrolabeId: z.number(),
        question: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // 獲取排盤資料
        const astrolabe = await getAstrolabeById(input.astrolabeId);
        if (!astrolabe) throw new Error("排盤紀錄不存在");
        
        // 獲取知識庫資料
        const knowledge = await getKnowledgeByAstrolabeId(input.astrolabeId);
        
        // 構建知識庫上下文
        const knowledgeContext = knowledge.map(k => {
          const majorStars = JSON.parse(k.majorStars || '[]');
          const minorStars = JSON.parse(k.minorStars || '[]');
          
          return `${k.palaceName}: 天干=${k.heavenlyStem}, 地支=${k.earthlyBranch}, 主星=${majorStars.map((s: any) => `${s.name}(${s.type}, ${s.brightness || '無'})`).join('、')}, 輔星=${minorStars.map((s: any) => s.name).join('、')}`;
        }).join('\n');
        
        // 調用 LLM 進行問答
        const systemPrompt = `你是一位專業的紫微斗數命理師,擅長根據星盤資訊回答用戶的問題。

以下是用戶的紫微斗數排盤資訊:
出生日期: ${astrolabe.birthday}
出生時辰: ${astrolabe.birthTime}
性別: ${astrolabe.gender === 'male' ? '男' : '女'}

各宮位詳細資訊:
${knowledgeContext}

請根據以上資訊,精準且專業地回答用戶的問題。回答時請指出相關的宮位和星曜,並提供具體的解釋。`;
        
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.question },
            ],
          });
          
          const answer = typeof response.choices[0].message.content === 'string'
            ? response.choices[0].message.content
            : '抱歉,無法生成回答,請稍後再試。';
          
          // 儲存問答紀錄
          await createQARecord({
            astrolabeId: input.astrolabeId,
            userId: ctx.user.id,
            question: input.question,
            answer,
          });
          
          return {
            answer,
          };
        } catch (error) {
          console.error('AI 問答失敗:', error);
          throw new Error('抱歉,AI 問答服務暫時無法使用,請稍後再試。');
        }
      }),
    
    // 獲取問答歷史
    history: protectedProcedure
      .input(z.object({ astrolabeId: z.number() }))
      .query(async ({ input }) => {
        return getQARecordsByAstrolabeId(input.astrolabeId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
