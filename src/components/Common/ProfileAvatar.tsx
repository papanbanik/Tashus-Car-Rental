import { Avatar, AvatarProps } from '@mui/material';
import theme from '../Theme/theme';

interface ProfileAvatarProps extends AvatarProps {
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

const ProfileAvatar = ({ firstName = '', lastName = '', profilePictureUrl, ...avatarProps }: ProfileAvatarProps) => {
  return (
    <Avatar
      src={profilePictureUrl}
      alt="Profile Photo"
      sx={
        avatarProps?.sx
          ? avatarProps?.sx
          : {
              border: `1px solid #800080`, // Custom border color
              bgcolor: !profilePictureUrl ? theme.palette.primary.main : 'transparent', // Primary background color if no profile picture
              color: '#fff', // White text for initials
              fontSize: 14, // Adjust text size for initials
            }
      }
      {...avatarProps}
    >
      {
        !profilePictureUrl && `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() // Show initials if no profile picture
      }
    </Avatar>
  );
};

export default ProfileAvatar;
