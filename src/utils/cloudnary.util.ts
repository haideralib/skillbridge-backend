import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudnary from "../configs/cloudnary.config";
import multer from 'multer';


const resumeStorage = new CloudinaryStorage({
   cloudinary: cloudnary,
    params: {
        public_id: () => `SkillBridge/resumes/${Date.now()}`,
    }  
})

const profilePicStorage = new CloudinaryStorage({
    cloudinary: cloudnary,
    params: {
        public_id: () => `SkillBridge/resumes/${Date.now()}`,
    }
})

export const uploadResume = multer({
    storage: resumeStorage
});


export const uploadProfilePic = multer({
    storage: profilePicStorage
});

