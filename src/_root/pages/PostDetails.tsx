import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { useParams, Link } from 'react-router-dom'
import { formatTimeAgo } from '@/lib/utils'
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {
  const {id} = useParams();
  const {data: post, isPending} = useGetPostById(id || '');
  const { user } = useUserContext();

  const handleDeletePost = () => {

  }

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 items-center ">
      {isPending? <Loader/> : (
        <div className=" w-full max-w-5xl rounded-[30px] flex-col flex xl:flex-row border border-border xl:rounded-l-3xl">
          <img 
          src={post?.Image || '/assets/icons/profile-placeholder.svg' } 
          alt="post-image" 
          className="h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-3xl xl:rounded-tr-none object-cover p-5 bg-accent/10"/>
          <div className="bg-accent/10 flex flex-col gap-5 lg:gap-7 flex-1 items-start p-5">

            <div className="flex items-center justify-between w-full">
              <Link to={`/profile/${post?.creator.$id}`}
              className="flex items-center gap-3">
                <img 
                src={post?.creator?.imageUrl || '/public/assets/icons/profile-placeholder.svg' } 
                alt="CreatorImg" 
                className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
                <div className="felx flex-col">
                    <p className="text-[16px] font-medium leading-[140%] lg:body-bold text-foreground">
                        {post?.creator.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-foreground/50">
                    <p className="text-[12px] font-semibold leading-[140%] lg:text-[12px] lg:font-semibold ">
                        {formatTimeAgo(post?.$createdAt)}
                    </p>
                    - 
                    <p className="text-[12px] font-semibold leading-[140%] lg:text-[12px] lg:font-semibold">
                        {post?.location || 'Unknown Location'}
                    </p>
                    </div>
                </div>
              </Link>
               <div className="flex items-center justify-center ">
                <Link to={`/update-post/${post?.$id}`}
                className={`${user.id !== post?.creator.$id && "hidden"} `}>
                  <img 
                  src="/assets/icons/edit.svg" 
                  alt="edit"
                  height={24}
                  width={24}
                  className="" />
                 </Link>
                 <Button
                  onClick={handleDeletePost}
                  variant='ghost'
                  className={`${user.id !== post?.creator.$id && "hidden"}` }>
                    <img 
                    src="/assets/icons/delete.svg" 
                    alt="delete" 
                    height={24}
                    width={24}/>
                 </Button>
               </div>
             </div>  
             <hr className="border w-full border-accent/20"/>

             <div className="flex flex-col w-full flex-1 text-[14px] font-medium leading-[140%] lg:text-[16px] lg:font-normal">
                <p>{post?.caption}</p>
                <ul className="flex gap-1 mt-2">
                    {post?.Tags.map((tag: string)=>(
                        <li key={tag} className="text-foreground/60">
                            #{tag}
                        </li>
                    )
                     )}
                </ul>
            </div>
            <div className="w-full">
              {post && <PostStats post={post} userId={user.id}/>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
