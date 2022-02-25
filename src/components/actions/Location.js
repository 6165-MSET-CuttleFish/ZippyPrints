import { getFirestore, doc, getDoc, query, collection, getDocs } from 'firebase/firestore/lite';


export const getMarkerData = async () => {
    const db = getFirestore();
    const q = query(collection(db, "markers"));
    
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        console.log(doc.data())
        const data = doc.data();
        return data
    });
          
      
    } catch (error){
        console.log(error)

    }
}
