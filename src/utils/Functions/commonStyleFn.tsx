import { TDiscountedPrice } from '@/context/SearchProvider';

export const customSxStyles = {
  commonBoxStyles: {
    flexGrow: 1,
    m: 1,
    width: '100%',
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '10px',
      backgroundColor: 'purple',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      right: '50%',
      top: 10,
      width: '2px',
      height: '34px',
      backgroundColor: 'black',
    },
  },
  borderLessInputStyles: {
    border: 'none', // Remove border
    '&:hover': {
      border: 'none', // Remove border on hover
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Remove the outline
    },
  },
  // customDateTimeInputSx: {
  //   '& input': {
  //     border: 'none',
  //     fontWeight: 'bold',
  //   },
  //   border: 'none',
  //   '&:hover': {
  //     border: 'none',
  //   },
  //   '& .MuiOutlinedInput-notchedOutline': {
  //     border: 'none',
  //   },
  // },

  customDateTimeInputSx: {
    '& .MuiInputBase-root': {
      paddingTop: 1, // Remove extra padding inside DateField
    },
    '& .MuiFormLabel-root': {
      marginTop: '-2px', // Pull the label closer to the DateField input
      // fontSize: '0.875rem', // Adjust font size if needed
    },
    '& input': {
      border: 'none',
      fontWeight: 'bold',
      paddingTop: 0, // Ensure no extra padding in the input field
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
};

export const customHeroFormSxStyles = {
  commonBoxStyles: {
    flexGrow: 1,
    m: 1,
    width: '100%',
    position: 'relative',
    border: '1px solid #D9D9D9',
  },
  divider: {
    content: '""',
    position: 'absolute',
    right: '50%',
    top: 10,
    width: '2px',
    height: '30px',
    backgroundColor: '#D9D9D9',
  },
};

//Calendar Event Dialog
export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Get the discount text for the long booking discount
export const getLongDiscountText = (longBookingDiscounts?: TDiscountedPrice): string => {
  let text = '';
  if (longBookingDiscounts && longBookingDiscounts?.duration) {
    text = `${longBookingDiscounts?.percentage}% off for ${longBookingDiscounts?.duration}+ ${
      longBookingDiscounts?.duration > 1 ? `${longBookingDiscounts?.durationUnit}` : `${longBookingDiscounts?.durationUnit?.slice(0, -1)}`
    }`;
  }
  return text;
};
//
export const getAdvancedDiscountText = (advanceBookingDiscounts?: TDiscountedPrice): string => {
  let text = '';
  if (advanceBookingDiscounts && advanceBookingDiscounts?.duration) {
    text = `${advanceBookingDiscounts?.percentage}% off for early reservation`;
  }
  return text;
};
