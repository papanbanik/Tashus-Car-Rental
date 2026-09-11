import CarTypeFilter from '@/components/Search/Carfiltering/CarTypeFilter';
import PriceFilter from '@/components/Search/Carfiltering/PriceFilter';
import SeatFilter from '@/components/Search/Carfiltering/SeatFilter';
import TransmissionFilter from '@/components/Search/Carfiltering/TransmissionFilter';
import { IconType } from 'react-icons';
import { AiFillCar, AiOutlineDollarCircle } from 'react-icons/ai';
import { GiGearStickPattern } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { Country, State, City } from 'country-state-city';

export interface FilterButtonsType {
  id: string;
  name: string;
  label: string;
  modalTitle: string;
  component: React.ReactNode;
  icon: IconType;
}

export const filterButtonsList: FilterButtonsType[] = [
  {
    id: '1',
    name: 'price',
    label: 'Price',
    icon: AiOutlineDollarCircle,
    modalTitle: 'Filter by Price',
    component: <PriceFilter />,
  },
  {
    id: '2',
    name: 'carType',
    label: 'Vehicle Type',
    icon: AiFillCar,
    modalTitle: 'Filter by Vehicle Type',
    component: <CarTypeFilter />,
  },
  {
    id: '3',
    name: 'seat',
    label: 'Seat',
    icon: MdAirlineSeatReclineExtra,
    modalTitle: 'Filter by Vehicle Seat Number',
    component: <SeatFilter />,
  },
  {
    id: '4',
    name: 'transmission',
    label: 'Transmission',
    icon: GiGearStickPattern,
    modalTitle: 'Filter by Transmission Type',
    component: <TransmissionFilter />,
  },
];
