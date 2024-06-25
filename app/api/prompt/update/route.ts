import { prisma } from "@/lib/prisma/prisma-client"

export async function POST(req: Request) {
  const reqData = await req.json()
  const resData = await prisma.prompt.update({
    where: { id: reqData.id },
    data: reqData.updateState
  })
  return new Response(JSON.stringify(resData))
}
