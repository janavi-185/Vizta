import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner"

const AllUsers = () => {
  
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();
  console.log(creators);
  if (isErrorCreators) {
    toast('Something Went Wrong!!');
    
    return;
  }

  return (
    <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 ">
      <div className="max-w-5xl flex flex-col items-start w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="w-full flex flex-wrap gap-7 max-w-5xl">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;