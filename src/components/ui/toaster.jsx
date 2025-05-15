import toast, { Toaster } from 'react-hot-toast';

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
  );
}

export const notify = (message, type = 'success') => {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else {
    toast(message);
  }
};
