import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => toast.success(message, {
    duration: 4000,
    style: {
      background: '#10B981',
      color: 'white',
    },
  }),
  
  error: (message) => toast.error(message, {
    duration: 5000,
    style: {
      background: '#EF4444',
      color: 'white',
    },
  }),
  
  loading: (message) => toast.loading(message),
  
  dismiss: () => toast.dismiss(),
};
