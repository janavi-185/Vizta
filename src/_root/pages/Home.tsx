// import React from 'react'

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import type { Models } from "appwrite";



const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();

    const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,

  } = useGetUsers(10);
  // console.log('posts in home:', posts);

    if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14">
          <p className="text-[18px] font-medium leading-[140%] text-foreground">Something bad happened</p>
        </div>
        <div className="hidden xl:flex flex-col w-72 2xl:w-465 px-6 py-10 gap-10  overflow-scroll ">
          <p className="text-[18px] font-medium leading-[140%] text-foreground">Something bad happened</p>
        </div>
      </div>
    );
  }
//su thayu ena thi?
  return (
    <div className='flex overflow-scroll xl:flex-row flex-1 flex-col'>
      <div className='flex flex-col flex-1 items-center gap-10 py-10 px-5 xl:w-3/4 md:px-8 lg:p-14  '>
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div> 
      <div className="xl:flex flex-col md:w-full xl:w-1/4 px-6 py-10 gap-10 ">
          <div className="max-w-screen-sm lg:pl-35 xl:p-0 flex flex-col items-center w-full gap-6 md:gap-9">
          <h3 className="h3-bold md:h2-bold text-left w-full text-foreground">Top Creators</h3>
          {isUserLoading && !creators ? (
            <Loader />
          ) : ( 
            <ul className="flex flex-col sm:flex-row xl:flex-col flex-1  gap-9 w-full">
              {creators?.documents.map((creator) => (
                <li key={creator?.$id} className="w-full ">
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
          )}
          </div>
      </div>
    </div>

  );
}

export default Home




