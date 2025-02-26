import { BaseService } from './BaseService';
import { doc, getDoc } from "firebase/firestore";

export class VehicleModelService extends BaseService {
  constructor() {
    super("vehicleModels");
  }
  async updateModel(id, data) {
    await updateDoc(doc(this.collection, id), data);
  }
  async getById(id) {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }
  async updateModel(id, data) {
    try {
      await this.service.update(id, data);
      await this.loadModels();
    } catch (error) {
      this.error = error.message;
    }
  };
}