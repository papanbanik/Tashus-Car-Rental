'use client';
import React, { useState } from 'react';
import { Grid, Typography, Paper, Container, List, ListItem, Link, Card, CardContent, CardActionArea } from '@mui/material';

const supportData = require('../../../../public/api/supportData.json')['account-support'];

const AccountSupport: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    const element = document.getElementById(section);
    if (element) {
      const offset = -100;
      const scrollPosition = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  };

  return (
    <Container maxWidth="lg">
      {/* <Typography variant="h4" align="center">
        {supportData[0].name}
      </Typography>
      <Typography variant="h6" align="center">
        {supportData[0].description}
      </Typography> */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <List className="sticky top-20">
            {supportData.map((section: any) => (
              <div key={section.name}>
                <ListItem className="hover:bg-gray-300" onClick={() => handleSectionClick(section.name)} style={{ cursor: 'pointer' }}>
                  <Link className="text-current no-underline ">
                    <Typography>{section.name}</Typography>
                  </Link>
                </ListItem>
              </div>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={8}>
          {supportData.map((section: any) => (
            <Paper
              key={section.name}
              style={{
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: selectedSection === section.name ? '#b9c4dd' : 'transparent',
              }}
              id={section.name}
            >
              <Typography variant="h5">{section.name}</Typography>
              <List>
                {section.cards &&
                  section.cards.map((card: any) => (
                    <div key={card.name}>
                      <Link href="/support/account/DetailedContent" className="text-current no-underline">
                        <Card className="mb-4">
                          <CardActionArea>
                            <CardContent>
                              <Typography variant="h6">{card.name}</Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Link>
                    </div>
                  ))}
              </List>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountSupport;
