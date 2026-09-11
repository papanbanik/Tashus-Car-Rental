'use client';
import React, { useState } from 'react';
import { Grid, Typography, Paper, Container, List, ListItem, Link } from '@mui/material';

const supportData = require('../../../../public/api/supportData.json')['account-support'];

const ShowDetailedContent: React.FC = () => {
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

  const renderContent = (content: any) => {
    return content.map((sub: any, index: number) => (
      <div key={index}>
        {(() => {
          switch (sub.type) {
            case 'heading':
              return (
                <Typography variant="h6" gutterBottom className="font-semibold">
                  {sub.text}
                </Typography>
              );
            case 'paragraph':
              return <Typography paragraph>{sub.text}</Typography>;
            case 'bullet-list':
              return (
                <ul>
                  {sub.points.map((point: string, index: number) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              );
            case 'number-list':
              return (
                <ol>
                  {sub.numbers.map((numberedItem: string, index: number) => (
                    <li key={index}>{numberedItem}</li>
                  ))}
                </ol>
              );
            // case 'image':
            //   return (
            //     <div>
            //       <img src={sub.url} alt={sub.description} />
            //       <Typography>{sub.description}</Typography>
            //     </div>
            //   );

            default:
              return null;
          }
        })()}
      </div>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <List className="sticky top-20">
            {supportData.map((section: any) => (
              <div key={section.name}>
                {section.cards &&
                  section.cards.map(
                    (card: any) =>
                      card.subsections &&
                      card.subsections.map((sub: any) => (
                        <ListItem key={sub.name} className="hover:bg-gray-300 cursor-pointer" onClick={() => handleSectionClick(sub.name)}>
                          <Link className="text-current no-underline">
                            <Typography>{sub.name}</Typography>
                          </Link>
                        </ListItem>
                      ))
                  )}
              </div>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={8}>
          {supportData.map((section: any) => (
            <div key={section.name}>
              {section.cards &&
                section.cards.map(
                  (card: any) =>
                    card.subsections &&
                    card.subsections.map((sub: any) => (
                      <Paper
                        key={sub.name}
                        style={{
                          padding: '20px',
                          marginBottom: '20px',
                          backgroundColor: 'transparent',
                        }}
                        id={sub.name}
                      >
                        <List>
                          <div key={sub.name}>
                            <Typography variant="h5" className="font-bold">
                              {sub.name}
                            </Typography>
                            {renderContent(sub.content)}
                          </div>
                        </List>
                      </Paper>
                    ))
                )}
            </div>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShowDetailedContent;
