// 'use client';

// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
// type VoucherProviderProps = {
//     children: ReactNode;
// };

// type VoucherContextType = {
//     voucherDetails: any;
//     setVoucherDetails: Dispatch<SetStateAction<any>>;
// };

// export const Voucher = createContext<VoucherContextType | undefined>(undefined);

// export const useVoucherContext = (): VoucherContextType => {
//     const context = useContext(Voucher);
//     if (!context) {
//         throw new Error('useContext must be used within a VoucherProvider');
//     }
//     return context;
// };

// export const VoucherProvider: FC<VoucherProviderProps> = ({ children }) => {
//     const [voucherDetails, setVoucherDetails] = useState<any>();

//     const voucherData = useQuery({
//         queryKey: [],
//         queryFn: async () => {
//             if (voucherDetails && Object?.keys(voucherDetails)?.length <= 0) {

//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/voucher/get-active-vouchers`);
//                 // console.log('res', response);
//                 if (response?.status === 200) {
//                     setVoucherDetails(response?.data);
//                 }
//                 return response;
//             }
//             else return;
//         }
//     });

//     const contextValue: VoucherContextType = {
//         voucherDetails,
//         setVoucherDetails
//     };
//     return <Voucher.Provider value={contextValue}>{children}</Voucher.Provider>;
// };
