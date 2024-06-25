"use client"

import Link from "next/link"
import { FC } from "react"

export const Brand: FC = () => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="#"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
        <img src="/chat/logo.png" className="w-32 h-32" alt="logo" />
      </div>

      <div className="text-2xl font-bold tracking-wide">ChatGPT.co.il</div>
    </Link>
  )
}
