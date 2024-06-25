import { Toaster } from "@/components/ui/sonner"
import { GlobalState } from "@/components/utility/global-state"
import { Providers } from "@/components/utility/providers"
import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"
import "./[locale]/globals.css"

const inter = Inter({ subsets: ["latin"] })
interface RootLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "צ'אט ג'יפיטי (GPT) - נסו עכשיו בחינם CHAT GPT ומודלים נוספים כגון GEMINI ויצירת תמונות",
  description:
    "צ'אט בוט מבוסס על צ'אט ג'פיטי, גוגל ג'ימיני, קלאוד ועד, לנסיון חינם, כולל יצירת תמונות ללא צורך ביצירת חשבון"
}

export const viewport: Viewport = {
  themeColor: "#000000"
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TPNNJTJ');"
          }}
        ></script>
<script type="text/javascript" async src="https://platform.foremedia.net/code/37959/analytics"></script>
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TPNNJTJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <GlobalState>
          <Providers attribute="class" defaultTheme="dark">
            <Toaster richColors position="top-center" duration={3000} />
            {children}
          </Providers>
        </GlobalState>
      </body>
    </html>
  )
}
