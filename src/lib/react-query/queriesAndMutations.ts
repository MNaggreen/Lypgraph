/* ЭТО НАШ ГЛАВНЫЙ ФАЙЛ ТУТ БУДУТ ХРАНИТЬСЯ СТЕЙТЫ И ФУНКЦИИ ПО СОЗДАНИЮ УДАЛЕНИЮ И Т.Д. */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
/* устанавливаем react query npm install @tanstack/react-query для более легкого общения с сервером */

/* получаем ключи для необходимого создания */
import { QUERY_KEYS } from '@/lib/react-query/queryKeys'
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
} from '@/lib/appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'

// ============================================================
// AUTH QUERIES
// ============================================================

/* это мы будем использовать в нашем singup форм */
export const useCreateUserAccount = () => {
    /* mutateAsync это функция которая написана ниже она создает нового пользователя */
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
}

/* вход в аккаунт вызываем функцию из appwrite*/
 export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

// ============================================================
// POST QUERIES
// ============================================================

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    /* вызовется из appwrite/api */
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    /* вызовется из appwrite/api */
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        /* используем ключ специальный для создания */
        /* это мы делаем чтобы избежать багов */
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        /* показываем список всех постов заного без удаленного поста */
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    },
  })
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    /* вызываем из parrwrite/api */
    queryFn: getRecentPosts,
  })
}


export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  })
}


export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => {      
      if (lastPage && lastPage.documents.length === 0) {
        return null
      }      
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id
      return lastId
    },
  })
}


/* получить посто по id */
export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    /* ниже мы говорим что если обект не изменился то все будет кешировано */
    enabled: !!postId,
  })
}

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  })
}




/*  лайк */
export const useLikePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string
      likesArray: string[]
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      /* обновляем пост */
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      })
      /* обновляем недавние */
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      /* обновляем посты */
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      /* обновляем текущего пользователя */
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
}

/* сохранить */
export const useSavePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
}

/* удалить */
export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
} 

// ============================================================
// USER QUERIES
// ============================================================

/* какие юзер посты сохранил и другое мы получим */
 export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  })
}

/* получаем всех пользователей */
export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  })
}


export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      })
    },
  })
}
