import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Mainbar from '~/components/forum/Mainbar'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/_client/threads/')({
  component: ThreadPage,
})

function ThreadPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('popular')

  // The Svelte version fetched data in the page component, but it's cleaner in React
  // to let Mainbar (which wraps ThreadCardList) handle InfiniteQuery or just pass down the states

  return (
    <>
       {/* Max Width container like Svelte or just flexible? Svelte usually used flex-1 container */}
      <div className="h-full flex-1">
        <Mainbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

    </>
  )
}