import React, { useEffect } from 'react'
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import type { Models } from "appwrite"
import { useState } from "react";
import { checkIsLiked } from "@/lib/utils";
import Loader from './Loader';

type PostStatsProps = {
  post: Models.Document;
  userId: string;
}

const PostStats = ({post, userId}: PostStatsProps ) => {

  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList) ;
  const [isSaved, setIsSaved] = useState(false);

  const {mutate: likePost} = useLikePost();
  const {mutate: savePost, isPending: isSavingPost} = useSavePost();
  const {mutate: deleteSavedPost, isPending: isDeletingSavedPost} = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);

    if(hasLiked) {
      newLikes = newLikes.filter((like) => like !== userId);
    } else{
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({postId: post.$id, likesArray: newLikes});
    
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if(savedPostRecord){
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else{
      savePost({postId: post.$id, userId});
      setIsSaved(true);
    } 
  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes,userId) ?
             '/assets/icons/liked.svg'
             : '/assets/icons/like.svg'}
          alt="Like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">{likes.length}</p>
      </div>

      <div className="flex gap-2 ">
        {isSavingPost || isDeletingSavedPost ? <Loader/> : <img
          src={isSaved ? 
            '/assets/icons/saved.svg' 
          : '/assets/icons/save.svg'}
          alt="Like"
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
        /> }
        <p className="text-[14px] font-medium leading-[140%] lg:text-[16px]">{}</p>
      </div>
    </div>
  )
}

export default PostStats
