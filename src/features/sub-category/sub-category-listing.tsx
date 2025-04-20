'use client';

import { subCategory } from '@/types/main';
import { DataTable as SubCategoryTable } from '@/components/ui/table-comp/data-table';
import { columns } from './sub-category-table/columns';
import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { DataTableSkeleton } from '@/components/ui/table-comp/data-table-skeleton';

// type CategoryListingPage = Record<string, never> & {};

export default function SubCategoryListingPage() {
  // Showcasing the use of search params cache in nested RSCs
  const queryParams = useSearchParams();
  const page = queryParams?.get('page');
  const search = queryParams?.get('q');
  const pageLimit = queryParams?.get('limit');

  const { data, isLoading } = api.subCategory.getAll.useQuery({
    page: page ? Number(page) : 1,
    limit: pageLimit ? Number(pageLimit) : 10,
    search: search || undefined,
  });

  const subCategories = data?.data || [];
  const totalSubCategories = data?.metadata.total || 0;

  if (isLoading) return <DataTableSkeleton />;

  return (
    <SubCategoryTable
      columns={columns}
      data={subCategories as unknown as subCategory[]}
      totalItems={totalSubCategories}
    />
  );
}
