import { TReason } from '@/types/vehicle-delivery/vehicleDeliveryTypes';
import { vehicleDeliveryNotes } from '@/utils/Functions/vehicle-delivery/deliveryFn';
import { Divider, List, ListItem, ListItemText } from '@mui/material';
import { Fragment } from 'react';
import CommonTextIcon from '../../CommonTextIcon';

const DeliveryInfoModal = () => {
  return (
    <div className="border border-solid border-accent rounded-lg my-4 p-4">
      {/* Title */}
      <span className="text-md md:text-xl text-center text-gray-700 font-semibold mb-4">Important Information About Vehicle Delivery and Return</span>

      {/* List of Reasons */}
      <List>
        {vehicleDeliveryNotes?.map((reason: TReason, index: number) => (
          <Fragment key={index}>
            {/* {reason?.icon && (
              <ListItemIcon>
                <reason.icon className="text-primary text-xl" />
              </ListItemIcon>
            )} */}
            <ListItem>
              <ListItemText
                primary={
                  <CommonTextIcon
                    className="text-sm md:text-md text-primary font-bold"
                    text={reason?.primary}
                    startIcon={reason?.icon && <reason.icon className="mr-2 text-primary" />}
                  />
                }
                secondary={
                  Array.isArray(reason?.secondary) && reason?.secondary?.length > 0 ? (
                    <ul className="list-disc pl-6 text-gray-700">
                      {reason?.secondary?.map((item: string, subIndex: number) => (
                        <li key={subIndex} className="list-none text-xs md:text-sm">
                          - {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="pl-6">
                      <span className="text-gray-700 text-xs md:text-sm">{reason?.secondary}</span>
                    </div>
                  )
                }
              />
            </ListItem>
            {index < vehicleDeliveryNotes?.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </div>
  );
};

export default DeliveryInfoModal;
