import React from 'react'
import type {Metadata} from 'next'

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export  function generateMetadata({params}: Props): Metadata {
  const metadataList: any = {
    en: {
      title: "Try now free Chat GPT + other models like Gemini, Claude etc",
      description: "Chatbot based on ChatGPT, Google Gemini, Cloud and more, for a free trial, including image creation without the need to create an account.",
    },
    he: {
      title: "צ'אט ג'יפיטי (GPT) - נסו עכשיו בחינם CHAT GPT ומודלים נוספים כגון GEMINI ויצירת תמונות",
      description: "צ'אט בוט מבוסס על צ'אט ג'פיטי, גוגל ג'ימיני, קלאוד ועד, לנסיון חינם, כולל יצירת תמונות ללא צורך ביצירת חשבון",
    },
    ar: {
      title: "جرب الآن مجاناً تشات جي بي تي بالعربية + نماذج أخرى مثل جيميني، كلود وغيرها",
      description: "تشات بوت مبني على تشات جي بي تي، جوجل جيميني، كلاود وأكثر، لتجربة مجانية، بما في ذلك إنشاء الصور بدون الحاجة لإنشاء حساب.",
    },
    ru: {
      title: "Попробуйте сейчас бесплатно Chat GPT на русском + другие модели",
      description: "Чат-бот, основанный на ChatGPT, Google Gemini, Cloud и других, для бесплатной пробной версии, включая создание изображений.",
    },
    uk: {
      title: "Спробуйте зараз безкоштовно Chat GPT українською + інші моделі",
      description: "Чатбот на базі ChatGPT, Google Gemini, Cloud та інших, для безкоштовного випробування, включаючи створення зображень.",
    },
    es: {
      title: "Prueba ahora gratis Chat GPT + otros modelos como Gemini, Claude, etc",
      description: "Chatbot basado en ChatGPT, Google Gemini, Cloud y más, para una prueba gratuita, incluida la creación de imágenes.",
    },
    fr: {
      title: "Essayez maintenant gratuitement Chat GPT + d'autres modèles comme Gemini, Claude, etc",
      description: "Chatbot basé sur ChatGPT, Google Gemini, Cloud et plus, pour un essai gratuit, y compris la création d'images.",
    },
    it: {
      title: "Prova ora gratuitamente Chat GPT + altri modelli come Gemini, Claude, ecc",
      description: "Chatbot basato su ChatGPT, Google Gemini, Cloud e altro, per una prova gratuita, inclusa la creazione di immagini.",
    },
    pt: {
      title: "Experimente agora grátis Chat GPT + outros modelos como Gemini, Claude, etc",
      description: "Chatbot baseado em ChatGPT, Google Gemini, Cloud e mais, para um teste gratuito, incluindo criação de imagens.",
    }
  }

  return {
    title: metadataList[params.locale].title,
    description: metadataList[params.locale].description
  }
}

export default function WorkspaceLayout({children}: { children: React.ReactNode }) {
  return children;
}
