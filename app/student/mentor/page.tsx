import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { AIMentorChat } from "@/components/student/ai-mentor-chat"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function StudentMentorPage() {
  const user = await getSession()

  if (!user || user.role !== "student") {
    redirect("/login")
  }

  return <AIMentorChat user={user} />
}