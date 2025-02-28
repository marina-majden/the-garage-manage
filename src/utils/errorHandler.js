
export const vehicleErrorHandler = (error) => {
  const messages = {
    'permission-denied': 'You don\'t have permission to perform this action',
    'not-found': 'Vehicle not found',
    default: 'An error occurred while loading vehicle details'
  };

  return {
    message: messages[error?.code] || messages.default,
    code: error?.code || 'unknown'
  };
};