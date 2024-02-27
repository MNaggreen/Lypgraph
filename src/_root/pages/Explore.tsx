import { useEffect, useState } from 'react'

/* так мы узнаем что пользоватль добрался до конца страницы и мы подгрузим новые посты */
import { useInView } from 'react-intersection-observer'

import { Input } from '@/components/ui'
import useDebounce from '@/hooks/useDebounce'
import { GridPostList, Loader } from '@/components/shared'
import {
  useGetPosts,
  useSearchPosts,
} from '@/lib/react-query/queriesAndMutations'

export type SearchResultProps = {
  isSearchFetching: boolean
  searchedPosts: any
}

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  /* если идет загрузка */
  if (isSearchFetching) {
    return <Loader />
    /* если этот стейт существует и его длина больше 0 то мы покажем список постов */
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">Ничего не найдено</p>
    )
  }
}

const Explore = () => {
  const { ref, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

  /* поисковой запрос */
  const [searchValue, setSearchValue] = useState('')

  /* создаем некий таймер который будет работать перед тем как запустится поиск */
  /* он позволит сохранить производительность */
  const debouncedSearch = useDebounce(searchValue, 500)

  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedSearch)

  /* так работает бесконеынй скролл когда мы достигли конца страницы и когда у нас нет поискового запроса */
  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage()
    }
  }, [inView, searchValue])

  /* если постов нет будет лоадер */
  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )

  /* если строка не равна пустой то мы показываем */
  const shouldShowSearchResults = searchValue !== ''

  /* проверяем страницы постов и каждый должен имет хотябы один */
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0)

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Исследуйте</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Поиск"
            className="explore-search"
            value={searchValue}
            /* получаем значение и можем его сразу использовать */
            onChange={(e) => {
              const { value } = e.target
              setSearchValue(value)
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Популярно Сегодня</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">Все</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>

      {/* функционал по бесконечному скроллу вниз */}

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Explore
