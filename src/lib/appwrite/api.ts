import {ID } from 'appwrite';
import type { INewUser } from '@/types';
import { account } from './config';

export async function createUserAccount(user: INewUser) {
    
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.username
        );
        return newAccount;
        
    }
    catch(error){
        console.log("Error creating user account:", error);
        return error;
    }
}