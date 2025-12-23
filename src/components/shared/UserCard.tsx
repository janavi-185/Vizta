import type { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  console.log("useCard Called!")
  return (
    <Link to={`/profile/${user.$id}`} className="flex justify-center items-center flex-col gap-4 border border-border rounded-2xl px-5 py-8">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex justify-center items-center flex-col gap-1">
        <p className="text-[16px] font-medium leading-[140%] text-foreground text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="bg-accent-foreground hover:bg-accent-foreground/80 text-foreground flex gap-2 px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;