import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';


export class BaseService {
  constructor(collectionName) {
    this.collection = collection(db, collectionName);
  }

  async create(data) {
    return await addDoc(this.collection, data);
  }

  
  async getAll(queryParams = [], pageSize = 10, lastVisible = null) {
    let q = query(this.collection, ...queryParams);
    const snapshot = await getDocs(q);
    const countQuery = query(this.collection, ...queryParams);
  

    return {
      data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
  
    };
  }

  async update(id, data) {
    await updateDoc(doc(this.collection, id), data);
  }

  async delete(id) {
    await deleteDoc(doc(this.collection, id));
  }
}