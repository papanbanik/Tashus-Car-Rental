'use-client';
import { Card, CardActionArea, CardContent, Container, Grid, Link, Typography } from '@mui/material';
import React from 'react';
import { FaCar, FaUserGroup } from 'react-icons/fa6';
import { IoMdBuild, IoMdPeople } from 'react-icons/io';
import { MdAccountCircle, MdAssignment, MdLocalGasStation } from 'react-icons/md';
// import { AccountCircle, DirectionsCar, Group, Build, Assignment, LocalGasStation, People } from '@mui/icons-material';

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '300px',
  padding: '16px',
  borderRadius: '12px',
  textAlign: 'center',
};
const cardIcons: { [key: string]: React.ReactNode } = {
  AccountCircle: <MdAccountCircle />,
  DirectionsCar: <FaCar />,
  Group: <FaUserGroup />,
  Build: <IoMdBuild />,
  Assignment: <MdAssignment />,
  LocalGasStation: <MdLocalGasStation />,
  People: <IoMdPeople />,
};

const iconStyle = {
  fontSize: '3rem',
  marginBottom: '8px',
};

interface CardData {
  title: string;
  icon: string;
  route: string;
  description: string;
}

const SupportPage: React.FC = () => {
  const cardsData: CardData[] = require('../../../public/api/supportData.json')['support-page-data']['cards-data'];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" className="mb-8 mt-8 text-center">
        We’re here to support
      </Typography>

      <Grid container spacing={3}>
        {cardsData.map((card: CardData, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Link href={card.route} className="text-current no-underline">
              <Card sx={cardStyle}>
                <CardActionArea>
                  <CardContent>
                    <div style={iconStyle}>{cardIcons[card.icon]}</div>
                    <Typography variant="h6" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SupportPage;
