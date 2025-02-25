import { makeObservable, observable, computed, action } from 'mobx';
import { VehicleModelService } from '../services/VehicleModelService';
import { vehicleMakeStore } from './VehicleMakeStore';


export class VehicleModelStore {
  models = [];
  totalCount = 0;
 
  error = null;
  pageSize = 10;
  lastVisible = null;

  get modelsWithMakes() {
    return this.models.map((model) => ({
      ...model,
      make: vehicleMakeStore.makes.find((make) => make.id === model.makeId),
    }));
  }

  constructor() {
    makeObservable(this, {
      models: observable,
      totalCount: observable,
      lastVisible: observable,
      error: observable,
      modelsWithMakes: computed,
    
      loadModels: action,
      createModel: action,
      updateModel: action,
      deleteModel: action,
      createModel: action,
    });
    this.service = new VehicleModelService();
  }
  async loadModels(queryParams = []) {
   
    try {
      const result = await this.service.getAll(queryParams);
      this.models = result.data;
      this.lastVisible = result.lastVisible;
      this.totalCount = result.totalCount; // You'll need to implement count in service
    } catch (error) {
      this.error = error.message;
    } finally {
     
    }
  }
  parseModelData(data) {
    return {
      name: data.name,
      abrv: data.abrv,
      makeId: data.makeId,
      year: parseInt(data.year, 10),
      color: data.color.startsWith("#") ? data.color : `#${data.color}`,
      favorite: Boolean(data.favorite),
    };
  }

  async createModel(data) {
    const modelData = this.parseModelData(data);
    await this.service.create(modelData);
    await this.loadModels();
  }

  async updateModel(id, data) {
    const modelData = this.parseModelData(data);
    await this.service.update(id, modelData);
    await this.loadModels();
  }

  async deleteModel(id) {
    await this.service.delete(id);
    await this.loadModels();
  }

  getMakes() {
    return vehicleMakeStore.makes;
  }
  async createModel(data) {
    try {
      const docRef = await this.service.create(data);
      const newModel = { id: docRef.id, ...data };
      this.models.push(newModel);
      return newModel;
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  }
  async getModelById(id) {
    try {
      return await this.service.getById(id);
    } catch (error) {
      this.error = error.message;
      return null;
    }
  };
}
export const vehicleModelStore = new VehicleModelStore();
