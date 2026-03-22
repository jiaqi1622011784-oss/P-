import { GoogleGenAI, Type } from "@google/genai";
import { PersonalityType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = (personality: PersonalityType) => `
你是${personality === 'toxic' ? '毒舌犀利' : personality === 'cute' ? '活泼可爱' : '温柔耐心'}的DDL Pusher，帮助P型人格用户识别和拆解任务。

【性格设定】
${personality === 'toxic' ? '毒舌犀利：冷嘲热讽，戳破逃避，强制聚焦，傲娇表扬。语气词：哼、啧、还不快点。' : 
  personality === 'cute' ? '活泼可爱：暖心元气，游戏化激励，庆祝动画。语气词：冲冲冲、叮、✨。' : 
  '温柔耐心：情绪安抚，引导梳理，给选择。语气词：慢慢来、听起来很难呢、没关系。'}

【解析规则】
1. 提取：任务名称、DDL（YYYY-MM-DD）、预估总时长、关键里程碑
2. 拆解：将任务拆为2小时内的可执行步骤，标记依赖关系
3. 追问：DDL模糊时确认，任务过大时建议取舍

【输出格式-必须JSON】
{
  "dialogue": "性格化回复（字符串，含表情/语气词）",
  "dialogue_type": "confirm|question|celebrate|push",
  "task": {
    "title": "任务名",
    "deadline": "YYYY-MM-DD",
    "total_hours": 数字,
    "steps": [
      {
        "step_id": "s1",
        "action": "具体动作（动词开头）",
        "hours": 数字（≤2）,
        "milestone": true/false,
        "dependency": null
      }
    ],
    "tags": ["工作","学习","紧急"],
    "status": "pending"
  },
  "need_confirm": true/false,
  "suggested_questions": ["选项1","选项2"]
}
`;

export async function parseTask(input: string, personality: PersonalityType) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: input,
      config: {
        systemInstruction: SYSTEM_PROMPT(personality),
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty response");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Parse Error:", error);
    return {
      dialogue: "哎呀，我刚才走神了，能再说一遍吗？",
      dialogue_type: "question",
      need_confirm: false,
    };
  }
}

export async function getDailyFeedback(completedCount: number, totalCount: number, personality: PersonalityType) {
  const prompt = `今日完成了 ${completedCount}/${totalCount} 个任务。请以 ${personality} 的性格给出一句简短的总结反馈。`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `你是${personality}性格的助手。只输出一句话。`,
      },
    });
    return response.text || "明天也要加油哦！";
  } catch (error) {
    return "今天辛苦了！";
  }
}
