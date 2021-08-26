
import firebase from "firebase";

const firebaseConfig = {};
const app = firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();

export default app;

// const storageRef = storage.ref();
// const resumeStorageRef = storageRef.child("resume");
// const resumeRef = resumeStorageRef.child(email.value);
// await resumeRef.put(resume.value());
// resumeLink = await resumeRef.getDownloadURL();