import { prisma } from "@/lib/prisma/prisma-client"

export async function POST(req: Request) {
  const reqData = await req.json()
  const data = await prisma.preset.findMany({ where: { user_id: reqData.id } })
  return new Response(JSON.stringify(data))
}
