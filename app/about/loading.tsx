import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main
        className="max-w-[90%] mx-auto px-4 sm:px-6 py-12 flex-1 w-full"
        aria-busy="true"
        aria-label="Loading school information"
      >
        <div className="h-10 max-w-md mx-auto rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="h-12 w-12 rounded-xl bg-gray-200 animate-pulse mb-4" />
              <div className="h-5 w-2/3 rounded bg-gray-200 animate-pulse mb-3" />
              <div className="h-4 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
