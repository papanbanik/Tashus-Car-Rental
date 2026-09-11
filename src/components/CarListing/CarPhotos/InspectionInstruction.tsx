'use client';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import Link from 'next/link';
const InspectionInstruction = () => {
  return (
    <Paper elevation={2} style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h5">Inspection Report Instructions</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography>
                <span className="font-bold">1. Download the Form:</span>{' '}
                <Link
                  target="_blank"
                  href="/help/vehicle-inspection"
                  className="text-primary font-semibold"
                >{`Click here to download the Inspection Report Form`}</Link>{' '}
                {`in PDF format.`}
              </Typography>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary={
              <Typography>
                <span className="font-bold">2. Print and Inspect:</span>
                {` Print the form and conduct a thorough inspection of your vehicle, noting any
                damages.`}
              </Typography>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary={
              <Typography>
                <span className="font-bold">3. Listing Inspections:</span>{' '}
                {`Use the form to list and describe all damages found, marking their locations accurately.`}
              </Typography>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary={
              <Typography>
                <span className="font-bold">4. Provide Date, Details and Name:</span>
                {`Input the inspection date and include pertinent details, including the vehicle's name, concerning any damages identified`}
              </Typography>
            }
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary={
              <Typography>
                <span className="font-bold">5. Upload the Completed Form:</span>{' '}
                {`After filling out the form, scan or take a photo and upload it using the platform's
                'Inspection Reporting' section.`}
              </Typography>
            }
          />
        </ListItem>
      </List>
      <Typography variant="body2">
        <span className="font-bold">N.B:</span> {`Ensure that you have a PDF reader to view and print the form.`}
      </Typography>
      <Typography
        variant="body2"
        className="mt-2"
      >{`Thank you for your diligence in reporting damages promptly and accurately. Your contributions help us maintain our vehicles in top-notch condition for all users' enjoyment!`}</Typography>
    </Paper>
  );
};

export default InspectionInstruction;
