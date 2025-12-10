import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { formatTimeAgo } from '@/lib/utils'

const PostDetails = () => {
  const {id} = useParams();
  const {data: post, isPending} = useGetPostById(id || '');

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 items-center ">
      {isPending? <Loader/> : (
        <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14  items-center">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post?.creator.$id}`}>
                    <img src={post?.creator?.imageUrl || '/public/assets/icons/profile-placeholder.svg' } alt="CreatorImg" 
                    className="rounded-full w-12 lg:h-12"/>
                </Link>
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
            </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
