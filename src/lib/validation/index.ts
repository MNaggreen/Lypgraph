import * as z from 'zod'
/* БИБЛИОТЕКА ПРОВЕРКИ ПРАВИЛЬНОСТИ ВВОДА */

/* тут мы создаем схему проверки на правильность ввода для SignupForm */
export const SingupValidation = z.object({
  name: z.string().min(2, { message: 'Имя должно состоять минимум из 2 символов.' }),
  username: z
    .string()
    .min(2, { message: 'Логин должен состоять минимум из 2 символов.' }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Пароль должен быть минимум 8 символов.' }),
})

/* тут мы создаем схему проверки на правильность ввода для SigninForm */
export const SinginValidation = z.object({
  name: z.string().min(2, { message: 'Имя должно состоять минимум из 2 символов.' }),
  username: z
    .string()
    .min(2, { message: 'Логин должен состоять минимум из 2 символов.' }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Пароль должен быть минимум 8 символов.' }),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Имя должно состоять минимум из 2 символов." }),
  username: z.string().min(2, { message: "Логин должен состоять минимум из 2 символов." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST проверка поста 
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Минимум 5 символов." }).max(2200, { message: "Максимум 2200 символов." }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "Это обязательное поле" }).max(1000, { message: "Максимум 1000 символов." }),
  tags: z.string(),
});