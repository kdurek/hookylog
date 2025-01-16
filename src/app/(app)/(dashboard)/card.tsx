import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const DashboardCard = ({
  title,
  link,
  children,
}: {
  title: string;
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="pl-2">{title}</CardTitle>
          <Link
            href={link}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
              }),
            )}
          >
            <ChevronRight />
          </Link>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
