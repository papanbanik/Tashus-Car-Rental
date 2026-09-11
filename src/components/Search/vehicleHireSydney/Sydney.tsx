'use client';
import { Box, Collapse, List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
const Sydney = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/Images/Sydney/Tashus-Sydney-cover2.jpg',
    '/Images/Sydney/Tashus-Sydney-cover3.jpg',
    '/Images/Sydney/white-concrete-structure-beside-body-water.jpg',
  ];

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const cardData = [
    {
      title: 'Tashus - Convenient Car Hire for Sydney Opera House Visits',
      text: ' Iconic and globally recognized, the Sydney Opera House is a masterpiece of modern architecture. Take a guided tour or catch a performance in one of its stunning venues.',
      image: '/Images/Sydney/Top-places/Sydney_Opera_House_Tashus_Car_shareing.jpg',
      cardImage: '/Images/Sydney/Top-places/Sydney_Opera_House_Tashus_Car_shareing.jpg',
    },
    {
      title: 'Tashus - Explore Sydney Harbour Bridge with Hassle-Free Car Rental',
      text: ' Walk or cycle across the bridge for breathtaking views of the city and harbor. For a more adventurous experience, consider the BridgeClimb, where you can ascend to the summit.',
      image: '/Images/Sydney/Top-places/Sydney_Harbour_Bridge_Tashus_Car_shareing.jpg',
      cardImage: '/Images/Sydney/Top-places/Sydney_Harbour_Bridge_Tashus_Car_shareing.jpg',
    },
    {
      title: 'Tashus - Enjoy Bondi Beach with Our Easy Car Hire in Sydney',
      text: 'Famous for its golden sands and great surfing conditions, Bondi Beach is a popular spot for locals and tourists alike. Enjoy the sun, surf, and the vibrant beach culture.',
      image: '/Images/Sydney/Top-places/Bondi_Beach_Tashus_Car_shareing.jpg',
      cardImage: '/Images/Sydney/Top-places/Bondi_Beach_Tashus_Car_shareing.jpg',
    },
    {
      title: 'Tashus - Discover Royal Botanic Garden with a Sydney Car Rental',
      text: 'A peaceful oasis in the heart of the city, the Royal Botanic Garden offers beautifully landscaped grounds, a variety of plant collections, and fantastic views of the Sydney Opera House and Harbour Bridge.',
      image: '/Images/Sydney/Top-places/Royal_Botanic_Garde_Tashus_Car_shareing.jpg',
      cardImage: '/Images/Sydney/Top-places/Royal_Botanic_Garde_Tashus_Car_shareing.jpg',
    },
    {
      title: 'Tashus - Visit Taronga Zoo with Flexible Sydney Car Rental Options',
      text: 'Located on the shores of Sydney Harbour, Taronga Zoo is home to a diverse range of animals. You can also take a ferry to the zoo, enjoying stunning views of the city along the way.',
      image: '/Images/Sydney/Top-places/Taronga_Zoo_Tashus_Car_shareing.jpg',
      cardImage: '/Images/Sydney/Top-places/Taronga_Zoo_Tashus_Car_shareing.jpg',
    },
  ];

  const faqData = [
    {
      title: `Car Rental Providers in Sydney`,
      text: `In the realm of car rental in Sydney, providers like GoGet, Car Next Door, and Flexicar have emerged as major players. However, one distinct name stands out – Tashus. As a car-rental and travel partner, Tashus sets itself apart by combining convenience with a commitment to environmental sustainability.`,
    },
    {
      title: `Cost-Effective Travel with Car Rental`,
      text: `For Sydneysiders looking to make their dollars go further, car rental proves to be a cost-effective alternative to traditional transportation. Tashus, with its transparent pricing and flexible plans, positions itself as an economical choice for those seeking affordability without compromising on quality service.`,
    },
    {
      title: `Sustainability and Car Rental in Sydney`,
      text: `In a city that values sustainability, Tashus aligns perfectly with the eco-conscious lifestyle. Car rental inherently reduces the number of vehicles on the road, contributing to Sydney's efforts in creating a greener urban environment. Tashus takes this commitment further by incorporating eco-friendly practices into its operations.`,
    },
    {
      title: `Navigating Sydney Traffic with Car Rental`,
      text: `Navigate the bustling streets of Sydney effortlessly by utilizing the Tashus app and Seamless Journey feature. Easily rent a nearby car, resolving your travel needs, and drive to your destination hassle-free.`,
    },
    {
      title: `The Future of Car Rental in Sydney`,
      text: `Looking ahead, the future of car rental in Sydney holds exciting prospects, and Tashus is at the forefront of these advancements. As technology evolves, Tashus continues to innovate, promising users a glimpse into the future of urban mobility through features like electric vehicles, ensuring a sustainable and cutting-edge experience.`,
    },
    {
      title: `Regulations and Compliance in Car Rental`,
      text: `Understanding the legal landscape of car rental is crucial, and Tashus ensures compliance with all regulations in Sydney. Users can trust Tashus to provide a safe and legal car-rental experience, giving them peace of mind as they navigate the city.`,
    },
    {
      title: `Community Impact and Engagement in Car Rental`,
      text: `Car rental is not just about transportation; it's about community. Tashus actively engages users through community events, meetups, and initiatives, fostering a sense of belonging among those who choose Tashus as their car-rental partner.`,
    },
    {
      title: `Tech Features and Integration in Car Rental Apps`,
      text: `The Tashus app stands as a testament to the seamless integration of technology into car rental. With user-friendly features, secure booking processes, and real-time updates, the Tashus app enhances the overall car-rental experience, making it a preferred choice among Sydney residents.`,
    },
    {
      title: `Success Stories and Testimonials in Car Rental`,
      text: `To illustrate the impact of car rental in Sydney, Tashus shares success stories and testimonials from satisfied users. Real-life experiences highlight the positive changes in users' lives, showcasing how Tashus has become an integral part of their urban lifestyle.
      In conclusion, the world of car rental is evolving, and Tashus emerges as a leading name in the industry. With a focus on sustainability, cost-effectiveness, and community engagement, Tashus is not just a car-rental provider; it's a travel partner committed to shaping the future of urban mobility in Sydney. Choose Tashus for a smarter, greener, and more connected way to navigate the vibrant streets of Sydney.`,
    },
  ];

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleListItemClick = (sectionTitle: string) => {
    setExpandedSection((prevExpanded) => (prevExpanded === sectionTitle ? null : sectionTitle));
  };
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const cardInterval = setInterval(() => {
      setCurrentCard((prevCard) => (prevCard + 1) % cardData.length);
    }, 5000);

    return () => clearInterval(cardInterval);
  }, [cardData.length]);

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
            <Image src={image} alt={`Tashus - Easy Car Rental Sydney ${index + 1}`} layout="fill" objectFit="cover" className="rounded" />
          </div>
        ))}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
          <h2 className="text-4xl lg:text-6xl  font-bold">
            Experience Sydney like never before
            <br />
            with Tashus Car Rental!
          </h2>
        </div>
      </div>
      <div className="md:px-44 px-8 mb-24 relative ">
        <div className=" mt-14">
          <Box>
            <Typography variant="h1" className="font-bold text-black   text-center mb-4 text-[24px] lg:text-[32px] ">
              <span className="text-black">Car Rental in </span>
              <span className="text-primary">Sydney</span>
            </Typography>
          </Box>
          <p className="text-center">
            Car rental in Sydney has become synonymous with urban mobility, offering residents and visitors a convenient and sustainable way to
            navigate the city. As Sydney embraces innovative transportation solutions, the spotlight falls on car rental for its efficiency and
            eco-friendly appeal.
          </p>
        </div>

        <Box>
          <Typography variant="h2" className="font-bold text-black mt-12  text-center mb-2 lg:mb-4 text-[24px] lg:text-[32px] ">
            <span className="text-primary">Top </span>
            <span className="text-black">places to visit in </span>
            <span className="text-primary">Sydney</span>
          </Typography>
        </Box>

        {/* Responsive Slider Section */}
        {isLargeDevice ? (
          // Large devices: Use the existing slider for larger devices
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-between max-w-[800px] mx-auto relative mt-8">
            <div className="lg:w-1/2 lg:flex-shrink-0 lg:overflow-hidden lg:relative sm:w-full flex flex-col">
              {cardData.map((card, index) => (
                <div
                  key={index}
                  className={`w-full h-full transition-transform duration-1000 ease-in-out transform ${
                    index === currentCard ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  } rounded absolute top-0 left-0`}
                >
                  <Image src={card.cardImage} alt={card.title} layout="fill" objectFit="cover" className="rounded" />
                </div>
              ))}
            </div>

            <div className="lg:w-1/2 p-4 pr-10 lg:flex flex-col justify-center bg-white overflow-hidden rounded lg:z-10">
              <Typography variant="h2" className="text-lg lg:text-xl font-bold mb-2 text-center lg:text-left">
                {cardData[currentCard].title}
              </Typography>
              <p className="text-base text-center lg:text-left">{cardData[currentCard].text}</p>
            </div>
          </div>
        ) : (
          // Small devices: Display cards one at a time
          <div className="max-w-[700px] mx-auto mt-8">
            <div className="w-full h-full transition-transform duration-1000 ease-in-out transform">
              <Image
                src={cardData[currentCard].cardImage}
                alt="Tashus - Car rental Sydney"
                layout="responsive"
                width={500}
                height={300}
                className="rounded max-h-[350px]"
              />
              <div className="p-4 bg-white rounded">
                <Typography variant="h2" className="text-lg lg:text-xl font-bold mb-1 text-center lg:text-center">
                  {cardData[currentCard].title}
                </Typography>
                <p className="text-base text-center lg:text-left">{cardData[currentCard].text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Dots */}
        <div className="flex justify-center mt-4">
          {cardData.map((_, index) => (
            <div
              key={index}
              style={{ backgroundColor: index === currentCard ? '#800080' : 'rgba(128, 0, 128, 0.5)' }}
              className="w-4 h-4 rounded-full cursor-pointer mx-2"
              onClick={() => setCurrentCard(index)}
            ></div>
          ))}
        </div>
      </div>

      <Box>
        <Typography variant="h2" className="font-bold text-black mt-12  text-center mb-2 lg:mb-4 text-[24px] lg:text-[32px] ">
          <span className="text-black">More relevant topics for </span>
          <br />
          <span className="text-primary">Car Rental in Sydney</span>
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
                      <Typography variant="h2" className="font-bold text-base ">
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
  );
};

export default Sydney;
