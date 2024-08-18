'use client';

import { Role, RoleLabels } from '@/types/roles';
import { Table } from '@tanstack/react-table';
import { RxCross2 } from 'react-icons/rx';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTableFacetedFilter } from '../ui/table/faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CommandsToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('command')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('command')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('minRole') && (
          <DataTableFacetedFilter
            column={table.getColumn('minRole')}
            title="User Level"
            options={Object.values(Role)
              .filter((r) => !isNaN(Number(r)))
              .map((status) => ({
                label: RoleLabels[status as Role],
                value: status.toString()
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
