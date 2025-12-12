import { useUserContext } from "@/context/AuthContext"
import type { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type GridPostListProps = {
    posts: Models.Document[],
    showUser?: boolean,
    showStats?: boolean,
}
const GridPostList = ({posts, showUser = true, showStats = true}: GridPostListProps ) => {
    const {user} = useUserContext();

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">

      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80 ">
            <Link to={`posts/${post.id}`} className="flex rounded-3xl border border-dark-4 overflow-hidden cursor-pointer w-full h-full">
                <img 
                src={post.Image} 
                alt="post-img"
                className="h-full w-full object-cover" />
            </Link>
            <div className="absolute bottom-0 p-5 flex items-center justify-between w-full bg-linear-to-t from-background/70 to-transparent rounded-b-3xl gap-2">
                {showUser && (
                    <div className="flex items-center justify-start gap-2 flex-1">
                        <img 
                        src={post.creator.imageUrl} 
                        alt="user-img"
                        className="h-8 w-8 rounded-full" />
                        <p>{post.creator.name}</p>
                    </div>
                )}

                {showStats && <PostStats post={post} userId={user.id}/>}
            </div>
        </li>
      ))}
    </div>
  )
}

export default GridPostList
