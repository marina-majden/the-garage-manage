# APP BUILDING PROCESS

## CURRENT STATE

- i have a homepage which lists all vehicles, has edit delete button for each vehicle and add new vehicle
- i have a view vehicle option when clicking on a row which fires view vehicke dialog or modal
- on view vehicle you can edit and delete vehicle info
- from the homepage it doesnt work.

### WHAT AM I DOING

- extrapolating the service class that makes requests to API into another file:
First, I need to create a new service class, maybe called VehicleDetailsService, which will handle fetching model and make details. This service should encapsulate all the API calls, making the component cleaner.
- Next, the ViewVehicle component should import this service instead of directly using the stores for data fetching. The component's useEffect hooks will now call methods from the service.
However, I need to ensure that the service methods still interact with the MobX stores correctly, perhaps by passing the stores as dependencies or parameters.
- I also need to update the component to use the new service. The fetchData function in useEffect will now utilize the service's methods to get the model and make details. Error handling should be moved into the service or handled in the component, depending on where it's more appropriate.
- The handleDelete function currently uses vehicleModelStore.deleteModel. Should this also be moved to the service? Probably, to keep all API interactions in the service. So the service will have a deleteModel method that calls the store's delete method.
- Another consideration is the state management. The component uses useState for currentVehicle and makeDetails. The service shouldn't handle state, so those states will remain in the component. The service will just return the data, and the component will set the state accordingly.
- I should also check if the service needs to be an observable or if it's just a plain class. Since it's handling API calls, it might not need to be observable unless it's caching data. For now, keep it as a regular class.
In summary, the steps are:

1. Create VehicleDetailsService with methods to fetch model, make, and delete model.

2. Update ViewVehicle to use this service instead of directly accessing stores.

3. Move API logic into the service, keeping state management in the component.

4. Ensure proper error handling and async operations.
