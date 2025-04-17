/* eslint-disable no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { pathName } from '@/config/dashboard';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/trpc/react';
import { Category } from '@/types/main';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'SubCategory name must be at least 1 characters.',
  }),
  category_id: z.string().min(1, {
    message: 'Category name must be at least 1 characters.',
  }),
  description: z.string().max(264, {
    message: 'Description must be at most 264 characters.',
  }),
});

export default function SubCategoryForm({
  initialData,
  pageTitle,
}: {
  initialData: Category | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    category_id: initialData?.name || '',
    description: initialData?.description || '',
  };

  const router = useRouter();

  const utils = api.useUtils();

  const { toast } = useToast();

  const { data: listCategory, isLoading } = api.category.getAll.useQuery({});


  const createSubCategory = api.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.getAll.invalidate();
      toast({
        title: 'Success',
        description: 'Sub Category created successfully!',
      });
      router.push(pathName.categories);
    },
    onError: (error) => {
      console.error('Error creating sub category:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // const updateCategory = api.category.update.useMutation({
  //   onSuccess: async () => {
  //     await utils.category.getAll.invalidate();
  //     toast({
  //       title: 'Success',
  //       description: 'Category updated successfully!',
  //     });
  //     router.push(pathName.categories);
  //   },
  //   onError: (error) => {
  //     console.error('Error updating category:', error);
  //     toast({
  //       title: 'Error',
  //       description: error.message,
  //       variant: 'destructive',
  //     });
  //   },
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    // if (initialData?.id) {
    //   updateCategory.mutate({
    //     id: initialData.id,
    //     name: values.name,
    //     description: values.description,
    //   });
    // } else {
    //   createCategory.mutate({
    //     name: values.name,
    //     description: values.description,
    //   });
    // }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            className='text-gray-500 bg-black'
                            placeholder="Select a category to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          listCategory?.data.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {initialData?.id ? 'Update Category' : 'Create Category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
