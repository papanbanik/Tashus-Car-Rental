export const getReservationStatusClassName = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-warning text-white';
    case 'confirmed':
      return 'bg-primary text-white';
    case 'completed':
      return 'bg-success text-white';
    case 'cancelled':
    case 'cancelledByHost':
    case 'cancelledByGuest':
      return 'bg-error text-white';
    default:
      return 'bg-secondary text-white';
  }
};
