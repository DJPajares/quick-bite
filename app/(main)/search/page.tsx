'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { use, useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Menu</h1>
      <form
        className="flex gap-2 mb-6"
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
