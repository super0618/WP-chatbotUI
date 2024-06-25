import { prisma } from "@/lib/prisma/prisma-client"

export async function POST(req: Request) {
  const reqData = await req.json()
  const resData = await prisma.chat.update({
    where: { id: reqData.id },
    data: { name: reqData.name }
  })
  return new Response(JSON.stringify(resData))
}
