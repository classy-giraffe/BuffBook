import React, { useState } from "react";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Search } from "lucide-react";

interface AdminFiltersProps {
  initialSearch: string;
  initialStatus: string;
  initialSort: string;
}

export function AdminFilters({ initialSearch, initialStatus, initialSort }: AdminFiltersProps) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);

  const applyFilters = (newSearch: string, newStatus: string, newSort: string) => {
    const params = new URLSearchParams(window.location.search);
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");
    
    params.set("status", newStatus);
    params.set("sort", newSort);

    window.location.search = params.toString();
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilters(search, status, sort);
    }
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    applyFilters(search, val, sort);
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    applyFilters(search, status, val);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search customers by name or email... (Press Enter)" 
          className="pl-9 bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className="flex gap-4">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="paid">Needs Fulfillment</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
