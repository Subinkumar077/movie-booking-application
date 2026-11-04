export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const responseMessage = error?.response?.data?.message;
  if (typeof responseMessage === 'string' && responseMessage.trim()) return responseMessage;
  if (error?.response?.status === 401) return 'Your username or password is incorrect.';
  if (error?.response?.status === 403) return 'You do not have permission to perform this action.';
  if (!error?.response) return 'Unable to reach the server. Check that the backend is running.';
  return fallback;
}
