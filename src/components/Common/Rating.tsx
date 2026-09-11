import { useState } from 'react';

// Updated Rating component with interactivity and numeric value

interface RatingProps {
  initialRating: number;
  noTextShow?: boolean;
}

export function Rating({ initialRating, noTextShow }: RatingProps) {
  // Initialize the rating state with the initial value from props
  const [rating, setRating] = useState(initialRating);

  // Create an array of stars based on the rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`lg:text-2xl text-xl ${index < rating ? 'text-warning' : 'text-gray-300'}`}>
      ★
    </span>
  ));
  return (
    <div className="flex items-center">
      <div className="mr-2">{stars}</div>
      {!noTextShow && (
        <>
          <span>{rating}</span>
          <span>/5</span>
        </>
      )}
    </div>
  );
}
