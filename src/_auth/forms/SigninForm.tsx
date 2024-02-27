import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
// библиотека всплывающего окна при успешной авторизации
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
/* ВЫШЕ БИБЛИОТЕКА SHADCN КОТОРАЯ НАМ ДАЕТ ГОТОВЫЕ ФОРМЫ И КНОПКИ */

import { SinginValidation } from '@/lib/validation'

/* БИБЛИОТЕКА ПРОВЕРИ ПРАВИЛЬНОСТИ ВВОДА */
import { z } from 'zod'

// загрузчик
import Loader from '@/components/shared/Loader'

// импортируем react query для более простоГо и централизованного создания пользователя
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

/* import { createUserAccount } from '@/lib/appwrite/api' 
мы это не используем потому что его теперь используем react queries в файле queriesAndMutations*/

const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  /* вытаскиваем все из quieriesAndMuttations */
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  // Queries централизованное сосояние ПЕРВОЕ это функция создания пользователя ВТОРОЕ это стейт загрузки создания пользователя
  const { mutateAsync: signInAccount } = useSignInAccount()

  // обозначаем форму с помощью Zod для проверки правильности ввода
  const form = useForm<z.infer<typeof SinginValidation>>({
    resolver: zodResolver(SinginValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // с помощью схемы Z провереям ввод в папке lib/validation/index.js после нажатия кнопки отправить
  // и создаем пользователя в appwrite (на сайте AppWrite появиться новый пользователь!)
  async function onSubmit(values: z.infer<typeof SinginValidation>) {
    /* создаем пользователя и входим в сессию (вызываем функцию из queriesandmutations а она из api.ts(appwrite))*/
    console.log('we are in')
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })
    console.log({ session })

    if (!session) {
      toast({ title: 'Something went wrong. Please login your new account' })

      navigate('/sign-in')

      return
    }

    /* проверяем аторизирован ли пользователь в AuthContext*/
    const isLoggedIn = await checkAuthUser()
    console.log({ isLoggedIn })

    /* если да */
    if (isLoggedIn) {
      form.reset()
      console.log('NAVIGATIN')

      navigate('/')
    } else {
      return toast({ title: 'Вход не удался. Попробуйте снова.' })
    }
  }

  return (
    /* логотип и сообщение новому пользователю */
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.png" alt="logo" width={300}/>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Войти в аккаунт</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          С возвращением! Введите ваши данные
        </p>

        {/* тут будет непосредственно форма */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {/* почта */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Электронная почта</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* пароль */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* кнопка отправки заполненной формы */}
          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Загрузка...
              </div>
            ) : (
              'Войти'
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Нет аккаунта?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Присоединиться
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
