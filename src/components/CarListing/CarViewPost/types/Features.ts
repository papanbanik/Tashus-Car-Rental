import { IconType } from 'react-icons';
import { BsCamera, BsCloudSun, BsUsbSymbol } from 'react-icons/bs';
import { MdNavigation } from 'react-icons/md';
import { RiSoundModuleFill } from 'react-icons/ri';
import { TbAirConditioning, TbBluetooth, TbKeyOff } from 'react-icons/tb';

export const iconMap: Record<string, IconType> = {
  airCon: TbAirConditioning,
  powWindow: TbAirConditioning,
  powLock: TbAirConditioning,
  keyless: TbKeyOff,
  cruiseCtrl: TbAirConditioning,
  nav: MdNavigation,
  bt: TbBluetooth,
  usb: BsUsbSymbol,
  sunroof: BsCloudSun,
  heatedSeat: TbAirConditioning,
  backCam: BsCamera,
  parkSens: TbAirConditioning,
  alloyWheel: TbAirConditioning,
  roofRack: TbAirConditioning,
  towPack: TbAirConditioning,
  audio: RiSoundModuleFill,
};
export const featureNames: Record<string, string> = {
  airCon: 'Air Conditioning',
  powWindow: 'Power Windows',
  powLock: 'Power Locks',
  keyless: 'Keyless entry',
  cruiseCtrl: 'Cruise control',
  nav: 'Navigation system',
  bt: 'Bluetooth connectivity',
  usb: 'USB ports',
  sunroof: 'Sunroof',
  heatedSeat: 'Heated seats',
  backCam: 'Backup camera',
  parkSens: 'Parking sensors',
  alloyWheel: 'Alloy wheels',
  roofRack: 'Roof rack',
  towPack: 'Towing package',
  audio: 'Audio system details',
};
