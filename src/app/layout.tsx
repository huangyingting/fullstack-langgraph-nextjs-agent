"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { ThreadProvider } from "@/contexts/ThreadContext";
import { UISettingsProvider } from "@/contexts/UISettingsContext";
import { ModelSettingsProvider } from "@/contexts/ModelSettingsContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>LangGraph & NextJS Agent</title>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ModelSettingsProvider>
            <UISettingsProvider>
              <ThreadProvider>{children}</ThreadProvider>
            </UISettingsProvider>
          </ModelSettingsProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
