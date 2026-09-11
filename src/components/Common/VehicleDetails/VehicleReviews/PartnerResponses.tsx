'use client';
import { separateFullName } from '@/utils/Functions/randomCommonFn';
import { useMediaQuery } from '@mui/material';
import CommonExpandText from '../../CommonExpandText';
import ProfileAvatar from '../../ProfileAvatar';

interface PartnerResponsesProps {
  partnerImage?: string;
  partnerName: string;
  reply: string;
}

const PartnerResponses = ({ partnerImage, partnerName, reply }: PartnerResponsesProps) => {
  const isSmallDevice = useMediaQuery('(max-width:600px)');
  const { firstName, lastName } = separateFullName(partnerName);
  return (
    <div className="relative">
      <div className=" absolute left-0 top-1/2 transform -translate-y-1/2">
        {/* <Avatar src={partnerImage ?? ''} sx={{ width: 60, height: 60 }} /> */}
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          profilePictureUrl={partnerImage}
          sx={{ width: 60, height: 60, bgcolor: !partnerImage ? '#800080' : 'transparent', fontSize: 24 }}
        />
      </div>
      <div className="flex flex-row items-center bg-secondary p-4 rounded-lg ml-8">
        <div className="flex flex-col ml-6">
          <div className="flex flex-row items-center">
            <span className="font-bold pr-4">{partnerName}</span>
          </div>
          <CommonExpandText className="text-justify" maxLines={2} multiMaxLine={isSmallDevice ? 30 : 50} text={reply ?? ''} />
        </div>
      </div>
    </div>
  );
};

export default PartnerResponses;
