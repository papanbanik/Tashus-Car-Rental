'use client';
import CommonViewImageModal from '@/components/Common/CommonViewImageModal';
import ProfileAvatar from '@/components/Common/ProfileAvatar';
import { useModalContext } from '@/context/ModalProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { ControlledFieldProps } from '@/types/componentTypes';
import { colorType } from '@/types/user-verification/userVerificationTypes';
import { getRequestVerificationMessages } from '@/utils/Functions/verification/verificationFn';
import { getTextColorClass } from '@/utils/Functions/verification/verificationStyleFn';
import { Chip } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SectionBorder from '../../SectionBorder';
import ProfileImageModal from './ProfileImageModal';
interface IFileUploadProps extends ControlledFieldProps {
  limit: number;
  multiple: boolean;
  name?: string;
  profileUrl?: string | undefined;
  setProfileUrl?: Dispatch<SetStateAction<string>>;
  singleFile?: File[];
  setSingleFile?: Dispatch<SetStateAction<File[]>>;
  fileList?: File[];
  setFileList?: Dispatch<SetStateAction<File[]>>;
  deleteFileList?: File[];
  setDeleteFileList?: Dispatch<SetStateAction<File[]>>;
  photoUrlList?: string[];
  setPhotoUrlList?: Dispatch<SetStateAction<string[]>>;
}
const ProfileImage = ({ profileUrl }: IFileUploadProps) => {
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | undefined>(profileUrl);
  const { userProfileInfo } = useUserCredContext();
  const { userProfileVerificationInfo } = useProfileInfoContext();
  const { openModal } = useModalContext();
  const [profileImageOpen, setProfileImageOpen] = useState<boolean>(false);

  useEffect(() => {
    if (userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url) {
      setSelectedProfileImage(userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url);
    }
  }, [userProfileVerificationInfo?.profileInfo]);

  const handleProfilePhotoUpload = () => {
    openModal({
      title: 'Profile Photo',
      content: <ProfileImageModal />,
    });
  };
  const { profileMessage } = getRequestVerificationMessages(userProfileVerificationInfo);
  return (
    <SectionBorder>
      {!!userProfileVerificationInfo?.profileInfo?.picture?.status && userProfileVerificationInfo?.profileInfo?.picture?.status === 'declined' && (
        <Chip
          label={`${userProfileVerificationInfo?.profileInfo?.picture?.status}`}
          size="small"
          className="capitalize"
          variant="outlined"
          color={getTextColorClass(userProfileVerificationInfo?.profileInfo?.picture?.status) as colorType}
        />
      )}
      <div className="relative flex flex-col items-center justify-center h-full">
        <div className="relative">
          <ProfileAvatar
            firstName={userProfileInfo?.firstName}
            lastName={userProfileInfo?.lastName}
            profilePictureUrl={selectedProfileImage}
            className={`object-cover ${selectedProfileImage ? 'cursor-pointer' : ''}`}
            sx={{ width: 166, height: 166, bgcolor: !selectedProfileImage ? '#800080' : 'transparent', fontSize: 50 }}
            onClick={() => (selectedProfileImage ? setProfileImageOpen(true) : setProfileImageOpen(false))}
          />
          {/* <Avatar
            src={selectedProfileImage}
            alt="Profile Photo"
            className="object-cover cursor-pointer"
            sx={{ width: 166, height: 166 }}
            onClick={() => setProfileImageOpen(true)}
          /> */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black bg-opacity-50 rounded-b-full flex items-center justify-center z-10 cursor-pointer"
            style={{
              clipPath: 'inset(20px 0 0 0)',
            }}
            onClick={handleProfilePhotoUpload}
          >
            <span className="text-white font-bold text-md cursor-pointer" onClick={handleProfilePhotoUpload}>
              Edit
            </span>
          </div>
        </div>
        {!!profileMessage && <span className="helping_text text-error">{profileMessage}</span>}
      </div>
      <CommonViewImageModal
        isOpen={profileImageOpen}
        handleClose={() => setProfileImageOpen(false)}
        imageUrl={userProfileVerificationInfo?.profileInfo?.picture?.imageInfo?.secure_url || ''}
      />
    </SectionBorder>
  );
};

export default ProfileImage;
