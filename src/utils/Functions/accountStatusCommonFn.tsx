export const restrictPartnerAlert = `It appears that the platform has restricted your access as a partner. Please note that any changes made to this form will not be applicable. For further information, please contact support.`;

export const suspendPartnerAlert = `It appears that the platform has suspended your access as a partner. For further information, please contact support.`;

export const restrictGuestAlert = `It appears that the platform has restricted your access as a guest. Please note that any changes made to this form will not be applicable. For further information, please contact support.`;

export const suspendGuestAlert = `It appears that the platform has suspended your access as a guest. For further information, please contact support.`;

export const restrictBothAlert = `Your access to the platform has been restricted both as a partner and as a guest. We would like to inform you that any modifications made to this form will not be applicable. For further information, please contact support.`;

export const suspendBothAlert = `Your access to the platform has been suspended both as a partner and as a guest. For further information, please contact support.`;

export const isPartnerRestrict = (partnerAccess: any, conditionCheck?: boolean, condition?: string): boolean => {
  if (!partnerAccess || !partnerAccess.history || !(partnerAccess?.history?.length > 0)) {
    return false;
  }
  const latestStatus = partnerAccess.history[partnerAccess?.history?.length - 1];
  if (conditionCheck && latestStatus) {
    if (condition) {
      return true;
    }
  } else if (partnerAccess.currentStatus === 'restricted') {
    return true;
  }
  return false;
};

export const isGuestRestrict = (guestAccess: any, conditionCheck?: boolean, condition?: string): boolean => {
  if (!guestAccess || !guestAccess.history || !(guestAccess?.history?.length > 0)) {
    return false;
  }
  const latestStatus = guestAccess?.history[guestAccess?.history?.length - 1];
  if (conditionCheck && latestStatus) {
    if (condition) {
      return true;
    }
  } else if (guestAccess?.currentStatus === 'restricted') {
    return true;
  }
  return false;
};

export const isPartnerSuspended = (partnerAccess: any, conditionCheck?: boolean, condition?: string): boolean => {
  if (!partnerAccess || !partnerAccess.history || !(partnerAccess?.history?.length > 0)) {
    return false;
  }
  const latestStatus = partnerAccess?.history[partnerAccess?.history?.length - 1];
  if (conditionCheck && latestStatus) {
    if (condition) {
      return true;
    }
  } else if (partnerAccess?.currentStatus === 'suspended') {
    return true;
  }
  return false;
};

export const isGuestSuspended = (guestAccess: any, conditionCheck?: boolean, condition?: string): boolean => {
  if (!guestAccess || !guestAccess.history || !(guestAccess?.history?.length > 0)) {
    return false;
  }
  const latestStatus = guestAccess?.history[guestAccess?.history?.length - 1];
  if (conditionCheck && latestStatus) {
    if (condition) {
      return true;
    }
  } else if (guestAccess?.currentStatus === 'suspended') {
    return true;
  }
  return false;
};
