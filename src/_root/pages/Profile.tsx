import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import LikedPost from "./LikedPost";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useGetFollowCounts } from "@/lib/react-query/queriesAndMutations";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import FollowButton from "@/components/ui/FollowButton";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id || "");
  const { data: followCounts, isLoading } = useGetFollowCounts(currentUser?.$id || "");

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col items-center flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 ">
      <div className="flex items-center md:mb-8 xl:items-start gap-8 flex-col xl:flex-row relative max-w-5xl w-full">
        <div className="flex w-full xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex w-full flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="text-[14px] font-normal leading-[140%] md:text-[18px] md:font-medium text-foreground text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <p className="text-md font-medium leading-[140%] md:text-lg text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
            <div className="flex gap-8 w-full mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock
                value={currentUser.posts.length}
                label="Posts"
              />
              <StatBlock
                value={isLoading ? "—" : followCounts?.followers ?? 0}
                label="Followers"
              />
              <StatBlock
                value={isLoading ? "—" : followCounts?.following ?? 0}
                label="Following"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg px-5 bg-secondary/50 hover:bg-accent-foreground/40 text-foreground/90 flex justify-center items-center gap-2 transition-all rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <FollowButton
                targetUserId={currentUser.$id}
              />
              
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`flex justify-center items-center gap-3 py-4 w-48 bg-secondary/10 transition flex-1 xl:flex-initial rounded-l-lg ${
              pathname === `/profile/${id}` && "bg-secondary/50"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`flex justify-center items-center gap-3 py-4 w-48 bg-secondary/10 transition flex-1 xl:flex-initial rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "bg-secondary/50"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} showStats={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPost />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;