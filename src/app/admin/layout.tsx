import SessionProvider from '@/components/admin/SessionProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { inter } from '@/lib/fonts';

export const metadata = {
  title: 'Newsletter Admin',
  robots: { index: false, follow: false },
};

// Admin owns its own <html>/<body> now that the root layout is a static
// passthrough (it no longer renders document tags). Always English, LTR, noindex.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-black text-white">
              {children}
              <Toaster theme="dark" />
            </div>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
