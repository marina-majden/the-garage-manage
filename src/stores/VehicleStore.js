import { makeObservable, observable, action, runInAction } from 'mobx';
import axios from 'axios';


class VehicleStore {
  vehicles = [];
  loading = false;

  constructor() {
    makeObservable(this, {
      vehicles: observable,
      loading: observable,
      addVehicle: action,
      fetchVehicles: action,
    });
  }

  // Add a new vehicle
  async addVehicle(vehicle) {
    try {
      const response = await axios.post('/api/vehicles', vehicle);
      runInAction(() => {
        this.vehicles.push(response.data);
      });
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  }

  // Fetch vehicles from the API with pagination
  async fetchVehicles(page = 1, limit = 10) {
    this.loading = true;
    try {
      const response = await axios.get(`/api/vehicles?page=${page}&limit=${limit}`);
      runInAction(() => {
        this.vehicles = response.data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export default new VehicleStore();
