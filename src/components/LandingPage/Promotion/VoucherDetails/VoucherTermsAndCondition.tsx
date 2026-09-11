import React from 'react';
import { Card, CardContent, Typography, List, ListItem, Box } from '@mui/material';
import VoucherRules from '../VoucherRules';
import { TVoucher } from '@/types/voucher-promotion/promotionTypes';

interface VoucherDetailsProps {
  voucherDetails: TVoucher;
}

const VoucherTermsAndCondition = ({ voucherDetails }: VoucherDetailsProps) => {
  return (
    <Card variant="outlined" sx={{ margin: 'auto', mt: 4 }}>
      <CardContent>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{
            borderBottom: { xs: '1px solid rgba(224, 224, 224, 1)' },
            textAlign: 'center',
            pb: 3,
          }}
          className="mb-2"
        >
          Terms & Conditions:
        </Typography>

        {/* List of Terms */}
        <List
          sx={{
            listStyleType: 'disc',
            pl: 2,
            '& .MuiListItem-root': {
              display: 'list-item',
            },
            '& .MuiListItem-root::marker': {
              color: 'gray',
            },
          }}
        >
          {voucherDetails?.voucherTerms?.map((term: any, index: number) => {
            return term !== '' ? <ListItem key={index}>{term}</ListItem> : null;
          })}

          {voucherDetails && voucherDetails.voucherRules?.length > 0 && <VoucherRules rules={voucherDetails?.voucherRules || []} isDetails={true} />}
        </List>
      </CardContent>
    </Card>
  );
};

export default VoucherTermsAndCondition;
