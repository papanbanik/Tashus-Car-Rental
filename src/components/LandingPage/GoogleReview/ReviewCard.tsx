'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { MdVerified } from 'react-icons/md';

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  review: string;
  profilePhoto: string;
  vehiclePhoto: string;
}

const TRUNCATE_LENGTH = 120;

export default function ReviewCard({ name, date, rating, review, profilePhoto, vehiclePhoto }: ReviewCardProps) {
  const isLong = review.length > TRUNCATE_LENGTH;
  const displayText = !isLong ? review : review.slice(0, TRUNCATE_LENGTH) + '...';
  const hasProfile = !!profilePhoto;
  const hasVehicle = !!vehiclePhoto;

  return (
    <div className="bg-white border border-solid border-primary  rounded-2xl p-5 mx-0.5 flex flex-col gap-0.5 h-[260px] relative overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar — photo or initial fallback */}
          {hasProfile ? (
            <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              <Image src={profilePhoto} alt={name} width={44} height={44} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full flex-shrink-0 bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg uppercase">{name.charAt(0)}</span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800 leading-tight line-clamp-1">
              {name.length > 18 ? name.slice(0, 18) + '...' : name}
            </span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
        </div>

        {/* Google Icon */}
        <FcGoogle className="flex-shrink-0" size={24} />
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: rating }).map((_, i) => (
          <FaStar key={i} className="text-yellow-400" size={18} />
        ))}
        <MdVerified className="text-blue-500 ml-1" size={16} />
      </div>

      {/* Review Text + Vehicle Photo row */}
      <div className="flex gap-3 flex-1 min-h-0 items-start">
        <p className="text-sm  leading-relaxed flex-1 line-clamp-3">{displayText}</p>

        {hasVehicle && (
          <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 mt-5">
            <Image src={vehiclePhoto} alt="Vehicle" width={80} height={64} className="object-cover w-full h-full" />
          </div>
        )}
      </div>

      {/* Read more */}
      {isLong && (
        <Link
          href="https://www.google.com/maps/place/Tashus+Car+Rental+%26+Van+Hire/@-33.9247571,150.9203926,17z/data=!4m8!3m7!1s0x6b12956065557ec3:0x36daa65222735a58!8m2!3d-33.9247571!4d150.9203926!9m1!1b1!16s%2Fg%2F11wbjs4py6?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          className="text-xs text-gray-400 hover:text-primary text-left transition-colors no-underline"
        >
          Read more
        </Link>
      )}

      {/* Quote icon bottom right */}
      <div className="absolute bottom-4 right-4 text-primary opacity-30 text-3xl leading-none select-none">❝</div>
    </div>
  );
}
