export const vehicleMetadataList = [
  {
    id: '1000',
    name: 'TOYOTA Hiace 4D Van 2019',
    description: 'Spacious and reliable Toyota Hiace 2019 van, ideal for group travel and commercial use.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762336189/listing-photos/1000/1762336185062_20240903_171627.jpg',
  },
  {
    id: '1001',
    name: 'NISSAN Juke 4D Wagon 2014',
    description: 'Compact and stylish Nissan Juke 2014 wagon offering smooth urban driving and comfort.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762336818/listing-photos/1001/1762336815979_20240810_131156.jpg',
  },
  {
    id: '1003',
    name: 'JEEP Cherokee 4D Wagon 2014',
    description: 'Rugged Jeep Cherokee 2014 wagon built for both city roads and off-road adventures.',
    image:
      'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762337265/listing-photos/1003/1762337262493_WhatsApp_Image_20240614_at_82922_AM_4.jpg',
  },
  {
    id: '1005',
    name: 'RENAULT Koleos 4D Wagon 2012',
    description: 'Comfortable Renault Koleos 2012 SUV offering a smooth ride with spacious interiors.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762337443/listing-photos/1005/1762337440621_20250918_090815.jpg',
  },
  {
    id: '1006',
    name: 'CITROEN C4 Cactus 4D Wagon 2016',
    description: 'Unique and efficient Citroën C4 Cactus 2016 designed for comfortable everyday driving.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1750846662/listing-photos/1006/Media.jpg',
  },
  {
    id: '1008',
    name: 'TOYOTA Hiace 4D Van 2020',
    description: 'Modern Toyota Hiace 2020 van offering enhanced comfort and large passenger capacity.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762337728/listing-photos/1008/1762337723877_20250317_154004.jpg',
  },
  {
    id: '1009',
    name: 'FORD Everest 4D Wagon 2019',
    description: 'Powerful Ford Everest 2019 SUV with excellent performance and off-road capability.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762337917/listing-photos/1009/1762337914844_20240427_064246.jpg',
  },
  {
    id: '1012',
    name: 'TOYOTA Rav4 5D Wagon 2020',
    description: 'Versatile Toyota RAV4 2020 SUV combining efficiency, space, and modern features.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762338417/listing-photos/1012/1762338412368_20231013_1642061.jpg',
  },
  {
    id: '1015',
    name: 'SUBARU Forester 4D Wagon 2021',
    description: 'Reliable Subaru Forester 2021 SUV offering safety, comfort, and all-wheel drive capability.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762338662/listing-photos/1015/1762338660262_20231222_142144.jpg',
  },
  {
    id: '1016',
    name: 'MAZDA Mazda6 4D Sedan 2019',
    description: 'Elegant Mazda6 2019 sedan delivering smooth handling and premium driving experience.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1725264707/listing-photos/1016/20231222_152959.jpg',
  },
  {
    id: '1017',
    name: 'Renault Master Van 2020',
    description: 'Large-capacity Renault Master 2020 van suitable for cargo and passenger transport needs.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762338852/listing-photos/1017/1762338850224_20240308_165923.jpg',
  },
  {
    id: '1018',
    name: 'NISSAN X-Trail 4D Wagon 2018',
    description: 'Practical Nissan X-Trail 2018 SUV offering comfort, space, and reliable performance.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1762339030/listing-photos/1018/1762339026270_20241019_103104.jpg',
  },
  {
    id: '1022',
    name: 'TOYOTA COROLLA HYBRID 2020',
    description: 'Fuel-efficient Toyota Corolla Hybrid 2020 providing eco-friendly and smooth city driving.',
    image: 'https://res.cloudinary.com/dimcpbpsg/image/upload/v1766542066/listing-photos/1022/1766542064772_20251224_112401.jpg',
  },
];

export const getVehicleMetadata = (vehicleId: string) => {
  return vehicleMetadataList.find((v) => v.id === vehicleId) ?? null;
};
