import { makeObservable, observable, computed, action } from "mobx";
import { VehicleMakeService } from "../services/VehicleMakeService";
import { createSortQuery, createFilterQuery, combineQueries } from "../utils/query";


export class VehicleMakeStore {
  makes = [];
  isLoading = false;
  error = null;
  pageSize = 10;
  lastVisible = null;

  constructor() {
    makeObservable(this, {
      makes: observable,
      isLoading: observable,
      error: observable,
      searchableMakes: computed,
      loadMakes: action,
      createMake: action,
      updateMake: action,
      deleteMake: action,
      createMake: action,
    });
    this.service = new VehicleMakeService();
  }

  async loadMakes(sortBy = "name", sortOrder = "asc", filters = []) {
    const sortQuery = createSortQuery(sortBy, sortOrder);
    const filterQuery = createFilterQuery(filters);
    const combined = combineQueries(sortQuery, filterQuery);
    this.isLoading = true;
    try {
      const result = await this.service.getAll(
        combined,
        this.pageSize,
        this.lastVisible
      );
      this.makes = result.data;
      this.lastVisible = result.lastVisible;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async createMake(data) {
    await this.service.create(data);
    await this.loadMakes();
  }

  async updateMake(id, data) {
    await this.service.update(id, data);
    await this.loadMakes();
  }

  async deleteMake(id) {
    await this.service.delete(id);
    await this.loadMakes();
  }
  async createMake(data) {
    try {
      const docRef = await this.service.create(data);
      const newMake = { id: docRef.id, ...data };
      this.makes.push(newMake);
      return newMake;
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  }

  
  get searchableMakes() {
    return this.makes.map((make) => ({
      type: "make",
      id: make.id,
      name: make.name,
      abrv: make.abrv,
    }));
  }
 
}

const vehicleMakeStore = new VehicleMakeStore();
export { vehicleMakeStore };
