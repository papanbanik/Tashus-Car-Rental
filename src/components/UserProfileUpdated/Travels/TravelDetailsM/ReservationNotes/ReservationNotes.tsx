'use client';

import CommonTooltip from '@/components/Common/CommonTooltip';
import DisplayRichText from '@/components/Common/DisplayRichText';
import ProfileAvatar from '@/components/Common/ProfileAvatar';
import { useProfileInfoContext } from '@/context/ProfileInfoProvider';
import { useTravelContext } from '@/context/TravelProvider';
import { TReservationNote } from '@/types/travels/typeTravels';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegEdit, FaRegStickyNote } from 'react-icons/fa';
import { MdOutlineNoteAdd } from 'react-icons/md';
import NoteEditor from './NoteEditor';

type RoleFilter = 'all' | 'guest' | 'host' | 'admin';

const NOTES_PER_PAGE = 2;

const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'guest', label: 'Guest' },
  { value: 'host', label: 'Host' },
  { value: 'admin', label: 'Admin' },
];

const ReservationNotes = () => {
  const { travelDetails } = useProfileInfoContext();
  const { updatedTravelData } = useTravelContext();
  const { travelId, reservationId: reservationIdParam } = useParams<{ travelId: string; reservationId: string }>();
  const reservationID = travelId || reservationIdParam;

  const [editingNote, setEditingNote] = useState<{ noteId: string; message: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());

  // Update current time every 30 seconds to refresh the edit window status
  useEffect(() => {
    const timer = setInterval(() => {
      // Must calculate fresh time inside the interval to avoid stale closure
      setCurrentTime(dayjs());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  //Destructor
  const { reservationInfo, tripInformation, guestInfo, partnerInfo } = travelDetails ?? {};
  const { notes = [] } = reservationInfo ?? {};
  const { returnDate } = updatedTravelData ?? {};

  // Ref for the notes container to scroll to top on page change
  const notesTopRef = useRef<HTMLDivElement | null>(null);
  // Ref for the compose/editor section to scroll into view on edit
  const editorRef = useRef<HTMLDivElement | null>(null);

  const allNotes: TReservationNote[] = useMemo(
    () => notes.slice().sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()),
    [notes]
  );

  // Scroll to top of notes when page changes
  useEffect(() => {
    if (currentPage > 1) {
      notesTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const isGuest = updatedTravelData?.isUserGuest;
  const role = isGuest ? 'guest' : 'host';

  // Check if trip ended more than a week ago
  const endDateStr = tripInformation?.endTime ?? returnDate;
  const endDate = dayjs(endDateStr);
  const isAddDisabled = travelDetails && endDate.isValid() && dayjs().diff(endDate, 'day') > 7;

  // Filter notes by active tab
  const filteredNotes = useMemo(
    () => (activeFilter === 'all' ? allNotes : allNotes.filter((n) => n.role === activeFilter)),
    [allNotes, activeFilter]
  );

  // Pagination
  const totalPages = useMemo(() => Math.ceil(filteredNotes.length / NOTES_PER_PAGE), [filteredNotes]);
  const paginatedNotes = useMemo(
    () => filteredNotes.slice((currentPage - 1) * NOTES_PER_PAGE, currentPage * NOTES_PER_PAGE),
    [filteredNotes, currentPage]
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const isEditDisabled = (note: TReservationNote) => {
    if (!note) return true;
    return dayjs().diff(dayjs(note.createdAt), 'minute') > 30;
  };

  useEffect(() => {
    if (editingNote) {
      const noteToEdit = notes.find((n) => n.noteId === editingNote.noteId);
      if (noteToEdit && isEditDisabled(noteToEdit)) {
        setEditingNote(null);
      }
    }
  }, [currentTime, editingNote, notes]);

  const handleEditClick = (note: TReservationNote) => {
    setEditingNote({ noteId: note.noteId, message: note.message });
    // Scroll editor into view
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const getRoleBadgeClass = (noteRole: string) => {
    if (noteRole === 'admin') return 'bg-purple-100 text-purple-700';
    if (noteRole === role) return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  const getEmptyMessage = () => {
    if (activeFilter === 'all') return { title: 'No notes yet', sub: 'Be the first to leave a note for this travel.' };
    if (activeFilter === 'guest') return { title: 'No guest notes yet', sub: 'Guests have not posted any notes for this travel.' };
    if (activeFilter === 'host') return { title: 'No host notes yet', sub: 'The host has not posted any notes yet.' };
    return { title: 'No admin notes yet', sub: 'No admin notes have been added.' };
  };

  const ExpandableText = React.memo(({ text, noteId }: { text: string; noteId: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previewId = `note-preview-${noteId}`;

    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;
      // A small delay lets the browser finish rendering before we measure
      const timer = setTimeout(() => {
        setIsOverflowing(el.scrollHeight > el.clientHeight + 2);
      }, 50);
      return () => clearTimeout(timer);
    }, [text]);

    return (
      <Box className="w-full">
        <Box
          ref={contentRef}
          id={previewId}
          className="relative z-10 pl-6 sm:pl-10 border-l-2 border-primary/20 text-gray-700 leading-relaxed text-sm sm:text-base"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <DisplayRichText content={text} />
        </Box>
        {(isOverflowing || isExpanded) && (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
            aria-controls={previewId}
            className="ml-6 sm:ml-10 mt-1 text-primary lowercase font-bold hover:bg-primary/5 text-xs"
          >
            {isExpanded ? 'See less' : 'See more'}
          </Button>
        )}
      </Box>
    );
  });

  if (!travelDetails) {
    return (
      <Box className="p-6 flex justify-center items-center" role="status" aria-label="Loading reservation notes">
        <CircularProgress aria-hidden="true" />
        <span className="sr-only">Loading reservation notes…</span>
      </Box>
    );
  }

  const emptyMsg = getEmptyMessage();

  return (
    <Box className="p-3 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6" component="section" aria-labelledby="notes-heading">
      {/* Header */}
      <Box className="flex items-center gap-3 mb-6">
        <Box className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
          <FaRegStickyNote className="text-primary text-xl" />
        </Box>
        <Box>
          <Typography variant="h5" id="notes-heading" className="font-bold text-gray-800 text-lg sm:text-2xl">
            Reservation Notes
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Shared notes for this travel
          </Typography>
        </Box>
        {allNotes.length > 0 && (
          <Box
            className="ml-auto bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full"
            aria-label={`${allNotes.length} total notes`}
          >
            {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'}
          </Box>
        )}
      </Box>

      {/* Role Filter Tabs */}
      <Box className="flex gap-2 mb-6 flex-wrap" role="tablist" aria-label="Filter notes by role">
        {ROLE_TABS.map((tab) => {
          const count = tab.value === 'all' ? allNotes.length : allNotes.filter((n) => n.role === tab.value).length;
          const isActive = activeFilter === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              aria-controls="notes-panel"
              id={`tab-${tab.value}`}
              onClick={() => setActiveFilter(tab.value)}
              className={`
                inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                ${isActive ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'}`}
                  aria-label={`${count} ${tab.label.toLowerCase()} notes`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </Box>

      {/* Notes Panel */}
      <div id="notes-panel" role="tabpanel" aria-labelledby={`tab-${activeFilter}`} className="flex-grow">
        <div ref={notesTopRef} className="scroll-mt-24" />
        {filteredNotes.length > 0 ? (
          <>
            <Box className="space-y-4 mb-6" aria-live="polite" aria-atomic="false">
              {paginatedNotes.map((note: TReservationNote) => {
                const isOwn = note.role === role;
                const canEdit = isOwn && !isEditDisabled(note);
                // Use currentTime to stay in sync with the auto-expire logic
                const minutesDiff = dayjs().diff(dayjs(note.createdAt), 'minute');
                const minutesLeft = isOwn ? Math.max(0, Math.min(30, 30 - minutesDiff)) : 0;

                return (
                  <Box
                    key={note.noteId}
                    className="relative group"
                    aria-label={`Note by ${note.name} (${note.role}), posted ${dayjs(note.createdAt).format('MMM D, YYYY h:mm A')}`}
                  >
                    <Box className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 relative overflow-hidden">
                      {/* Decorative blob */}
                      <Box className="absolute top-0 right-0 p-8 bg-primary/5 rounded-full -mr-4 -mt-4" aria-hidden="true" />

                      {/* Note header */}
                      <Box className="flex flex-col xs:flex-row flex-wrap justify-between items-start xs:items-center mb-3 gap-2 relative z-10">
                        <Box className="flex items-center gap-2">
                          <ProfileAvatar
                            profilePictureUrl={
                              note.role === 'guest' ? guestInfo?.profilePhoto : note.role === 'host' ? partnerInfo?.profilePhoto : undefined
                            }
                            firstName={
                              note.role === 'guest'
                                ? guestInfo?.firstName
                                : note.role === 'host'
                                ? partnerInfo?.firstName
                                : note.name?.split(' ')?.[0]
                            }
                            lastName={
                              note.role === 'guest' ? guestInfo?.lastName : note.role === 'host' ? partnerInfo?.lastName : note.name?.split(' ')?.[1]
                            }
                            sx={{ width: 32, height: 32, fontSize: 12, border: 'none', bgcolor: 'primary.main' }}
                            className="shrink-0"
                          />
                          <Typography variant="subtitle1" className="font-bold text-gray-800">
                            {note.name}
                          </Typography>
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${getRoleBadgeClass(note.role)}`}
                            aria-label={`Role: ${note.role}${note.role === role ? ', you' : ''}`}
                          >
                            {note.role}
                            {note.role === role ? ' (You)' : ''}
                          </span>
                        </Box>
                        <Typography
                          variant="caption"
                          className="bg-white/80 px-3 py-1 rounded-full text-gray-500 font-medium shadow-sm"
                          aria-label={`Posted on ${dayjs(note.createdAt).format('MMMM D, YYYY at h:mm A')}`}
                        >
                          {dayjs(note.createdAt).format('MMM D, YYYY • h:mm A')}
                        </Typography>
                      </Box>

                      <ExpandableText text={note.message} noteId={note.noteId} />

                      {/* Edit button */}
                      {isOwn && (
                        <Box className="mt-4 flex justify-end items-center gap-2 relative z-10">
                          <Typography variant="caption" className={`font-medium text-xs ${!canEdit ? 'text-gray-400' : 'text-amber-600'}`}>
                            {!canEdit ? 'Time expired' : `${minutesLeft}m left to edit`}
                          </Typography>
                          <CommonTooltip title={!canEdit ? 'Time expired (30 mins limit)' : `Edit within 30 minutes`} placement="top" arrow>
                            <span>
                              <Button
                                variant="outlined"
                                size="small"
                                disabled={!canEdit}
                                startIcon={<FaRegEdit aria-hidden="true" />}
                                onClick={() => handleEditClick(note)}
                                aria-label={!canEdit ? 'Edit disabled - time expired' : `Edit your note — ${minutesLeft} minutes remaining`}
                                className={`capitalize rounded-lg font-semibold ${
                                  !canEdit ? 'border-gray-200 text-gray-400' : 'border-primary/30 text-primary hover:bg-primary/5'
                                }`}
                              >
                                Edit
                              </Button>
                            </span>
                          </CommonTooltip>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                className="flex items-center justify-between mt-8 mb-8 px-1 py-4 border-t border-gray-100"
                role="navigation"
                aria-label="Notes pagination"
              >
                <Button
                  size="small"
                  variant="text"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  startIcon={<FaChevronLeft aria-hidden="true" />}
                  aria-label="Previous page of notes"
                  className="text-gray-600 hover:bg-gray-100 rounded-xl px-4 py-2 disabled:opacity-30 font-bold transition-all lowercase first-letter:uppercase"
                >
                  <span className="hidden sm:inline">Prev</span>
                </Button>

                <Box className="flex items-center gap-1.5" aria-live="polite" aria-atomic="true">
                  {(() => {
                    const pages = [];
                    const delta = 1; // Number of pages to show around current page

                    for (let i = 1; i <= totalPages; i++) {
                      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                        pages.push(i);
                      } else if (pages[pages.length - 1] !== '...') {
                        pages.push('...');
                      }
                    }

                    return pages.map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-bold">
                          &hellip;
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          aria-current={currentPage === page ? 'page' : undefined}
                          aria-label={`Page ${page}`}
                          className={`
                            min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                            ${
                              currentPage === page
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                            }
                          `}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}
                </Box>

                <Button
                  size="small"
                  variant="text"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  endIcon={<FaChevronRight aria-hidden="true" />}
                  aria-label="Next page of notes"
                  className="text-gray-600 hover:bg-gray-100 rounded-xl px-4 py-2 disabled:opacity-30 font-bold transition-all lowercase first-letter:uppercase"
                >
                  <span className="hidden sm:inline">Next</span>
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box
            className="mb-8 p-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <MdOutlineNoteAdd className="text-gray-300 text-5xl mb-4" aria-hidden="true" />
            <Typography variant="h6" className="text-gray-400 font-medium">
              {emptyMsg.title}
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              {emptyMsg.sub}
            </Typography>
          </Box>
        )}
      </div>

      {/* Compose / Edit Editor */}
      <NoteEditor
        reservationID={reservationID}
        role={role}
        editingNote={editingNote}
        onSuccess={() => setEditingNote(null)}
        onCancel={handleCancelEdit}
        isGuest={!!isGuest}
        isAddDisabled={isAddDisabled}
        editorRef={editorRef}
      />

      {isAddDisabled && !editingNote && (
        <Box className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3" role="status" aria-live="polite">
          <Box className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shrink-0" aria-hidden="true" />
          <Typography variant="body2" className="text-orange-700 font-medium">
            Note submission is closed. You can only add notes within 7 days after the travel ends.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReservationNotes;
