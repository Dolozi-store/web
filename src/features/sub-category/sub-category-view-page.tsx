import { notFound } from 'next/navigation';
import SubCategoryForm from './sub-category-form';
import { api } from '@/trpc/server';
import { subCategory } from '@/types/main';

type TSubCategoryViewPageProps = {
  subCategoryId: string;
};

export default async function SubCategoryViewPage({
  subCategoryId,
}: TSubCategoryViewPageProps) {
  let subCategory = null;
  let pageTitle = 'Create New Sub Category';

  if (subCategoryId !== 'create') {
    const data = await api?.subCategory?.getSubCategoryById({ id: subCategoryId });

    console.log({ data });
    subCategory = data as unknown as subCategory;
    if (!subCategory) {
      notFound();
    }
    pageTitle = `Update Sub Category`;
  }

  return <SubCategoryForm initialData={subCategory} pageTitle={pageTitle} />;
}
