import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react"
import { useInView } from 'react-intersection-observer'

const Explore = () => {

  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const [searchValue, setSearchValue] = useState('');

  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])

  console.log(posts)
  if (!posts) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    )
  }
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item?.documents.length === 0);


  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 ">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 w-full rounded-lg bg-input/10 ">
          <div className="flex pl-2  gap-1 w-full bg-input/10 rounded-lg">
            <img
              src="/assets/icons/search.svg"
              alt="search"
              height={24}
              width={24}
            />

            <Input
              type="text"
              placeholder="Search"
              className="h-12 border-none cursor-pointer placeholder:text-muted-foreground  shadow-none bg-input/5 "
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

          </div>
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-7">
        <h2 className="body-bold md:h3-bold">Popular Today</h2>
        <div className="flex items-center justify-center rounded-2xl bg-accent/10 px-4 py-2 cursor-pointer">
          <p className="text-[14px] font-medium leading-[140%] md:text-[16px] md:font-medium"> All</p>

          <img
            src="/assets/icons/filter.svg "
            alt="filter"
            width={20}
            height={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPost={searchedPosts?.documents ?? []}
          />
        ) : shouldShowPosts ? (
          <p className="text-foreground mt-10 text-center w-full">End of posts</p>
        ) :
          posts.pages.map((item, index) => (
            <GridPostList 
            key={`page-${index}`} 
            posts={item?.documents ?? []} />
          ))
        }
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}

    </div>
  )
}

export default Explore
