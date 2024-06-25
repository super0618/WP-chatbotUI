import { prisma } from "@/lib/prisma/prisma-client"

export async function POST(req: Request) {
  const reqData = await req.json()
  const res1 = await prisma.message.create({ data: reqData[0] })
  const res2 = await prisma.message.create({ data: reqData[1] })

  return new Response(JSON.stringify([res1, res2]))
}
