import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import type { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"



type PostFormProps = {
  post?: Models.Document;
  action?: "create" | "update";

}

const PostForm = ({ post, action }: PostFormProps) => {

  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {

      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : '',
      tags: post ? post.Tags.join(",") : '',
    },
  });


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if (!newPost) {
      toast('Please try again!', {
        description: 'Post creation failed.'
      })
    }

    navigate('/');
  }

  console.log(post?.Image);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-9 max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Caption</FormLabel>
              <FormControl>
                <Textarea className="h-36 rounded-xl outline-1 border-border "
                  {...field} />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.mediaUrl}

                />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Location</FormLabel>
              <FormControl>
                <Input type="text" className="input-custom" {...field} />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white !important">Add Tags (separated by comma ',' )</FormLabel>
              <FormControl>
                <Input type="text" className="input-custom border-border "
                  placeholder="JS, Expression, Learn"
                  {...field} />
              </FormControl>
              <FormMessage className="text-red !important" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button"
            variant='outline'
            className="whitespace-nowrap border  rounded-sm border-border p-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-foreground p-5 rounded-sm">
            Submit
          </Button>
        </div>

      </form>
    </Form>
  )
}

export default PostForm
