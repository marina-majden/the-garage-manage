import { vehicleModelStore } from "../stores/VehicleModelStore";

export class VehicleDetailService {

    
  /**
   * Get model details by ID
   * @param {string} modelId
   * @returns {Promise<Object>} Model data
   */
  static async getModelById(modelId) {
    try {
      const model = await vehicleModelStore.getModelById(modelId);
      if (!model) throw new Error("Model not found");
      return model;
    } catch (error) {
      throw new Error(`Failed to fetch model: ${error.message}`);
    }
  }

  /**
   * Update model by ID
   * @param {string} modelId
   * @param {Object} updateData
   * @returns {Promise<void>}
   */
  static async updateModel(modelId, updateData) {
    try {
      await vehicleModelStore.updateModel(modelId, updateData);
    } catch (error) {
      throw new Error(`Failed to update model: ${error.message}`);
    }
  }

  /**
   * Delete model by ID
   * @param {string} modelId
   * @returns {Promise<void>}
   */
  static async deleteModel(modelId) {
    try {
      await vehicleModelStore.deleteModel(modelId);
    } catch (error) {
      throw new Error(`Failed to delete model: ${error.message}`);
    }
  }
}
