import { ID, Query } from 'appwrite';
import type { INewPost, INewUser, IUpdatePost } from '@/types';
import { account, appwriteConfig, avatars, databases, storage } from './config';
import { number } from 'zod';

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

export async function getInfinitePost({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc(`$updatedAt`), Query.limit(10)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries,
        )

        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error)
    }
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
