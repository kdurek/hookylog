import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { headers as headersPromise } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { navItems } from "@/app/(app)/nav-items";

function findPageTitle(pathname: string): string | undefined {
  return navItems
    .flatMap((section) => section.items)
    .find((item) => item.url === pathname)?.title;
}

function findParentTitle(pathname: string): string | undefined {
  return navItems.find((section) =>
    section.items.some((item) => item.url === pathname),
  )?.title;
}

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headers = await headersPromise();

  const session = await auth.api.getSession({
    headers,
  });

  if (!session?.user) {
    redirect("/login");
  }

  const pathname = headers.get("x-current-path") ?? "/";
  const parentTitle = findParentTitle(pathname);
  const pageTitle = findPageTitle(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {parentTitle && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">{parentTitle}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
