import { Button } from "./button";
import { useUserContext } from "@/context/AuthContext";
import {
  useIsFollowing,
  useFollowUser,
  useUnfollowUser,
} from "@/lib/react-query/queriesAndMutations";

const FollowButton = ({ targetUserId }: { targetUserId: string }) => {
  const { user: currentUser } = useUserContext();

//   if (!currentUser?.id || currentUser.id === targetUserId) return null;

  const { data: isFollowing, isLoading } = useIsFollowing(
    currentUser.id,
    targetUserId
  );

  const followMutation = useFollowUser(
    currentUser.id,
    targetUserId
  );
  const unfollowMutation = useUnfollowUser(
    currentUser.id,
    targetUserId
  );

  if (isLoading) {
    return (
      <Button disabled
      className="bg-accent-foreground hover:bg-accent-foreground/80 text-foreground flex gap-2 px-8">
        Loading...
      </Button> 
    );
  }

  return (
    <Button
      type="button"
      disabled={followMutation.isPending || unfollowMutation.isPending}
     className={isFollowing ? 
        "bg-accent/70 hover:bg-accent-foreground/40 text-fore flex gap-2 px-5" :
        "bg-accent-foreground hover:bg-accent-foreground/80 text-foreground flex gap-2 px-5"}
      onClick={() =>
        isFollowing
          ? unfollowMutation.mutate({ 
            followerId: currentUser.id,
            followingId: targetUserId })
          : followMutation.mutate({ 
            followerId: currentUser.id,
            followingId: targetUserId })
      }
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
