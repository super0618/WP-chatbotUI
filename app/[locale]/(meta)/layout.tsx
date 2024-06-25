"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { ReactNode, useContext, useEffect, useState } from "react"
import TranslationsProvider from "@/components/utility/translations-provider"
import initTranslations from "@/lib/i18n"
import Loading from "./loading"

interface WorkspaceLayoutProps {
  children: ReactNode
  params: { locale: string }
}

const i18nNamespaces = ["translation"]

export default function WorkspaceLayout({
  children,
  params: { locale }
}: WorkspaceLayoutProps) {
  const {
    dir,
    setProfile,
    setChats,
    setPresets,
    setPrompts,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)
  const [res, setRes] = useState()

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      const { resources } = await initTranslations(locale, i18nNamespaces)
      setRes(resources)
      setUserInput("")
      setChatMessages([])
      setSelectedChat(null)

      setIsGenerating(false)
      setFirstTokenReceived(false)

      try {
        const resAuth = await fetch(
          "https://chatgpt.co.il/wp-json/myplugin/v1/getAuth",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          }
        )
        const strAuth = await resAuth.json()
        const auth = JSON.parse(strAuth)
        if (auth) {
          const resMembership = await fetch(
            "https://chatgpt.co.il/wp-json/wps-mfw/get-user-membership",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                consumer_secret: process.env.COMSUMER_SECRET,
                user_id: auth.ID
              })
            }
          )
          const membership = await resMembership.json()
          if (membership.status === "success") {
            setProfile({ membership: membership.data, ...auth })
          } else {
            setProfile({ membership: false, ...auth })
          }

          const resChats = await fetch("/api/chat/getall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: auth.ID })
          })
          const chats = await resChats.json()
          setChats(chats)

          const resPresets = await fetch("/api/preset/getall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: auth.ID })
          })
          const presets = await resPresets.json()
          setPresets(presets)

          const resPrompts = await fetch("/api/prompt/getall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: auth.ID })
          })
          const prompts = await resPrompts.json()
          setPrompts(prompts)
        }
      } catch (err: any) {
        console.log(err)
      }

      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <div
        dir={dir}
        className="bg-background text-foreground flex h-screen flex-col items-center"
      >
        <Loading />
      </div>
    )
  }

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={res}
    >
      <div
        dir={dir}
        className="bg-background text-foreground flex h-screen flex-col items-center"
      >
        <Dashboard>{children}</Dashboard>
      </div>
    </TranslationsProvider>
  )
}
