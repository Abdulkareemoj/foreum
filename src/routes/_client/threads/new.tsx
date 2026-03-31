import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { trpc } from '~/lib/trpc'
import { toast } from 'sonner'

import { PlateEditor } from '~/components/editor/plate-editor'
import MultipleSelector from '~/components/ui/multi-select'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export const Route = createFileRoute('/_client/threads/new')({
  component: NewThreadPage,
})

const threadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().refine((val) => {
      try {
          const parsed = JSON.parse(val);
          if (!parsed || !Array.isArray(parsed)) return false;
          // Just extremely simplistic checking that there is text
          const hasText = parsed.some(block => block.children?.some((child: any) => child.text !== undefined));
          // Plate sometimes yields an array with empty paragraphs `[{type: 'p', children:[{text:''}]}]`
          const isEmpty = parsed.length === 1 && parsed[0].type === 'p' && parsed[0].children?.length === 1 && parsed[0].children[0].text === '';
          return hasText && !isEmpty;
      } catch (err) {
          return false;
      }
  }, { message: 'Content is required' }),
  categoryId: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).optional(),
})

function NewThreadPage() {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  
  const { data: categories, isLoading: categoriesLoading } = trpc.category.list.useQuery()
  
  const createThread = trpc.thread.create.useMutation({
    onSuccess: (data) => {
      toast.success('Thread created successfully')
      utils.thread.list.invalidate()
      navigate({ to: '/threads/thread/$id', params: { id: data.id } })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create thread')
    },
  })

  const form = useForm({
    defaultValues: {
      title: '',
      content: JSON.stringify([{ type: 'p', children: [{ text: '' }] }]),
      categoryId: '',
      tags: [] as string[],
    },
    validators: {
      onChange: threadSchema,
    },
    onSubmit: async ({ value }) => {
      await createThread.mutateAsync(value)
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 fade-in animate-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Create New Thread</h1>
        <p className="text-muted-foreground">
          Start a new discussion in the community
        </p>
      </div>
      
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6 bg-card border rounded-lg p-6 shadow-sm"
      >
        <form.Field
          name="title"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a descriptive title"
                disabled={createThread.isPending}
                maxLength={200}
                className="bg-background"
              />
              <div className="flex justify-between items-start">
                  {field.state.meta.errors ? (
                    <em role="alert" className="text-xs text-destructive font-medium">
                      {field.state.meta.errors.join(', ')}
                    </em>
                  ) : <span />}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {field.state.value.length}/200
                  </span>
              </div>
            </div>
          )}
        />

        <form.Field
          name="categoryId"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Category</Label>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
                disabled={categoriesLoading || createThread.isPending}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors ? (
                <em role="alert" className="text-xs text-destructive font-medium">
                  {field.state.meta.errors.join(', ')}
                </em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="content"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Content</Label>
              <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow">
                <PlateEditor
                  value={(() => {
                    try {
                      return JSON.parse(field.state.value)
                    } catch (e) {
                      return [{ type: 'p', children: [{ text: '' }] }]
                    }
                  })()}
                  onChange={(val) => field.handleChange(JSON.stringify(val))}
                  disabled={createThread.isPending}
                />
              </div>
              {field.state.meta.errors ? (
                <em role="alert" className="text-xs text-destructive font-medium">
                  {field.state.meta.errors.join(', ')}
                </em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="tags"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Tags (optional)</Label>
              <MultipleSelector
                value={(field.state.value || []).map((t: string) => ({ label: t, value: t }))}
                onChange={(options) => field.handleChange(options.map((o) => o.value))}
                placeholder="Select tags"
                creatable
                emptyIndicator={<p className="text-center text-sm py-2">No predefined tags found.</p>}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground pt-1">
                Type and press enter to add tags. Separate items to help others discover your thread.
              </p>
            </div>
          )}
        />

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: '/threads' })}
            disabled={createThread.isPending}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || createThread.isPending}>
                {createThread.isPending ? 'Creating...' : 'Create Thread'}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
