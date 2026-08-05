import { useState } from "react";
import { cn } from "@/lib/utils.js";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { ThemeProvider } from "@/providers/ThemeProvider.jsx";

export function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-brand-bg text-slate-800 transition-colors duration-200">
        <div className="flex h-screen">
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-out lg:translate-x-0 lg:static lg:inset-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-slate-900/20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg">
              <div className="h-full">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AppLayout;