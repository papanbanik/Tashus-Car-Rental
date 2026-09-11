import { Box, FormControl, FormHelperText, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useState } from 'react';

const ManualAddressForm = () => {
  const [region, setRegion] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
  };
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <br />

        <Typography variant="h6">Fill Up Address Manually</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="standard" fullWidth disabled>
              <InputLabel id="country-label">Country</InputLabel>
              <Select labelId="country-label" id="country-select" value="AU" onChange={handleChange} label="Country">
                <MenuItem value="AU">Australia</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="region-label">State/Region</InputLabel>
              <Select labelId="region-label" id="region-select" value="AU-NSW" onChange={handleChange} label="State/Region">
                <MenuItem value="AU-NSW">New South Wales</MenuItem>
                <MenuItem value={'AU-VIC'}>Victoria</MenuItem>
                <MenuItem value={'AU-QLD'}>Queensland</MenuItem>
                <MenuItem value={'AU-WA'}>Western Australia</MenuItem>
                <MenuItem value={'AU-SA'}>South Australia</MenuItem>
                <MenuItem value={'AU-TAS'}>Tasmania</MenuItem>
              </Select>
              <FormHelperText id="region-helper-text">Select your state/region.</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="postcode-input">Postcode</InputLabel>
              <Input id="postcode-input" defaultValue="" autoComplete="off" aria-describedby="postcode-helper-text" />
              <FormHelperText id="postcode-helper-text">Enter your postcode here.</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="city-input">City</InputLabel>
              <Input id="city-input" defaultValue="" autoComplete="off" aria-describedby="city-helper-text" />
              <FormHelperText id="city-helper-text">Enter your city here.</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={8}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="address-input">Full Address</InputLabel>
              <Input id="address-input" defaultValue="" autoComplete="off" aria-describedby="address-helper-text" />
              <FormHelperText id="address-helper-text">Enter your full address here.</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ManualAddressForm;
