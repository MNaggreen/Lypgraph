import * as z from 'zod'
import { Models } from 'appwrite'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from '@/components/ui' 
import { PostValidation } from '@/lib/validation'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { FileUploader, Loader } from '@/components/shared'
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queriesAndMutations'

/* model.document получаем из appwrite */
type PostFormProps = {
  post?: Models.Document
  action: 'Создать' | 'Обновить'
}

/* обязательно нужно указывать тип получаемых данных */
const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  /* получаем id */
  const { user } = useUserContext()
  
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    /* задаем значения по умолчанию для проверки формы */
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post.location : '',
      tags: post ? post.tags.join(',') : '',
    },
  })

  /* в новой версии саменили isloading на ispending */
  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost()
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost()

  // Handler тут мы связыаемся с appwrite
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === 'Обновить') {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      })

      if (!updatedPost) {
        toast({
          title: `${action} неудачно. Попробуйте снова.`,
        })
      }
      return navigate(`/posts/${post.$id}`)
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    })

    if (!newPost) {
      toast({
        title: `${action} неудачно. Попробуйте снова.`,
      })
    }
    navigate('/')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Описание</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Добавить Фото</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Местоположение</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Добавить Теги (Разделенные запятой " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Искусство, Самовыражение, Обучение"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {/* динамически показываем update или create */}
            {action} Пост
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
