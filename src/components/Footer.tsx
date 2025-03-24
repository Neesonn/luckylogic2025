'use client';
import React from 'react';
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[rgba(24,27,33,0.95)] backdrop-blur-md text-gray-400 text-sm p-4 text-center border-t border-white/10">
      <p>
        © {new Date().getFullYear()} Lucky Logic ·{" "}
        <Link href="/terms" className="underline hover:text-green-400 transition-colors">
          Terms & Conditions
        </Link>
      </p>
    </footer>
  );
} 