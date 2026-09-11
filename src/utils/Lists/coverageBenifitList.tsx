export type TCoverageBenefit = {
  title: string;
  subtitle: string;
  description: string;
  note: string | JSX.Element;
};

export const getCoverageBenefits = (fuelCost?: number, keyOption?: string): TCoverageBenefit[] => [
  {
    title: 'Flexible Refuel',
    subtitle: 'No stress on fuelling during return',
    description:
      'You can return the vehicle with any fuel level, eliminating the stress of refueling before drop-off. Tashus will charge you fuel gap using fair calculation method. While the cost of fuel during your travel remains your responsibility, if the fuel level upon return is lower than at pickup, Tashus will calculate the difference in kilometers of fuel range and charge you based on the market price of fuel for the shortfall. An inconvenience fee of $10 may be charged.',
    // note:
    //   fuelCost && fuelCost > 0 ? `${(fuelCost * 100)?.toFixed(2)}¢/km for each kilometer` : 'Fuel cost is not added. Contact the owner for details',
    note:
      fuelCost && Number(fuelCost) > 0 ? (
        <>
          <b>{Math.abs(Math.trunc(Number(fuelCost) * 100))}¢/km</b> for each kilometer
        </>
      ) : (
        'Fuel cost is not added. Contact the owner for details'
      ),
  },
  {
    title: 'Vehicle Insurance',
    subtitle: 'Vehicle is Fully covered',
    description:
      'The vehicle is fully covered against any incidents during your travel time. You will only pay up to a maximum amount equivalent to excess fees of your chosen coverage.',
    note: 'You are fully covered against any incident to vehicle. Only Excess fees applies',
  },
  {
    title: '3rd Parties Liabilities',
    subtitle: 'Liabilities to 3rd parties included',
    description:
      'The vehicle and your reservation comes with 3rd parties liabilities up to a maximum legal liability of $35,000,000. Terms and conditions applies as per rental agreement.',
    note: 'You are covered against liabilities to 3rd parties from any incidents during your travel',
  },
  {
    title: 'LDW',
    subtitle: 'Loss Damage Waiver',
    description:
      'This is Tashus standard level of cover. In case of loss or damage to the vehicle or damage to a third party, Loss Damage Waiver (LDW) reduces your maximum liability from the full cost of vehicle to your selected excess amount (maximum of $2,000). You can reduce the excess by purchasing coverage options.',
    note: 'Fully covered vehicle and damage to third party',
  },
  ...(!!keyOption
    ? [
        {
          title: 'Easy Pickup',
          subtitle: keyOption === 'selfCheck' ? 'Self Check-in' : 'Key Handover',
          description: keyOption === 'selfCheck' ? 'Self check-in option for key pickup.' : 'Agent-based key pickup and return.',
          note:
            keyOption === 'selfCheck' ? 'You’ll collect the key by yourself in a secured way' : 'You’ll meet an agent to pick up and return the key',
        },
      ]
    : []),
];
