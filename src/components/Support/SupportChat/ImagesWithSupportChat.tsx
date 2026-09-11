'use client';

import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { deleteFromCloudinary, saveChatImageListToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import CommonForm from '@/components/Common/CommonForm';
import DisplayRichText from '@/components/Common/DisplayRichText';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useGetAllCommentsOfATicket } from '@/hooks/support-center/useGetAllCommentsOfATicket';
import { useAddUserNewComment } from '@/hooks/support-center/usePutUserNewCoomentToATicket';
import { AddUserNewCommentType, SupportChatValues } from '@/types/componentTypes';
import { formatFullDateTime } from '@/utils/Functions/dateTimeCommonFn';
import { Box, Button, Container, IconButton, Modal, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoMdSend } from 'react-icons/io';
import { MdArrowBack, MdCollections } from 'react-icons/md';
import SupportCenterUpdated from '../SupportCenter/SupportCenterUpdated';
import { AiOutlineClose } from 'react-icons/ai';
import UpdatedCommonImgZoomInOutModal from '@/components/Common/ZoomInOutModal/UpdatedCommonImgZoomInOutModal';

interface SupportChatProps {
  showSupportCenter: boolean;
  setShowSupportCenter: (value: boolean) => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ showSupportCenter, setShowSupportCenter }) => {
  // const params = useParams();
  // const currentSupportChatId = params['support-ticket-id'];
  const { supportTicketId: currentSupportChatId } = useParams<{ supportTicketId: string }>();
  const { mutateAsync: addUserNewComment, isLoading } = useAddUserNewComment();
  const { refetch: getAllCommentsOfATicket } = useGetAllCommentsOfATicket(currentSupportChatId);
  // const { data } = useGetAllCommentsOfATicket(currentSupportChatId);

  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { setShowChat, allTickets, allComments, defaultTab } = useGetAllCommentsOfATicketContext();
  const [isUploadPhotoButtonClicked, setIsUploadPhotoButtonClicked] = useState<boolean>(false);
  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const { userCred } = useUserCredContext();
  const [open, setOpen] = useState<boolean>(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');
  const [selectedImageList, setSelectedImageList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleOpen = (attachmentIndex: number, images: any) => {
    setCurrentIndex(attachmentIndex);
    const allImages = images?.attachments?.map((item: any) => item?.fileInfo?.secure_url);
    if (allImages) {
      setSelectedImageList(allImages);
      setModalImageSrc('');
    } else {
      setModalImageSrc(images?.fileInfo?.secure_url);
      setSelectedImageList([]);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isValid, isDirty },
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    trigger,
  } = useForm<SupportChatValues>({
    shouldFocusError: false,
    mode: 'onChange',
  });
  const commonProps = {
    control,
    photoUrlList,
    fileList,
    setFileList,
    setPhotoUrlList,
    registerName: 'chatPhotosUrl',
    limit: 5,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
  };

  const onAddUserNewComment: SubmitHandler<SupportChatValues> = async (data) => {
    const { userId } = JSON.parse(localStorage.getItem('tashus') || '{}');
    try {
      let comment = data.comment;
      let attachments = [];
      if (comment === undefined || comment === '<p><br></p>') {
        comment = '';
      }

      if (data.chatPhotosUrl) {
        const { imageUrlList, uploadedUrls } = await saveChatImageListToCloudinary(data.chatPhotosUrl, userId);
        await deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId));
        attachments = imageUrlList;
        setPhotoUrlList(uploadedUrls);
      }

      if (comment || attachments.length > 0) {
        const SubmitData: AddUserNewCommentType = {
          status: allComments?.status === 'inprogress' ? 'inprogress' : 'open',
          commentData: {
            userId: userId,
            supportAgentId: '',
            isSupportAgentComment: false,
            comment: comment.replace(/(&nbsp;|&#160;|\u00A0)/g, ' '),
            attachments: attachments,
          },
          ticketId: allComments._id,
        };

        await addUserNewComment(SubmitData);
        setIsUploadPhotoButtonClicked(false);
        setPhotoUrlList([]);
        setFileList([]);
        setDeleteFileList([]);
        attachments = [];
        comment = '';

        reset();
        setIsButtonLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsButtonLoading(false);
    }
  };
  const handleUploadPhotoButtonClick = () => {
    setIsUploadPhotoButtonClicked(!isUploadPhotoButtonClicked);
  };
  const fetchSingleTicket = async () => {
    if (currentSupportChatId) {
      try {
        await getAllCommentsOfATicket();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (userCred?.userId && currentSupportChatId) {
      fetchSingleTicket();
    }
    if (!allComments.status && userCred?.userId && currentSupportChatId) {
      fetchSingleTicket();
    }
  }, [userCred, currentSupportChatId]);

  let imageWidth = 150;
  let imageHeight = 100;

  if (isSmall) {
    imageWidth = 80;
    imageHeight = 50;
  }

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  const modalWidth = 0.9 * screenWidth;
  const modalHeight = 0.8 * screenHeight;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: modalWidth,
    height: modalHeight,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    if (commentsContainerRef.current) {
      (commentsContainerRef.current as HTMLDivElement).scrollTop = (commentsContainerRef.current as HTMLDivElement).scrollHeight;
    }
  }, [currentSupportChatId]);

  return (
    <>
      <Container className="p-0 m-0 rounded-2xl  flex flex-col bg-white" style={{ height: 'calc(100vh - 80px)' }}>
        {showSupportCenter ? (
          <>
            {/* Main Content */}
            <div className="h-full w-full flex relative max-h-[calc(100vh-89px)] overflow-y-auto bg-white rounded-2xl">
              <div className="flex-1 bg-white rounded-2xl">
                <SupportCenterUpdated />
              </div>

              {/* Close Button */}
              <div
                onClick={() => {
                  setShowSupportCenter(false);
                  setShowChat(false);
                }}
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-red-500 focus:outline-none z-10"
              >
                <AiOutlineClose />
              </div>
            </div>
          </>
        ) : (
          <div className="h-full">
            {allTickets && allTickets?.length > 0 ? (
              <>
                {currentSupportChatId ? (
                  <Paper elevation={0} className=" bg-white rounded-2xl flex flex-col h-full">
                    <div className="flex items-center justify-center shadow-2xl ">
                      {isSmall && (
                        <span className="items-center justify-start">
                          <Tooltip enterTouchDelay={0} title="Back" className="pl-0">
                            <IconButton
                              onClick={() => {
                                router.push('/support/support-ticket');
                                setShowChat(false);
                              }}
                            >
                              <MdArrowBack />
                            </IconButton>
                          </Tooltip>
                        </span>
                      )}

                      {allComments.status && (
                        <div className="w-full flex flex-col justify-center bg-[#FAEBFA] rounded-t-2xl">
                          <span className="text-center mt-1 font-bold text-primary m-0">{allComments && allComments.subject}</span>

                          <div className="text-center mb-0.5">
                            {allComments.reservationId ? (
                              <span
                                onClick={() =>
                                  router.push(
                                    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${userCred?.userId}/reservations/details/${allComments.reservationId}`
                                  )
                                }
                              >
                                Reservation ID: <span className="font-semibold cursor-pointer underline">{allComments.reservationId}</span>
                              </span>
                            ) : (
                              <span>
                                General Ticket ID: <span className="font-semibold">{allComments.supportTicketId}</span>
                              </span>
                            )}
                            <span className="mx-2">{'|'}</span>
                            <span>
                              Status: <span className="font-semibold"> {allComments.status}</span>{' '}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <Divider />
                    <div className="w-full flex-grow overflow-y-scroll p-2" ref={commentsContainerRef}>
                      {allComments?.description && (
                        <>
                          <div className="text-xs text-center m-1 ">{formatFullDateTime(allComments.createdAt)}</div>
                          <div className="flex flex-col items-end mr-4">
                            {allComments?.description && (
                              <span style={{ backgroundColor: '#F1E3F1' }} className="text-sm font-medium p-2 max-w-[75%] inline-block rounded-lg">
                                {<DisplayRichText content={`${allComments?.description}`} />}
                              </span>
                            )}

                            <div className="flex flex-wrap max-w-[75%]">
                              {allComments.attachments?.map((attachment: any, attachmentIndex: number) => (
                                <div key={attachmentIndex} className="p-1">
                                  {attachment.fileInfo && attachment.fileInfo.secure_url && (
                                    <Image
                                      src={attachment.fileInfo.secure_url}
                                      alt="Attachment"
                                      width={imageWidth}
                                      height={imageHeight}
                                      className="rounded-lg z-0 cursor-pointer"
                                      onClick={(event) => {
                                        handleOpen(attachmentIndex, attachment);
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                            {allComments?.returnedKilometersRange && allComments?.returnedKilometersRange > 0 ? (
                              <span style={{ backgroundColor: '#F1E3F1' }} className="text-sm font-medium p-2 max-w-[75%] inline-block rounded-lg">
                                Kilometers Range when Returned : {<DisplayRichText content={`${allComments?.returnedKilometersRange}`} />}
                              </span>
                            ) : (
                              ''
                            )}
                            {allComments?.rentedKilometersRange && allComments?.rentedKilometersRange > 0 ? (
                              <span
                                style={{ backgroundColor: '#F1E3F1' }}
                                className="text-sm font-medium mt-2 p-2 max-w-[75%] inline-block rounded-lg"
                              >
                                Kilometers Range when rented : {<DisplayRichText content={`${allComments?.rentedKilometersRange}`} />}
                              </span>
                            ) : (
                              ''
                            )}
                            {allComments?.vehicleNickName && (
                              <span
                                style={{ backgroundColor: '#F1E3F1' }}
                                className="text-sm font-medium mt-2 p-2 max-w-[75%] inline-block rounded-lg"
                              >
                                Vehicle Info : {`${allComments?.vehicleNickName}`}
                              </span>
                            )}
                          </div>
                        </>
                      )}

                      <Modal open={open} onClose={handleClose}>
                        <Box sx={style}>
                          {modalImageSrc && (
                            <Image src={modalImageSrc} alt="Attachment" fill={true} style={{ objectFit: 'contain' }} className="rounded-lg z-0" />
                          )}
                        </Box>
                      </Modal>

                      {allComments &&
                        allComments?.comments?.map((chat: any, index: number) => (
                          <div key={index}>
                            <div className="text-center m-1 text-xs">{dayjs(chat.createdDate).format('D MMM YYYY hh:mm A')}</div>

                            <div className={`flex flex-col ${chat.isSupportAgentComment ? 'items-start ml-4' : 'mr-4 items-end'}`}>
                              {chat?.comment && (
                                <span
                                  style={{ backgroundColor: chat.isSupportAgentComment ? '#D9D9D9' : '#F1E3F1' }}
                                  className="text-sm font-medium p-2 max-w-[75%] inline-block rounded-lg"
                                >
                                  {<DisplayRichText content={`${chat.comment}`} />}
                                </span>
                              )}
                              <div className="flex flex-wrap max-w-[75%]">
                                {chat.attachments?.map((attachment: any, attachmentIndex: number) => (
                                  <div key={attachmentIndex} className="p-1 ">
                                    {attachment.fileInfo && attachment.fileInfo.secure_url && (
                                      <Image
                                        src={attachment.fileInfo.secure_url}
                                        alt="Attachment"
                                        width={imageWidth}
                                        height={imageHeight}
                                        className="rounded-lg z-0 cursor-pointer"
                                        onClick={(event) => {
                                          handleOpen(attachmentIndex, chat);
                                        }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <CommonForm handleFunction={handleSubmit(onAddUserNewComment)}>
                      <section className="mx-auto my-30">
                        <div className="m-2 px-7">
                          <RichEditor control={control} registerName="comment" label="Type your comment here" required={false} errors={undefined} />
                        </div>
                        {isUploadPhotoButtonClicked && (
                          <div className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px] m-4`}>
                            <FileUpload2 {...commonProps} />
                          </div>
                        )}
                        <div className="m-2 flex justify-center gap-10">
                          <div>
                            <Button
                              className="px-10"
                              variant="contained"
                              component="span"
                              color="primary"
                              fullWidth
                              onClick={handleUploadPhotoButtonClick}
                            >
                              {isSmall ? (
                                <>
                                  <MdCollections className="mr-2" /> Photo
                                </>
                              ) : (
                                <>
                                  <MdCollections className="mr-2" /> Upload Photo
                                </>
                              )}
                            </Button>
                          </div>

                          <Button
                            className="px-10 ${isButtonLoading? cursor-none}"
                            type="submit"
                            variant="contained"
                            sx={{
                              backgroundColor: isLoading || isButtonLoading ? 'grey.500' : undefined,
                              cursor: isButtonLoading ? 'not-allowed' : 'pointer',
                              '&:hover': {
                                backgroundColor: isLoading || isButtonLoading ? 'grey.500' : undefined,
                              },
                            }}
                            disabled={isLoading || !isDirty}
                            onClick={() => setIsButtonLoading(true)}
                          >
                            {isSmall ? (
                              <> {isLoading || isButtonLoading ? 'Submitting' : 'Submit'} </>
                            ) : (
                              <>
                                <IoMdSend className="mr-2" />
                                {isLoading || isButtonLoading ? 'Submitting' : 'Submit'}
                              </>
                            )}
                          </Button>
                        </div>
                      </section>
                    </CommonForm>
                  </Paper>
                ) : (
                  <div className="  h-full flex items-center justify-center rounded-2xl">
                    <Typography variant="h6" className="text-gray-400 text-center mt-8">
                      Please click on a ticket from left side to view comments.
                    </Typography>
                  </div>
                )}
              </>
            ) : defaultTab === 'current' ? (
              <p className="text-center text-gray-400">
                You do not have any current ticket. Please
                <Link href="/support/support-center/general?from=general" className="mx-2 text-blue-700 underline">
                  Create One
                </Link>
                if needed.
              </p>
            ) : (
              ''
            )}
          </div>
        )}
      </Container>

      <UpdatedCommonImgZoomInOutModal
        open={open}
        handleClose={handleClose}
        modalImageSrc={selectedImageList?.length > 0 ? selectedImageList[currentIndex] : modalImageSrc}
        imageList={selectedImageList}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
};

export default SupportChat;

// {
//   {
//     // for showing image and files together

//     chat.attachments?.map((attachment: any, attachmentIndex: number) => (
//       <div key={attachmentIndex} className="message-text">
//         {attachment.fileInfo && attachment.fileInfo.secure_url ? (
//           attachment.fileInfo.format === 'png' || attachment.fileInfo.format === 'jpg' || attachment.fileInfo.format === 'jpeg' ? (
//             // Display images with an <img> tag
//             <img src={attachment.fileInfo.secure_url} alt="Attachment" />
//           ) : (
//             // Display other types of files with a download link
//             <div>
//               <a href={attachment.fileInfo.secure_url} target="_blank" rel="noreferrer noopener">
//                 Download attachments.
//               </a>
//               <br />
//               <small>File Name: {attachment.filename}</small>
//             </div>
//           )
//         ) : null}
//       </div>
//     ));
//   }
// }
