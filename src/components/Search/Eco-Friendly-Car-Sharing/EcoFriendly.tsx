'use client';
import { Box, Card, CardContent, CardHeader, CardMedia, Collapse, List, ListItem, ListItemText, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { FaSpa } from 'react-icons/fa';
import { MdAllInclusive, MdExpandLess, MdExpandMore } from 'react-icons/md';

const EcoFriendly = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    { src: '/Images/Eco-Friendly-page/Tashus-carShare.webp', title: `Tashus - Eco Friendly Car rental platform` },
    { src: '/Images/Eco-Friendly-page/Tashus-friends-trip-together.webp', title: `Tashus - Eco Friendly Car rental platform` },
    { src: '/Images/Eco-Friendly-page/Tashus-CarShareing2.webp', title: `Tashus - Eco Friendly Car rental platform` },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleListItemClick = (sectionTitle: string) => {
    setExpandedSection((prevExpanded) => (prevExpanded === sectionTitle ? null : sectionTitle));
  };
  const faqData = [
    {
      title: `Community Impact and Advocacy`,
      text: `Eco-friendly car rental positively impacts local communities by reducing traffic congestion and improving air quality. Users can actively advocate for environmental conservation by choosing sustainable transportation options, creating a ripple effect that benefits the community at large.`,
    },
    {
      title: `Future Trends in Eco-Friendly Car Rental:`,
      text: `The future of eco-friendly car rental looks promising. Advancements in technology, coupled with supportive government policies, will likely drive the industry toward even greener practices. The global shift towards sustainable transportation is gaining momentum, with eco-friendly car rental playing a pivotal role.`,
    },
    {
      title: `Sustainability and Car Rental in Sydney`,
      text: `In a city that values sustainability, Tashus aligns perfectly with the eco-conscious lifestyle. Car rental inherently reduces the number of vehicles on the road, contributing to Sydney's efforts in creating a greener urban environment. Tashus takes this commitment further by incorporating eco-friendly practices into its operations.`,
    },
    {
      title: `Challenges and Solutions:`,
      text: `While the eco-friendly car rental industry is making strides, challenges such as limited charging infrastructure for electric vehicles and user awareness persist. However, innovative solutions, including investments in charging networks and user education programs, are actively addressing these challenges.`,
    },
    {
      title: `Regulations and Compliance in Car Rental`,
      text: `Understanding the legal landscape of car rental is crucial, and Tashus ensures compliance with all regulations in Sydney. Users can trust Tashus to provide a safe and legal car rental experience, giving them peace of mind as they navigate the city.`,
    },
    {
      title: `Community Impact and Engagement in Car Rental`,
      text: `Car rental is not just about transportation; it's about community. Tashus actively engages users through community events, meetups, and initiatives, fostering a sense of belonging among those who choose Tashus as their car rental partner.`,
    },
    {
      title: `Tech Features and Integration in Car Rental Apps`,
      text: `The Tashus app stands as a testament to the seamless integration of technology into car rental. With user-friendly features, secure booking processes, and real-time updates, the Tashus app enhances the overall car rental experience, making it a preferred choice among Sydney residents.`,
    },
    {
      title: `Success Stories and Testimonials in Car Rental`,
      text: `To illustrate the impact of car rental in Sydney, Tashus shares success stories and testimonials from satisfied users. Real-life experiences highlight the positive changes in users' lives, showcasing how Tashus has become an integral part of their urban lifestyle.
      In conclusion, the world of car rental is evolving, and Tashus emerges as a leading name in the industry. With a focus on sustainability, cost-effectiveness, and community engagement, Tashus is not just a car rental provider; it's a travel partner committed to shaping the future of urban mobility in Sydney. Choose Tashus for a smarter, greener, and more connected way to navigate the vibrant streets of Sydney.`,
    },
  ];

  return (
    <div>
      <div className="relative w-full h-screen max-h-[500px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out transform ${
              index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <Image src={image.src} alt={image.title} layout="fill" objectFit="cover" className="rounded" />
          </div>
        ))}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
          <Typography variant="h1" className="text-4xl lg:text-6xl font-bold">
            Shared Rides Shared Responsibility
            <br />
            Tashus Eco-Friendly Car Rental Revolution
          </Typography>
        </div>
      </div>
      <div className="lg:px-44 md:px22 px-4 mb-24 relative">
        <div className="mt-14">
          <Box>
            <Typography variant="h2" className="font-bold text-black text-center mb-4 text-[24px] lg:text-[32px] ">
              <span className="text-black"> The </span>
              <span className="text-primary">Environmental Impact</span>
              <span className="text-black"> of Traditional </span>
              <span className="text-primary">Transportation</span>
            </Typography>
          </Box>
          <p className="text-center">
            {`Individual car ownership contributes significantly to air pollution and traffic congestion. It's evident that the conventional approach
            to personal transportation is unsustainable. This realization has fueled the demand for eco-friendly alternatives.`}
          </p>
        </div>

        <div className="mt-12">
          <div className="flex flex-col md:flex-row items-center justify-center p-4">
            {/* Image on the left */}
            <div className="relative overflow-hidden rounded-md mb-4 md:mb-0 md:mr-8 w-full md:w-1/2">
              <Image
                src="/Images/Eco-Friendly-page/car-made-out-green-leaves-light-green-background-with-reflection-car-generative-ai.webp"
                alt="Tashus eco Friendly Car rental"
                className="object-cover w-full h-full transition-transform transform hover:scale-110 duration-300 rounded-md"
                width={400}
                height={180}
              />
            </div>

            {/* Text div on the right */}
            <Box className="w-full md:w-1/2">
              <h2 className="text-[24px] text-center lg:text-start lg:text-[32px] font-bold mb-4">
                <span className="text-black">The Rise of Eco-Friendly</span> <br></br> <span className="text-primary"> Car Rental.</span>
              </h2>
              <p className="text-base text-center lg:text-start">
                {`Eco-friendly car rental goes beyond just providing rides. It's a commitment to reducing the environmental impact of transportation.
                Leading companies in the industry, such as GreenRide and EcoDrive, are dedicated to offering sustainable mobility solutions.`}
              </p>
            </Box>
          </div>
        </div>

        <div className="mt-6 lg:mt-12">
          <Box>
            <Typography variant="h2" className="font-bold text-black text-center  mb-4 text-[24px] lg:text-[32px] ">
              <span className="text-primary">Green Technologies</span>
              <span className="text-black"> in Car Rental Vehicles: </span>
            </Typography>
          </Box>
          <p className="text-center">
            {`Electric and hybrid vehicles have become the backbone of eco-friendly car rental fleets. These vehicles not only reduce emissions but
            also promote the adoption of cleaner technologies in the automotive industry. The integration of green technologies is a significant step
            towards a more sustainable future.`}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-20">
          {/* Card 1 */}
          <Card className="w-full md:w-1/2 mb-4 md:mr-4">
            <CardHeader
              className="font-bold"
              title={
                <Typography variant="h2" className="font-bold text-base">
                  Collaborative Consumption and Reduced Carbon Footprint
                </Typography>
              }
              avatar={<FaSpa />}
            />
            <CardMedia
              component="img"
              height="200"
              image="/Images/Eco-Friendly-page/eco-friendly-Tashus-car-shareing2.webp"
              alt="Tashus eco Friendly Car rental | Collaborative Consumption"
            />
            <CardContent>
              <Typography variant="body2">
                {`Car rental contributes to collaborative consumption, where resources are shared efficiently. Studies show that car rental can lead
                to a substantial reduction in carbon emissions, making it a key player in the fight against climate change.`}
              </Typography>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="w-full md:w-1/2 mb-4 md:ml-4">
            <CardHeader
              title={
                <Typography variant="h2" className="font-bold text-base">
                  Supporting Sustainable Practices in Car Rental
                </Typography>
              }
              avatar={<MdAllInclusive />}
            />
            <CardMedia
              component="img"
              height="200"
              image="/Images/Eco-Friendly-page/Supporting-Sustainable-Practices-in-Car-Sharing.webp"
              alt="Sustainable Practices | Tashus eco Friendly Car rental"
            />
            <CardContent>
              <Typography variant="body2">
                {`Car rental companies play a crucial role in promoting sustainable practices. Initiatives like carbon offset programs, partnerships with renewable energy providers, and user education on eco-friendly driving habits all contribute to a more sustainable transportation ecosystem.`}
              </Typography>
            </CardContent>
          </Card>
        </div>

        <Box>
          <Typography variant="h2" className="font-bold text-black mt-12 text-center mb-2 lg:mb-4 text-[24px] lg:text-[32px] ">
            <span className="text-black mb-4">More relevant topics for </span>
            <br></br>
            <span className="text-primary">Eco-Friendly Car Rental</span>
          </Typography>
        </Box>

        {/* Expandable List Section */}
        <div className="max-w-[700px] mx-auto mt-8 mb-20">
          {faqData.map((section, index) => (
            <div key={index}>
              <List component="nav">
                <ListItem button onClick={() => handleListItemClick(section.title)} selected={expandedSection === section.title}>
                  <ListItemText
                    primary={
                      <div>
                        <Typography variant="h2" className="font-bold text-base">
                          {section.title}
                        </Typography>
                      </div>
                    }
                  />
                  {expandedSection === section.title ? <MdExpandLess /> : <MdExpandMore />}
                </ListItem>
                <Collapse in={expandedSection === section.title} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemText primary={section.text} />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcoFriendly;
