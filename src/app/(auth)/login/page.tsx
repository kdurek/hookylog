import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Link href="/api/auth/signin" className={cn(buttonVariants())}>
        Login
      </Link>
    </div>
  );
}
