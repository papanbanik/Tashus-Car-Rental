/* eslint-disable jsx-a11y/alt-text */
import { TDate } from '@/types/commonTypes';
import { InvoiceCompanyInfo, InvoiceGuestInfo } from '@/types/reservations/reservationInvoiceTypes';
import { formatFullDateTimeUtc } from '@/utils/Functions/utcCommonFn';
import { Image, Text, View } from '@react-pdf/renderer';

interface InvoicePDFHeaderProps {
  pageNumber: number;
  reservationId: number;
  vehicleLicense: string;
  invoiceTitle: string;
  guestInfo: InvoiceGuestInfo;
  companyInfo: InvoiceCompanyInfo;
  pickupDate?: TDate | string;
  returnDate?: TDate | string;
}

const InvoicePDFHeader = ({
  pageNumber,
  reservationId,
  vehicleLicense,
  guestInfo,
  companyInfo,
  invoiceTitle,
  pickupDate,
  returnDate,
}: InvoicePDFHeaderProps) => {
  const primaryColor = '#800080';

  const formatResidentialAddress = () => {
    if (!guestInfo?.residentialAddressInfo) return '';

    const { streetNumber, streetName, state, postcode, country } = guestInfo?.residentialAddressInfo;

    // Build address lines
    const addressLine1 = `${streetNumber}/${streetName},`;
    const addressLine2 = `${state} ${postcode},`;
    const addressLine3 = country === 'AU' ? 'Australia' : country;

    return {
      line1: addressLine1,
      line2: addressLine2,
      line3: addressLine3,
    };
  };

  const formattedAddress = formatResidentialAddress();

  //  styles
  const labelStyle = {
      fontSize: '10px',
    color: '#666',
    fontWeight: 'normal' as const,
  };

  const valueStyle = {
       fontSize: '10px',
    // color: '#1a1a1a',
    color: '#2A3547',
    fontWeight: 'normal' as const,
  };

  const sectionTitleStyle = {
    fontSize: '11px',
    fontWeight: 'bold' as const,
    color: primaryColor,
    marginBottom: '8px',
  };

  return (
    <View
      style={{
        borderBottom: '1px solid gray',
            marginTop: '6px',
        marginBottom: pageNumber !== 1 ? '5px' : 0,
        width: '100%',
      }}
    >
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: '1px',
          position: 'relative',
        }}
      >
        <View style={{ width: '50%' }}>
          <Image style={{ width: '70px', height: '70px', padding: '0', marginLeft: '-12px' }} src={'/Logo/tashus-Logo.png'} />
        </View>

        <View
          style={{
            backgroundColor: primaryColor,
            display: 'flex',
            width: '50%',
          }}
        >
          <Text style={{ fontSize: '18px', color: 'white', padding: '8px 16px' }}>{invoiceTitle}</Text>
        </View>
      </View>

      {pageNumber === 1 && (
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: 'row',
            marginBottom: '20px',
            position: 'relative',
          }}
        >
          {/* Bill From Section */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '35%',
            }}
          >
            <Text style={sectionTitleStyle}>Bill From</Text>

            <Text style={{ ...valueStyle, fontWeight: 'bold' as const, marginBottom: '6px' }}>{companyInfo?.companyName}</Text>

            <Text style={{ marginBottom: '3px' }}>
              <Text style={labelStyle}>Email: </Text>
              <Text style={valueStyle}>info@tashus.com</Text>
            </Text>

            <Text style={{ marginBottom: '3px' }}>
              <Text style={labelStyle}>Phone: </Text>
              <Text style={valueStyle}>0455165265</Text>
            </Text>

            <Text style={{ marginBottom: '3px' }}>
              <Text style={labelStyle}>Address: </Text>
              <Text style={valueStyle}>6/60 Memorial Ave,</Text>
            </Text>
            <Text style={valueStyle}>Liverpool NSW 2170, Australia</Text>
          </View>

          {/* Bill To Section */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '35%',
            }}
          >
            <Text style={sectionTitleStyle}>Bill To</Text>

            <Text style={{ ...valueStyle, fontWeight: 'bold' as const, marginBottom: '6px' }}>{guestInfo?.guestName}</Text>

            {guestInfo?.email && (
              <Text style={{ marginBottom: '3px' }}>
                <Text style={labelStyle}>Email: </Text>
                <Text style={valueStyle}>{guestInfo?.email}</Text>
              </Text>
            )}

            {guestInfo?.guestPhoneNumber && (
              <Text style={{ marginBottom: '3px' }}>
                <Text style={labelStyle}>Phone: </Text>
                <Text style={valueStyle}>{guestInfo?.guestPhoneNumber}</Text>
              </Text>
            )}

            {formattedAddress && (
              <>
                <Text style={{ marginBottom: '3px' }}>
                  <Text style={labelStyle}>Address: </Text>
                  <Text style={valueStyle}>{formattedAddress.line1}</Text>
                </Text>
                <Text style={valueStyle}>
                  {formattedAddress.line2} {formattedAddress.line3}
                </Text>
              </>
            )}
          </View>

          {/* Reservation Info Section */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '30%',
            }}
          >
            <Text style={sectionTitleStyle}>Reservation Info</Text>

            <Text style={{ marginBottom: '3px' }}>
              <Text style={labelStyle}>Reservation ID: </Text>
              <Text style={{ ...valueStyle, fontWeight: 'bold' as const }}>{reservationId}</Text>
            </Text>

            {vehicleLicense && (
              <Text style={{ marginBottom: '6px' }}>
                <Text style={labelStyle}>Vehicle License: </Text>
                <Text style={valueStyle}>{vehicleLicense}</Text>
              </Text>
            )}

            <Text style={{ ...valueStyle, fontWeight: 'bold' as const, marginTop: '2px', marginBottom: '4px' }}>Rental Period</Text>

            <Text style={{ marginBottom: '3px' }}>
              <Text style={labelStyle}>From: </Text>
              <Text style={valueStyle}>{formatFullDateTimeUtc(pickupDate ?? '')}</Text>
            </Text>

            <Text>
              <Text style={labelStyle}>To: </Text>
              <Text style={valueStyle}>{formatFullDateTimeUtc(returnDate ?? '')}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default InvoicePDFHeader;
