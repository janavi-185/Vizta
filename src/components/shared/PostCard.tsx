// import React from 'react'

import { useUserContext } from "@/context/AuthContext";
import {  formatTimeAgo } from "@/lib/utils";
import type { Models } from "appwrite"
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps ) => {

    const { user } = useUserContext();

  return (
    <div className="bg-accent/15 rounded-3xl border border-border p-5 lg:p-7 w-full max-w-screen-sm;">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                    <img src={post?.creator?.imageUrl || '/public/assets/icons/profile-placeholder.svg' } alt="CreatorImg" 
                    className="rounded-full w-12 lg:h-12"/>
                </Link>
                <div className="felx flex-col">
                    <p className="text-[16px] font-medium leading-[140%] lg:body-bold text-foreground">
                        {post.creator.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-foreground/50">
                    <p className="text-[12px] font-semibold leading-[140%] lg:text-[12px] lg:font-semibold ">
                        {formatTimeAgo(post.$createdAt)}
                    </p>
                     - 
                    <p className="text-[12px] font-semibold leading-[140%] lg:text-[12px] lg:font-semibold">
                        {post.location || 'Unknown Location'}
                    </p>
                    </div>

                </div>
            </div>
            <Link to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"} `}
            >
                <img src="/assets/icons/edit.svg" alt="edit"
                width={20} height={20}
                />
            </Link>
        </div>
        <Link to={`/posts/${post.$id}`}>
            <div className="text-[14px] font-medium leading-[140%] lg:text-[16px] lg:font-medium py-5">
                <p>{post.caption}</p>
                <ul className="flex gap-1 mt-2">
                    {post.Tags.map((tag: string)=>(
                        <li key={tag} className="text-foreground/60">
                            #{tag}
                        </li>
                    )
                     )}
                </ul>
            </div>
            <img src={post.Image || '/assets/icons/profile-placeholder.svg' }
            className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-3xl object-cover mb-5"
            alt="post-image" />
        </Link>

        <PostStats post={post} userId={user.id}/>
        
      
    </div>
  )
}

export default PostCard
