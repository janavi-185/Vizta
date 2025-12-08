// import React from 'react'
import { useUserContext } from "@/context/AuthContext";
import { useDeleteSavedPost, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import type { Models } from "appwrite"
import { useState } from "react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
}

const PostStats = ({post, userId}: PostStatsProps ) => {

  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList) ;
  const [isSaved, setIsSaved] = useState(false);

  const {mutate: likePost} = useLikePost();
  const {mutate: savePost} = useSavePost();
  const { mutate: deleteSavedPost} = useDeleteSavedPost();

  const { data: currentUser } = useUserContext();

  const handleLikePose = () => {}

  const handleSavePost = () => {}


  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={'/assets/icons/like.svg'}
          alt="Like"
          width={20}
          height={20}
          onClick={() => { handleLikePose() }}
          className="cursor-pointer"
        />
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">0</p>
      </div>

      <div className="flex gap-2 ">
        <img
          src={'/assets/icons/save.svg'}
          alt="Like"
          width={20}
          height={20}
          onClick={() => { handleSavePost() }}
          className="cursor-pointer"
        />
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">0</p>
      </div>
    </div>
  )
}

export default PostStats
