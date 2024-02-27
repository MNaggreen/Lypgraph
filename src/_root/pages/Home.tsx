import { Models } from 'appwrite'

/* import { useToast } from '@/components/ui/use-toast' */
import { Loader,  PostCard, UserCard } from '@/components/shared'
import {
  useGetRecentPosts, useGetUsers,
} from '@/lib/react-query/queriesAndMutations'

const Home = () => {
  /* const { toast } = useToast() */
/* получаем посты пользователей */
   const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  /* получаем пользователй*/
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  /* если выпадет ошибка связанная с постами или пользователями то показываем сообщение */
  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Что то пошло не так</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Что то пошло не так</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Лента</h2>
          {/* и показываем посты */}
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {/* вытаскиваем и рендерим посты */}
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  {/* здесь будет рендериться карточка содержашая информацию */}
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

{/* панель справа top creators */}
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Топ Пользователей</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home
