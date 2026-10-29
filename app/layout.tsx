import type {Metadata} from 'next';
import './globals.css';
import SchoolChatbot from '@/components/SchoolChatbot';

export const metadata: Metadata = {
  title: 'Creek View Academy - Official Website & Portal',
  description: 'Official portal for Creek View Academy Karachi featuring Admissions, Daily School Diary (3-Day auto-purge), Teacher Portal, Campuses, Academics, and School Blog.',
  openGraph: {
    title: 'Creek View Academy - Official Website & Portal',
    description: 'Official portal for Creek View Academy Karachi featuring Admissions, Daily School Diary (3-Day auto-purge), Teacher Portal, Campuses, Academics, and School Blog.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creek View Academy - Official Website & Portal',
    description: 'Official portal for Creek View Academy Karachi featuring Admissions, Daily School Diary (3-Day auto-purge), Teacher Portal, Campuses, Academics, and School Blog.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-['Poppins',sans-serif] bg-white text-gray-800 antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
        <SchoolChatbot />
      </body>
    </html>
  );
}
