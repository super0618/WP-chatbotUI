import React from 'react'
import type {Metadata} from 'next'

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export  function generateMetadata({params}: Props): Metadata {
  const metadataList: any = {
    en: {
      title: "This is a En title",
      description: "This is a En description",
    },
    he: {
      title: "This is a He title",
      description: "This is a He description",
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
