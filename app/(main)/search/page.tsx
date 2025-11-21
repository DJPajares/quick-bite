'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Search Menu</h1>
      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          // Add search logic here
        }}
      >
        <Input
          type="text"
          placeholder="Search for dishes or drinks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>
      {/* Results would go here */}
      <div className="text-muted-foreground text-center">
        Enter a keyword to search the menu.
      </div>
    </div>
  );
}
