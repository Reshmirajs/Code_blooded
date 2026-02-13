"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/journal/demo');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#fdfbf7]">
      <p className="text-gray-600">Redirecting to journal...</p>
    </div>
  );
}
