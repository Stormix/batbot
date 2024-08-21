'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/ui/table/faceted-filter';
import { Platform } from '@batbot/types';
import { Table } from '@tanstack/react-table';
import { RxCross2, RxGlobe } from 'react-icons/rx';
import PlatformIcon from '../platform-icon';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ChatLogsToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by username..."
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('platform') && (
          <DataTableFacetedFilter
            column={table.getColumn('platform')}
            icon={RxGlobe}
            title="Platform"
            options={Object.values(Platform).map((platform) => ({
              label: platform,
              value: platform,
              icon: ({ className }: { className?: string }) => (
                <PlatformIcon platform={platform} className={className} />
              )
            }))}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <RxCross2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
