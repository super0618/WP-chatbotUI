import { prisma } from "@/lib/prisma/prisma-client"

export async function POST(req: Request) {
  const reqData = await req.json()
  const resData = await prisma.message.deleteMany({
    where: {
      chat_id: parseInt(reqData.chat_id),
      sequence_number: { gte: reqData.sequence }
    }
  })
  return new Response(JSON.stringify(resData))
}
