'use client';
import FileUpload2 from '@/components/CarListing/CarPhotos/FileUpload';
import { deleteFromCloudinary, saveChatImageListToCloudinary } from '@/components/CarListing/CarPhotos/photosCommonFn';
import SectionHeader from '@/components/CarListing/SectionHeader';
import CommonForm from '@/components/Common/CommonForm';
import CommonTooltip from '@/components/Common/CommonTooltip';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { useGetAllCommentsOfATicketContext } from '@/context/AllCommentsOfATicketProvider';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useUserCredContext } from '@/context/UserCredProvider';
import { useReservationFind } from '@/hooks/support-center/support-ticket/support-reservation/useReservationFind';
import { useSupportTicket } from '@/hooks/support-center/support-ticket/support-reservation/useSupportTicket';
import {
  SupportTicketInputs,
  cancelCurrentReservationCategories,
  generalIssueCategories,
  guestIssueCategories,
  ownerIssueCategories,
  partnerIssueCategories,
} from '@/types/support-center/support-ticket';
import { formatCategory } from '@/utils/Functions/randomCommonFn';
import { Autocomplete, Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { FaQuestionCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { MdCollections } from 'react-icons/md';
import SupportFuelGap from './SupportCategory/SupportFuelGap';
import SupportReservationBanner from './SupportCategory/SupportReservationBanner';

const SupportCenterUpdated = () => {
  useReservationFind();
  const { mutateAsync: addSupportTicket, isLoading, isSuccess } = useSupportTicket();
  const params = useParams<{ reservationId: string }>();
  const reservationId = parseInt(params?.reservationId);
  const searchParams = useSearchParams();
  const { userCred, userProfileInfo } = useUserCredContext();
  const { supportVehicleID: carListingId, supportTicketID, setSupportVehicleID } = useProfileInfoContext();
  const [userRole, setUserRole] = useState<any>();
  const [issueCategory, setIssueCategory] = useState<string | null>();
  const [issueType, setIssueType] = useState<string>('general');
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [isUploadPhotoButtonClicked, setIsUploadPhotoButtonClicked] = useState<boolean>(false);
  const [photoUrlList, setPhotoUrlList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [deleteFileList, setDeleteFileList] = useState<File[]>([]);
  const { setVehicleUnlisted } = useGetAllCommentsOfATicketContext();
  const [issueTitle, setIssueTitle] = useState<string | null>();
  const [vehicleNickName, setVehicleNickName] = useState<string | null>('');
  useEffect(() => {
    if (!reservationId) {
      setSupportVehicleID(undefined);
    }
  }, [reservationId]);
  const { control, register, watch, getValues, handleSubmit, formState, reset, setValue, trigger } = useForm<SupportTicketInputs>({
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

  const { errors, isDirty, isValid } = formState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleIssue = (event: React.SyntheticEvent, newValue: string | null) => {
    setIssueCategory(newValue);
    setValue('category', newValue);
  };

  const commonProps = {
    register,
    handleSubmit,
    control,
    formState,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
  };

  const commonUrlProps = {
    control,
    photoUrlList,
    fileList,
    setFileList,
    setPhotoUrlList,
    registerName: 'chatPhotosUrl',
    limit: issueCategory === 'Vehicle Damage' || issueCategory === 'Other' ? 20 : 10,
    multiple: true,
    setValue,
    trigger,
    deleteFileList,
    setDeleteFileList,
  };

  //   Set the role and issueType
  useEffect(() => {
    if (searchParams) {
      setUserRole(searchParams.get('role'));
      const issueType = searchParams.get('from');
      setIssueType(String(issueType));
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('status')) {
      const unlistedValue = urlParams.get('status');
      setIssueTitle(unlistedValue);
      setIssueType('general');
      const vehicleNickName = urlParams.get('carNickName');
      setVehicleNickName(vehicleNickName);
    }
  }, [searchParams, params]);

  //Set Issue Category
  useEffect(() => {
    if (!!issueTitle && issueTitle === 'listed') {
      setIssueCategory('Vehicle Listing');
    } else if (!!issueTitle && issueTitle === 'unlisted') {
      setIssueCategory('Vehicle Unlisting');
      setVehicleUnlisted(false);
    } else {
      setIssueCategory(issueCategory);
    }
  }, [issueTitle]);

  const subject = watch('subject');
  const description = watch('description');

  // Disable the submit button if any required field is empty
  const isSubmitDisabled = !subject || !description || !isValid || !isDirty;

  const onSupportTicketSubmit: SubmitHandler<SupportTicketInputs> = async (data) => {
    // console.log(data);
    const category = issueCategory ? issueCategory : data?.category;
    if (!issueType || !data?.subject || !data?.description || !category) {
      return;
    }
    setIsSubmitting(true);
    let attachments = [];
    if (data.chatPhotosUrl && userCred?.userId) {
      const { imageUrlList, uploadedUrls } = await saveChatImageListToCloudinary(data.chatPhotosUrl, userCred?.userId);
      await deleteFileList?.map((file: any) => deleteFromCloudinary(file.publicId));
      attachments = imageUrlList;
      setPhotoUrlList(uploadedUrls);
    }
    try {
      const issueType2 = issueType === undefined || issueType === 'null' || issueType === null ? 'general' : issueType;

      const ticket = {
        issueType: issueType2,
        ...(carListingId === undefined ? {} : { carListingId }),
        // ...(reservationId === undefined ? {} : { reservationId }),
        ...(reservationId === undefined || Number.isNaN(reservationId) ? {} : { reservationId }),
        subject: data?.subject,
        ...(issueCategory !== undefined && (issueCategory === 'Vehicle Listing' || issueCategory === 'Vehicle Unlisting')
          ? { vehicleNickName: !!vehicleNickName && vehicleNickName !== '' ? vehicleNickName : undefined }
          : {}),
        ...(issueCategory !== undefined && issueCategory === 'Fuel Gap'
          ? {
              returnedKilometersRange: data?.returnedKilometersRange,
              rentedKilometersRange: data?.rentedKilometersRange,
            }
          : {}),
        description: data?.description?.replace(/(&nbsp;|&#160;|\u00A0)/g, ' '),
        status: 'open',
        issueBy: userCred?.userId,
        category: formatCategory(category),
        attachments: attachments,
      };
      console.log();

      const response = await addSupportTicket({
        reservationId: reservationId,
        ticket: ticket,
      });

      router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/support/support-ticket/${response?.data?.supportTicketId}`);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSubmitting(false); // Re-enable button after completion
    }
  };

  return (
    <div className="w-full mx-auto ">
      <div className="h-full ">
        {/* Image Part */}
        <Box className="grid place-items-center mb-5 lg:mb-4">
          <Image
            src="/Images/Tashus_support-02-01.svg"
            alt="Banner Image"
            width={500}
            height={500}
            style={{ maxWidth: '650px', maxHeight: '205px', width: '100%', height: '100%' }}
          />
        </Box>
        {/* Heading Part */}
        <span className="text-center flex mb-4 lg:mb-4 justify-center items-center">
          <Typography variant="h1" className={`font-bold  ${isSmall ? 'text-2xl' : 'text-4xl'}  `}>
            Support Center
          </Typography>
          <CommonTooltip
            title={'Pleas fill up the form below and submit to create a Support Ticket so that you can contact with our Customer Care Executive.'}
            arrow={true}
            placement="bottom"
          >
            <IconButton className="bg-transparent">
              <FaQuestionCircle />
            </IconButton>
          </CommonTooltip>
        </span>
        {/* Reservation Banner Show Part */}
        {reservationId ? <SupportReservationBanner /> : ''}
        <div className={`bg-white py-0.5 sm:py-3 mx-auto rounded-xl shadow-xl ${isSmall ? 'md:w-full' : 'w-full'}`}>
          <CommonForm handleFunction={handleSubmit(onSupportTicketSubmit)}>
            <Typography className="w-full sm:w-10/12 px-4 sm:px-0 mx-auto my-4 helping_text">
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
                        : userProfileInfo?.isAllowListing
                        ? ownerIssueCategories || []
                        : generalIssueCategories || []
                    }
                    value={issueCategory || null}
                    onChange={handleIssue}
                    renderInput={(params) => <TextField {...params} label="Issue" required={true} />}
                  />
                </FormControl>
              </div>
            </section>
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
              {/* Fuel Gap Category */}
              {issueCategory !== undefined && issueCategory === 'Fuel Gap' && (
                <>
                  <SupportFuelGap {...commonProps} />
                </>
              )}
              <div className="mt-4">
                <RichEditor control={control} registerName="description" label="Issue details" required={true} errors={errors?.description} />
              </div>
              {/* Photo Attach Part */}
              <div className="mt-1">
                <SectionHeader
                  title=""
                  subtitle={
                    issueCategory !== undefined && issueCategory === 'Fuel Gap'
                      ? 'Please provide photo evidence for Tashus to approve reimbursement'
                      : 'Please attach relevant photo related to the issue to assist us in resolving it effectively'
                  }
                />
              </div>
              <div className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 max-h-[4000px] m-4`}>
                {isUploadPhotoButtonClicked && <FileUpload2 {...commonUrlProps} />}
              </div>
              {/* Button Part */}
              <div className="m-2 flex justify-center gap-10">
                <Button
                  className="px-10"
                  variant="contained"
                  startIcon={
                    isSmall ? (
                      ''
                    ) : isUploadPhotoButtonClicked && photoUrlList?.length === 0 ? (
                      <AiOutlineCloseSquare className="mr-2 text-lg" />
                    ) : (
                      <MdCollections className="mr-2" />
                    )
                  }
                  component="span"
                  color="primary"
                  onClick={() => setIsUploadPhotoButtonClicked(!isUploadPhotoButtonClicked)}
                >
                  {isSmall ? 'Photo' : isUploadPhotoButtonClicked && photoUrlList?.length === 0 ? 'Close Photo Upload' : 'Upload Photo'}
                </Button>
                <Button
                  disabled={
                    isSubmitting ||
                    isSubmitDisabled ||
                    !issueCategory ||
                    !isValid ||
                    !isDirty ||
                    (issueCategory === 'Fuel Gap' && photoUrlList?.length === 0) ||
                    isLoading ||
                    isSuccess
                  }
                  className="px-10"
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isSmall ? '' : <IoMdSend className="mr-2" />}
                >
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            </section>
          </CommonForm>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterUpdated;
