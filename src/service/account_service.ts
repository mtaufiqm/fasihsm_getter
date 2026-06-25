import { UserModel } from "../model/user_model";

export class AccountService {
    static usedAccount: number = 0;
    static listAccount: UserModel[] = [
        {
            username: "",
            password: ""
        }
    ];
}