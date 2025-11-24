'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Search Menu</h1>

        <form
          className="flex gap-2"
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
    </div>
  );
}
