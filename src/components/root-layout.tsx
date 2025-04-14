import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "./ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Outlet, useLocation } from "react-router";

type BreadcrumbData = {
  name: string;
  url?: string;
};

const breadcrumbConfig: Record<string, BreadcrumbData[]> = {
  "/": [
    {
      name: "Home",
    },
  ],
  "/settings": [
    {
      name: "App settings",
    },
  ],
};

export const RootLayout = () => {
  const { pathname } = useLocation();

  const breadcrumbs = breadcrumbConfig[pathname];

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          {breadcrumbs && (
            <>
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map(({ name, url }, i) => (
                    <>
                      <BreadcrumbItem>
                        {url ? (
                          <BreadcrumbLink href="url">{name}</BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{name}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {i !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </>
          )}
        </header>
        <div className="p-4 w-full h-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
