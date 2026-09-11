'use client';
import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { deleteFromCloudinary, saveChatImageListToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import SectionHeader from '@/components/CarListing/SectionHeader';
import CommonSnackBar from '@/components/Common/CommonSnackBar';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import TravelDurationInfo from '@/components/UserProfileUpdated/Travels/TravelDetails/TravelDurationInfo';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useTravelContext } from '@/context/TravelProvider';
import useMediumForTravelDetails from '@/hooks/responsive/useMediumForTravelDetails';
import { useTravelDetails } from '@/hooks/travel/useTravelDetails';
import { Autocomplete, Box, ClickAwayListener, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { FaQuestionCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { MdCollections } from 'react-icons/md';

type SupportTicketInputs = {
  category: string | null;
  subject: string;
  description: string;
  returnedKilometersRange: string;
  rentedKilometersRange: string;
  chatPhotosUrl: Blob[];
};

const SupportCenter = () => {
  const params = useParams<{ reservationId: string }>();
  const searchParams = useSearchParams();
  const [richEditorShow, setRichEditorShow] = useState(true);
  const [userRole, setUserRole] = useState<any>();
  const [reservationId, setReservationId] = useState<number>();
  const [carListingId, setCarListingId] = useState<number>();
  const [issueCategory, setIssueCategory] = useState<string | null>();
  const [issueType, setIssueType] = useState<string | any>();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [reservationDetails, setReservationDetails] = useState<object | any>();
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const iseLessSmall = useMediaQuery(theme.breakpoints.down(768));
  const [isUploadPhotoButtonClicked, setIsUploadPhotoButtonClicked] = useState<boolean>(false);
  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const [supportTicketId, setSupportTicketId] = useState<string>('23');
  const { updatedTravelData } = useTravelContext();
  const { isVehicleUnlisted, setVehicleUnlisted } = useGetAllCommentsOfATicketContext();
  const { data } = useTravelDetails();
  const isMedium = useMediumForTravelDetails();
  const [open, setOpen] = React.useState(false);
  const [issueTitle, setIssueTitle] = useState<string | null>();
  const [descriptionContent, setDescriptionContent] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [vehicleNickName, setVehileNickName] = useState<string | null>('');

  useEffect(() => {
    if (searchParams) {
      setUserRole(searchParams.get('role'));
      setIssueType(searchParams.get('from'));
    }
    const rId = parseInt(params?.reservationId);

    if (rId) {
      setReservationId(rId);
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('status')) {
      const unlistedValue = urlParams.get('status');

      setIssueTitle(unlistedValue);
      setIssueType('general');
      const vehicleNickName = urlParams.get('carNickName');
      setVehileNickName(vehicleNickName);
    }
  }, [searchParams, params]);

  useEffect(() => {
    if (issueTitle !== 'undefined' && issueTitle === 'listed') {
      setIssueCategory('Vehicle Listing');
    } else if (issueTitle !== 'undefined' && issueTitle === 'unlisted') {
      setIssueCategory('Vehicle Unlisting');
      setVehicleUnlisted(false);
    } else {
      setIssueCategory(issueCategory);
    }
  }, [issueTitle]);

  useEffect(() => {
    fetchReservationDetails();
  }, [reservationId]);

  const partnerIssueCategories = [
    'Reservation',
    'Vehicle Damage',
    'Fuel Gap',
    'Missing Parts',
    'Illegal Parking',
    'Infringements',
    'Cleanliness',
    'Smoking Odour',
    'Tolls',
    'Other',
  ];

  const cancelCurrentReservationCategories = ['Guest Not Present', 'Driver License Not Shown', 'Driver License Expired', 'Guest Has Animal', 'Other'];

  const guestIssueCategories = ['Low Fuel', 'Cleanliness', 'Vehicle Damage', 'Other'];

  const generalIssueCategories = ['Billing Info', 'Payment Claim', 'Vehicle Listing', 'Vehicle Unlisting ', 'Other'];

  const {
    control,
    register,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    trigger,
  } = useForm<SupportTicketInputs>({
    mode: 'onChange', // Validate on change
    defaultValues: {
      category: null,
      subject: '',
      description: '',
      returnedKilometersRange: '',
      rentedKilometersRange: '',
      chatPhotosUrl: [],
    },
    criteriaMode: 'all',
  });

  const description = watch('description', '');
  const subject = watch('subject', '');
  const returnedKilometersRange = watch('returnedKilometersRange', '');
  const rentedKilometersRange = watch('rentedKilometersRange', '');
  useEffect(() => {
    setDescriptionContent(description);
  }, [description]);

  const isEmptyDescription = (content: string) => {
    return content === '<p><br></p>';
  };

  const isSubmitDisabled = !isValid || !isDirty || !subject || !descriptionContent || isEmptyDescription(descriptionContent);

  const handleIssue = (event: React.SyntheticEvent, newValue: string | null) => {
    setRichEditorShow(true);
    setIssueCategory(newValue);
    setValue('category', newValue);
  };

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

  const onSubmit = async (data: any) => {
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    setIsDisabled(true); // Disable button immediately upon click

    if (!issueType || !data?.subject || !data?.description) {
      return;
    }
    let attachments = [];

    if (data.chatPhotosUrl) {
      const { imageUrlList, uploadedUrls } = await saveChatImageListToCloudinary(data.chatPhotosUrl, userCred?.userId);
      await deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId));
      attachments = imageUrlList;
      setPhotoUrlList(uploadedUrls);
    }

    const ticket = {
      ...(carListingId === undefined ? {} : { carListingId }),
      ...(reservationId === undefined ? {} : { reservationId }),
      issueType: issueType,
      subject: data?.subject,
      ...(issueCategory !== undefined && issueCategory === 'Fuel Gap'
        ? {
            returnedKilometersRange: data?.returnedKilometersRange,
            rentedKilometersRange: data?.rentedKilometersRange,
          }
        : {}),
      description: data?.description.replace(/(&nbsp;|&#160;|\u00A0)/g, ' '),
      status: 'open',
      issueBy: userCred.userId,
      category: formatCategory(issueCategory ? issueCategory : data?.category),
      attachments: attachments,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/support-ticket/${reservationId === undefined ? 'general' : 'reservation'}`,
        ticket,
        {
          headers: {
            Authorization: `Bearer ${userCred.accessToken}`,
          },
        }
      );
      if (res) {
        setAlertMessage('Ticket Created Successfully');
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-ticket/${res?.data?.supportTicketId}`);
        setIsUploadPhotoButtonClicked(false);
        setSupportTicketId((parseInt(res.data.supportTicketId, 10) + 1).toString());
        setIsDisabled(false); // Re-enable button once submission is complete
      }
    } catch (error) {
      setAlertMessage('Failed to Create Ticket.');
      setIsDisabled(false); // Re-enable button on error
      console.log(error);
    }
  };
  const handleUploadPhotoButtonClick = () => {
    setIsUploadPhotoButtonClicked(!isUploadPhotoButtonClicked);
  };

  const fetchReservationDetails = async () => {
    const userCred = JSON.parse(localStorage.getItem('tashus') as string);
    if (!reservationId) {
      return;
    }
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reservation/find/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${userCred.accessToken}`,
        },
      });

      // console.log(res);
      if (res) {
        setReservationDetails(res?.data);
        setCarListingId(res?.data?.carListingId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const formatCategory = (input: string) => {
    return input.replace(/\s+/g, '').replace(/(\b\w)/g, (match) => match.toUpperCase());
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="w-10/12 mx-auto mb-10  ">
        <Box className="grid place-items-center mb-5 lg:mb-4">
          <Image
            src="/Images/Tashus_support-02-01.svg"
            alt="Banner Image"
            layout="responsive"
            width={500}
            height={500}
            style={{ maxWidth: '650px', maxHeight: '205px', width: '100%', height: '100%' }}
          />
        </Box>

        <span className="text-center flex mb-4 lg:mb-4 justify-center items-center">
          <Typography variant="h1" className={`font-bold  ${isSmall ? 'text-2xl' : 'text-4xl'}  `}>
            Support Center
          </Typography>

          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                enterTouchDelay={0}
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="Pleas fill up the form below and submit to create a Support Ticket so that you can contact with our Customer Care Executive."
              >
                <span className="ml-2" onClick={handleTooltipOpen}>
                  <FaQuestionCircle />
                </span>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </span>
        {reservationId && (
          <span>
            <div
              className={`${
                isMedium ? 'md:grid-cols-2 grid-cols-3 md:gap-8 gap-2' : 'grid-cols-3'
              } grid  bg-white shadow-lg shadow-secondary rounded-lg md:p-4 px-2 w-full justify-between items-center md:my-6 mb-3 mx-auto`}
            >
              <div className="relative  col-span-2 md:col-span-1">
                <span
                  className="z-10 relative inline-block font-bold bg-primary text-white p-2 md:w-3/5 w-full"
                  style={{
                    clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
                    zIndex: 100,
                  }}
                >
                  {updatedTravelData?.isUserGuest ? 'Your Reservation' : `${updatedTravelData?.oppositeUserInfo?.lastName}'s Reservation`}
                </span>
              </div>

              {!iseLessSmall && (
                <div className="col-span-2 flex justify-between items-center">
                  <TravelDurationInfo></TravelDurationInfo>
                </div>
              )}
            </div>
          </span>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`bg-white py-0.5 sm:py-3 mx-auto rounded-xl shadow-xl ${isSmall ? 'md:w-full' : 'w-full'}`}
        >
          <Typography className="w-full sm:w-10/12 px-4 sm:px-0 mx-auto my-4 md:text-sm text-sm font-thin text-gray-400 text-left">
            {/* <TbHelpHexagon className="mr-2 text-base" /> */}
            If you are reporting a issue, please remember to provide as much information that is relevant to the issue as possible
          </Typography>
          {vehicleNickName !== '' && (
            <section className="w-full sm:w-10/12 px-4 sm:px-0 mx-auto my-4">
              <div>
                <TextField
                  className="w-full"
                  name="subject"
                  disabled
                  id="outlined-disabled"
                  label="Vehicle NickName"
                  variant="outlined"
                  value={vehicleNickName}
                  InputLabelProps={{ shrink: !!vehicleNickName }}
                  style={{ marginTop: '10px' }}
                />
              </div>
            </section>
          )}
          <section className="w-full sm:w-10/12  sm:mx-auto flex items-center my-4">
            <div className="w-full px-4 sm:px-0">
              <FormControl fullWidth>
                <Autocomplete
                  {...register('category')}
                  id="searchable-select"
                  options={
                    userRole === 'partner' || userRole === 'host'
                      ? issueType === 'cancelReservation'
                        ? cancelCurrentReservationCategories || []
                        : partnerIssueCategories || []
                      : userRole === 'guest'
                      ? guestIssueCategories || []
                      : generalIssueCategories || []
                  }
                  value={issueCategory || null}
                  onChange={handleIssue}
                  renderInput={(params) => <TextField {...params} label="Issue" required={true} />}
                />
              </FormControl>
            </div>
          </section>

          {richEditorShow ? (
            <section className="w-full sm:w-10/12 px-4 sm:px-0 mx-auto my-4">
              <div>
                <TextField
                  {...register('subject')}
                  className="w-full"
                  name="subject"
                  id="outlined-basic"
                  label="Subject"
                  variant="outlined"
                  required
                />
              </div>

              {issueCategory !== undefined && issueCategory === 'Fuel Gap' && (
                <>
                  <div className="my-4">
                    <TextField
                      {...register('returnedKilometersRange', {
                        required: 'This field is required',
                        pattern: {
                          value: /^\d+$/,
                          message: 'Please enter only numbers',
                        },
                      })}
                      className="w-full"
                      name="returnedKilometersRange"
                      id="outlined-basic"
                      label="Kilometers Range when Returned"
                      variant="outlined"
                      required
                      error={Boolean(errors.returnedKilometersRange)}
                      helperText={errors.returnedKilometersRange?.message}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      {...register('rentedKilometersRange', {
                        required: 'This field is required',
                        pattern: {
                          value: /^\d+$/,
                          message: 'Please enter only numbers',
                        },
                      })}
                      className="w-full"
                      name="rentedKilometersRange"
                      id="outlined-basic"
                      label="Kilometers Range when Rented"
                      variant="outlined"
                      required
                      error={Boolean(errors.rentedKilometersRange)}
                      helperText={errors.rentedKilometersRange?.message}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      }}
                    />
                  </div>
                </>
              )}

              <div className="mt-4">
                <RichEditor control={control} registerName="description" label="Issue details" required={true} errors={errors?.description} />
              </div>

              {issueCategory !== undefined && issueCategory === 'Fuel Gap' ? (
                <div className="mt-1">
                  <SectionHeader title="" subtitle="Please provide photo evidence for Tashus to approve reimbursement" />
                </div>
              ) : (
                <div className="mt-1">
                  <SectionHeader title="" subtitle="Please attach relevant photo related to the issue to assist us in resolving it effectively" />
                </div>
              )}
              <div className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px] m-4`}>
                {isUploadPhotoButtonClicked && <FileUpload2 {...commonProps} />}
              </div>

              <div className="m-2 flex justify-center gap-10">
                {!isUploadPhotoButtonClicked ? (
                  <Button className="px-10" variant="contained" component="span" color="primary" onClick={handleUploadPhotoButtonClick}>
                    {isSmall ? (
                      <>Photo</>
                    ) : (
                      <>
                        <MdCollections className="mr-2" /> Upload Photo
                      </>
                    )}
                  </Button>
                ) : isUploadPhotoButtonClicked && photoUrlList?.length === 0 ? (
                  <Button className="px-10" variant="contained" component="span" color="primary" onClick={handleUploadPhotoButtonClick}>
                    {isSmall ? (
                      <>Photo</>
                    ) : isUploadPhotoButtonClicked ? (
                      <>
                        <AiOutlineCloseSquare className="mr-2 text-lg" /> Close Photo Upload
                      </>
                    ) : (
                      <>
                        <MdCollections className="mr-2" /> Upload Photo
                      </>
                    )}
                  </Button>
                ) : (
                  ''
                )}

                {issueCategory !== undefined && issueCategory === 'Fuel Gap' ? (
                  <Button
                    disabled={isSubmitDisabled || isDisabled || photoUrlList?.length === 0}
                    className="px-10 "
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {isSmall ? (
                      <>Submit</>
                    ) : (
                      <>
                        <IoMdSend className="mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                ) : (
                  <Button disabled={isSubmitDisabled || isDisabled} className="px-10 " type="submit" variant="contained" color="primary">
                    {isSmall ? (
                      <>Submit</>
                    ) : (
                      <>
                        <IoMdSend className="mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </section>
          ) : undefined}
        </form>
        <CommonSnackBar
          open={!!alertMessage}
          message={alertMessage || ''}
          severity={alertMessage === 'Ticket Created Successfully' ? 'success' : 'error'}
          onClose={handleCloseAlert}
        />
      </div>
    </div>
  );
};

export default SupportCenter;
