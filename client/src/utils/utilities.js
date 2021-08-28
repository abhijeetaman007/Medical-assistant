import {storage} from "./firebase"

export const lottieOptions = (animation, loop = true) => ({
    loop,
    autoplay: true,
    animationData: animation,
});
  
export function validateEmail(email) {
    email = email.trim();
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const storeFile = async (folderNname, fileName, file) => {
    const storageRef = storage.ref();
    const folderRef = storageRef.child(folderNname);
    const fileRef = folderRef.child(fileName);
    await fileRef.put(file);
    const url = await fileRef.getDownloadURL();
    return url
}