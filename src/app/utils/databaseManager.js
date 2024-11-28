import { firestore } from "./firebaseConfig";
import { getDocs, addDoc, collection } from "firebase/firestore";

export async function readAllStats() {
  const firestoreColl = collection(firestore, "puloverji")

  try {
    const snapshot = await getDocs(firestoreColl)
    let res = []

    snapshot.forEach((doc, index) => {
      res.push(
        {id: doc.id, ...doc.data()}
      )
    })

    return {
      success: true,
      data: res,
      error: null
    }
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e
    }
  }
}

export async function addToFirebase(data) {
  const firestoreColl = collection(firestore, "puloverji");

  try {
    const docRef = await addDoc(firestoreColl, data);

    return {
      success: true,
      data: { id: docRef.id },
      error: null
    };
  } catch (e) {
    console.error("Error in database management: ", e)

    return {
      success: false,
      data: null,
      error: e.message
    };
  }
}