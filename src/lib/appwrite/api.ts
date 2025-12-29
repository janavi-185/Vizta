import { ID, Query } from 'appwrite';
import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { account, appwriteConfig, avatars, databases, storage } from './config';
// import { data } from 'react-router-dom';


export async function createUserAccount(user: INewUser) {

    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: new URL(avatarUrl),
        })

        return newUser;

    }
    catch (error) {
        console.log("Error creating user account:", error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username: string;


}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    }
    catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        // // Delete any existing session before creating a new one
        // try {
        //     await account.deleteSession('current');
        // } catch {
        //     // No active session to delete, continue
        // }
        const session = await account.createEmailSession(user.email, user.password);

        return session;
    }
    catch (error) {
        console.log(error);

    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}


export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');

        return session;

    } catch (error) {
        console.log(error);
    }

}

//Create Post

export async function createPost(post: INewPost) {
    try {

        //Upload file to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;

        //get url
        const fileUrl = getFileUrl(uploadedFile.$id);
        // const fileUrl = fileUrlObj?.href;

        if (!fileUrl) {
            deleteFile(uploadedFile.$id);
            console.log("File URL not found");
            throw Error;
        }

        //convert tags in array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        // console.log("File URL:", fileUrl);
        // console.log("Tags Array:", tags);

        //create post in db
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                Image: fileUrl,
                imageid: uploadedFile.$id,
                location: post.location,
                Tags: tags,
            }

        )

        console.log("New Post after creation:", newPost);
        if (!newPost) {
            console.log("Post creation failed, deleted uploaded file.");
            await deleteFile(uploadedFile.$id);
            throw Error;

        }
        return newPost;

    } catch (error) {
        console.log("Error creating post:", error);
        console.log(error);
    }

}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;

    } catch (error) {
        console.log(error);
    }
}

// export function getFilePreview(fileId: string) {
//     try {
//         const fileUrl = storage.getFilePreview(
//             appwriteConfig.storageId,
//             fileId,
//             2000,
//             2000,
//             "top",
//             100,
//         )
//         console.log("File URL from pervoew:", fileUrl);
//         return fileUrl;
//     } catch (error) {
//         console.log(error);
//     }

// }
export function getFileUrl(fileId: string) {
    const fileUrl = storage.getFileView(
        appwriteConfig.storageId,
        fileId
    );

    return fileUrl.href;
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        )
        return { status: 'okay' };
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if (!posts) throw Error;

    return posts;

}

//like post 

export async function likedPost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;

    } catch (error) {
        console.log(error);
    }

}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;

    } catch (error) {
        console.log(error);
    }

}

//delete post

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,

        )

        if (!statusCode) throw Error;

        return { status: 'okay' };

    } catch (error) {
        console.log(error);
    }

}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        if (!post) throw Error;

        return post;
    } catch (error) {
        console.log(error);
    }
}

//update post

export async function updatePost(post: IUpdatePost) {

    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.Image,
            imageId: post.imageid,
        }

        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw Error;

            const fileUrl = getFileUrl(uploadedFile.$id);
            if (!fileUrl) {
                deleteFile(uploadedFile.$id);
                console.log("File URL not found");
                throw Error;
            }

            image = { ...image, imageUrl: new URL(fileUrl), imageId: uploadedFile.$id }
            console.log("Image after update:", image);
        }

        const tags = post.tags?.replace(/ /g, '').split(',') || [];


        //create post in db
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                Image: image.imageUrl,
                imageid: image.imageId,
                location: post.location,
                Tags: tags,
            }

        )

        if (!updatedPost) {
            await deleteFile(post.imageid);
            throw Error;

        }
        return updatedPost;

    } catch (error) {
        console.log("Error creating post:", error);
        console.log(error);
    }

}

export async function deletePost(postId: string, imageid: string) {
    if (!postId || imageid) throw Error;
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return { status: 'okay' };

    } catch (error) {
        console.log(error);
    }
}

//explorepage
export async function getInfinitePost({
  pageParam,
}: {
  pageParam?: string | null;
}) {
  const queries = [
    Query.orderDesc('$updatedAt'),
    Query.limit(10),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  return await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  );
}


export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)],
        )

        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error)
    }
}

export async function getUsers(limit?: number) {
  const queries: string[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }
  console.log(limit);
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFileUrl(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function followUser(
    followerId: string, 
    followingId: string
) {
//   console.log("FOLLOW API CALLED", followerId, followingId);÷

  return databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.followsCollectionId,
    ID.unique(),
    { 
        followerId, 
        followingId
     }
  );
}

export async function unfollowUser(
    followerId: string,
    followingId: string
){
    const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.followsCollectionId,
        [
            Query.equal('followerId', followerId),
            Query.equal('followingId', followingId)
        ]
    );

    if(res.documents.length > 0){
        return await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.followsCollectionId,
            res.documents[0].$id
        );
    }
}

export async function isFollowing(
  followerId: string,
  followingId: string
) {
  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.followsCollectionId,
    [
      Query.equal("followerId", followerId),
      Query.equal("followingId", followingId),
    ]
  );

  return res.total > 0;
}

export async function getFollowCounts(userId: string) {
  const [followers, following] = await Promise.all([
    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followingId", userId)]
    ),
    databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [Query.equal("followerId", userId)]
    ),
  ]);

  return {
    followers: followers.total,
    following: following.total,
  };
}
