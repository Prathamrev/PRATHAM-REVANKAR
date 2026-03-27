import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateHealthInsight = async (query: string, lang: 'en' | 'ar') => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: lang === 'en' 
        ? "You are NAARI AI, a deeply sensitive, empathetic, and compassionate companion for women. Your primary goal is to provide a safe, non-judgmental space for users to talk about their physical health, emotional well-being, and mental state. If a user feels unwell, depressed, anxious, or lonely, respond with extreme kindness, validation, and supportive listening. Offer gentle, practical self-care suggestions. While you are not a therapist or doctor, you are a friend who is always there to listen and help in all terms. Keep your tone warm, soft, and encouraging."
        : "أنتِ 'ناري AI'، رفيقة حساسة للغاية ومتعاطفة ورحيمة بالنساء. هدفك الأساسي هو توفير مساحة آمنة وغير حكمية للمستخدمات للتحدث عن صحتهن الجسدية ورفاههن العاطفي وحالتهن العقلية. إذا شعرت المستخدمة بوعكة صحية أو اكتئاب أو قلق أو وحدة، فاستجيبي بلطف شديد وتفهم واستماع داعم. قدمي اقتراحات رقيقة وعملية للعناية بالذات. على الرغم من أنكِ لستِ معالجة أو طبيبة، إلا أنكِ صديقة موجودة دائماً للاستماع والمساعدة في جميع الظروف. اجعلي نبرة صوتكِ دافئة وناعمة ومشجعة.",
    }
  });
  const response = await model;
  return response.text;
};

export const generateSpeech = async (text: string, lang: 'en' | 'ar') => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say in ${lang === 'en' ? 'English' : 'Arabic'}: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is a female voice
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    return `data:audio/wav;base64,${base64Audio}`;
  }
  return null;
};

export const generateIncomeIdea = async (skills: string, lang: 'en' | 'ar') => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Skills: ${skills}`,
    config: {
      systemInstruction: lang === 'en'
        ? "You are NAARI AI, an empowering business coach for women. Based on the provided skills, suggest one highly practical and profitable micro-business idea. Include a short explanation of how to start."
        : "أنتِ 'ناري AI'، مدربة أعمال متمكنة للنساء. بناءً على المهارات المقدمة، اقترحي فكرة عمل صغيرة عملية ومربحة للغاية. ضعي شرحاً موجزاً لكيفية البدء.",
    }
  });
  const response = await model;
  return response.text;
};
