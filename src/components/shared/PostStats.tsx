import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  /* получаем список лайкнувших */
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  /* устанавоиваем как текущее значени полученные лайки */
  const [likes, setLikes] = useState<string[]>(likesList);
  /* изначально пост не сохранен */
  const [isSaved, setIsSaved] = useState(false);

  /*  наши кастомные хуки оторые мы используем в функция нижу */
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  /* какие юзер посты сохранил и другое мы получим */
  const { data: currentUser } = useGetCurrentUser();

  /* проверяем сохранена ли ха этим юзером */
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  /* проверяем сохранена ли ха этим юзером и ставим в стейт*/
  useEffect(() => {
    /* превращаем в true или flase */
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

/* ставим лайк */
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    /* задем список лайков */
    let likesArray = [...likes];

    /* проверяем лайкнул лиюзер если да то убираем по клику*/
    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      /* или просто добавляем юзера */
      likesArray.push(userId);
    }

    /* устанавляваем */
    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  /* сохраняем */
  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    /* проверяем сохранено ли если да убираем по клику */
    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post.$id });
    setIsSaved(true);
  };

  /* формируем динамическую строку соглансо адресу где мы находимся */
  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        {/* лайки если лаки есть и пользовтел уже нажал то картинка будет другая*/}
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        {/* колво лайков */}
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {/* сделать закладку если уже сделана то картинка другая*/}
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
    </div>
  );
};

export default PostStats;