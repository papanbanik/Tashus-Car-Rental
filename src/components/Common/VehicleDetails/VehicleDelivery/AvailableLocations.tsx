import { Accordion, AccordionDetails, AccordionSummary, Alert, CircularProgress, Typography } from '@mui/material';
import { FaCity, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { MdExpandMore } from 'react-icons/md';
import { useGetAvailableLocations } from './hooks/useGetAvailableLocations';

interface LocationData {
  [country: string]: {
    [city: string]: string[];
  };
}

const AvailableLocations = () => {
  const { data, isLoading } = useGetAvailableLocations();
  const locationData: LocationData = data?.data?.responseObject ?? {};

  const getTotalLocations = () => {
    let total = 0;
    Object.keys(locationData).forEach((country) => {
      Object.keys(locationData[country]).forEach((city) => {
        total += locationData[country][city].length;
      });
    });
    return total;
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">Available Delivery Locations</h2>
      {/* Helping Text */}
      {Object.keys(locationData).length > 0 ? (
        <span className="flex flex-col gap-2 p-2 my-2 bg-blue-50 border border-blue-100 rounded text-sm">
          <span>
            Below are the locations where vehicle delivery is available. Click on a country to see available cities, then click on a city to view
            postal/ZIP codes served.
          </span>
          <span className="mt-2">
            We currently offer delivery services in <strong>Australia</strong>{' '}
            {/* <strong>
            {Object.keys(locationData)?.length} {Object.keys(locationData)?.length > 1 ? 'countries' : 'country'}
          </strong>*/}
            across <strong>{getTotalLocations()} postal zones</strong>. Delivery times and fees may vary by location.
          </span>
        </span>
      ) : (
        <span className="flex flex-col gap-2 p-2 my-2 bg-blue-50 border border-blue-100 rounded text-sm">
          <span>Delivery services are currently unavailable.</span>
          <span>
            {`We're sorry, but we are not offering delivery services at this time. Please check back later or contact support for more details.`}
          </span>
        </span>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="space-y-2">
          {Object.keys(locationData).length > 0 ? (
            <>
              {Object.keys(locationData).map((country) => (
                <Accordion key={country} defaultExpanded className="bg-soft shadow-md shadow-secondary">
                  <AccordionSummary expandIcon={<MdExpandMore />} aria-controls={`${country}-content`} id={`${country}-header`}>
                    <div className="flex items-center">
                      <FaGlobe className="mr-2 text-success" size={18} />
                      <Typography variant="body1" className="font-medium">
                        {country}
                      </Typography>
                      <Typography variant="body2" className="ml-2 text-gray-500">
                        ({Object.keys(locationData[country]).length} cities)
                      </Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.keys(locationData[country]).map((city) => (
                      <Accordion key={city}>
                        <AccordionSummary expandIcon={<MdExpandMore />} aria-controls={`${city}-content`} id={`${city}-header`}>
                          <div className="flex items-center">
                            <FaCity className="mr-2 text-primary" size={18} />
                            <Typography variant="body1">{city}</Typography>
                            <Typography variant="body2" className="ml-2 text-gray-500">
                              ({locationData[country][city]?.length} postal codes)
                            </Typography>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="flex flex-wrap gap-2 p-2">
                            {locationData[country][city].map((postalCode: string) => (
                              <span
                                key={postalCode}
                                className="px-2 py-1 bg-gray-100 text-sm rounded border border-gray-200 flex items-center"
                                title={`Delivery available to ${postalCode}`}
                              >
                                <FaMapMarkerAlt className="mr-1 text-xs" />
                                {postalCode}
                              </span>
                            ))}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          ) : (
            <Alert severity="info" className="my-2">
              No delivery locations available.
            </Alert>
          )}
        </div>
      )}

      {Object.keys(locationData).length > 0 && (
        <div className="my-2 helping_text font-bold">
          * Delivery timeframes may vary based on location, vehicle availability, and seasonal factors.
        </div>
      )}
    </div>
  );
};

export default AvailableLocations;
