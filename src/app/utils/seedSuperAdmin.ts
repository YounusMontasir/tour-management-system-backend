import  bcryptjs  from 'bcryptjs';
import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import { IAuthProvider, IUser, Role } from '../modules/user/user.interface';

export const seedSuperAdmin = async () =>{
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExist){
            console.log("Supwer admin already exists");
            return;
            
        }
        const hashedPassword =await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser ={
            name: "Super admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        }

        const superadmin = await User.create(payload)
        console.log("Super admin created successfully");
        
    } catch (error) {
        console.log(error);
        
    }
}