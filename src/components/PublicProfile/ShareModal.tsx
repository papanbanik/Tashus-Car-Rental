import { Button, Input, Typography } from '@mui/material';
import { useState } from 'react';
import { FaFacebookSquare, FaWhatsapp } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';

const ShareModal = () => {
  const currentUrl = window.location.href;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <Typography className="text-xl md:text-2xl font-bold mb-4">Share your profile on Social Media</Typography>

      <div className="flex space-x-4">
        <FacebookShareButton url={currentUrl} hashtag="#CheckMyProfileOnTashus">
          <FaFacebookSquare className="text-blue-600 text-4xl" />
        </FacebookShareButton>
        <TelegramShareButton url={currentUrl} title="Check My Profile on Tashus Car rental platform">
          <IoMdSend className="text-blue-600 text-4xl cursor-pointer" onClick={() => console.log('Messenger clicked')} />
        </TelegramShareButton>
        <TwitterShareButton url={currentUrl}>
          {/* <TwitterIcon className="text-[#1DA1F2] text-4xl" /> */}
          <FaSquareXTwitter className=" text-4xl" />
        </TwitterShareButton>
        <WhatsappShareButton url={currentUrl}>
          <FaWhatsapp className="text-green-600 text-4xl" />
        </WhatsappShareButton>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <Input type="text" readOnly fullWidth className="border p-2" value={currentUrl} inputProps={{ style: { fontSize: '16px' } }} />
          <Button variant="contained" color="primary" onClick={handleCopyLink} style={{ minWidth: '120px' }}>
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
