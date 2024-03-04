"use client"
import Link from 'next/link';
import { ScopedCssBaseline } from '@mui/material';

export default function Home() {
  return (
    <ScopedCssBaseline>
        <main>
        <Link href="/occupation">Occupation</Link>
        </main>
    </ScopedCssBaseline>
  );
}
