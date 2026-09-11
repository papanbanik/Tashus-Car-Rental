import GoogleReview from './GoogleReview';
import GoogleReviewButtonQRCode from './GoogleReviewButtonQRCode';

const GoogleReviewSection = () => {
  return (
    <>
      <div className="flex items-center justify-center mb-24">
        <div className="w-full md:w-10/12 flex flex-col items-center justify-center">
          {/* Heading */}
          <div className="mb-6">
            <span className="text-2xl lg:text-4xl text-black font-bold text-center">
              What Our <span className="text-primary">Guests Say</span>
            </span>
          </div>

          {/* Review Slider */}
          <GoogleReview />

          {/* Button + QR Code */}
          <GoogleReviewButtonQRCode />
        </div>
      </div>
    </>
  );
};

export default GoogleReviewSection;
