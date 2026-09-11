'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import RichEditor from '@/components/Common/HookFormFields/RichEditor';
import { useSaveReservationNote } from '@/hooks/reservation/reservation-notes/useSaveReservationNote';
import dayjs from 'dayjs';

const stripHtmlTags = (htmlString: string) => {
  if (typeof window === 'undefined') return '';
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;
  return tempElement.textContent || tempElement.innerText || '';
};

interface NoteEditorProps {
  reservationID: string;
  role: 'guest' | 'host';
  editingNote: { noteId: string; message: string } | null;
  onSuccess: () => void;
  onCancel: () => void;
  isGuest: boolean;
  isAddDisabled: boolean;
  editorRef: React.RefObject<HTMLDivElement>;
}

const NoteEditor = ({
  reservationID,
  role,
  editingNote,
  onSuccess,
  onCancel,
  isGuest,
  isAddDisabled,
  editorRef,
}: NoteEditorProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ message: string }>({
    defaultValues: { message: '' },
  });

  const { mutate: saveNote, isLoading: isSubmitting } = useSaveReservationNote();

  // Sync editing note to form
  useEffect(() => {
    if (editingNote) {
      setValue('message', editingNote.message);
    } else {
      reset({ message: '' });
    }
  }, [editingNote, setValue, reset]);

  const noteMessage = useWatch({
    control,
    name: 'message',
    defaultValue: '',
  });

  const plainText = stripHtmlTags(noteMessage);
  const isOverLimit = plainText.length > 3000;
  const isEmpty = !plainText.trim();

  const handleSave = handleSubmit((data) => {
    const { message } = data;
    if (!stripHtmlTags(message).trim()) return;
    const currentDateTime = dayjs().toISOString();
    saveNote(
      {
        reservationId: reservationID,
        message,
        role,
        noteId: editingNote?.noteId || null,
        currentDateTime,
      },
      {
        onSuccess: () => {
          reset({ message: '' });
          onSuccess();
        },
      }
    );
  });

  if (isAddDisabled && !editingNote) return null;

  return (
    <Box
      ref={editorRef}
      className="space-y-4 bg-gray-50/80 p-3 sm:p-6 rounded-2xl scroll-mt-24"
      component="section"
      aria-label={editingNote ? 'Edit note' : 'Add a new note'}
    >
      <Box className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Typography variant="subtitle2" className="font-bold text-gray-700 text-sm sm:text-base" id="compose-label">
          {editingNote ? 'Update Note' : 'Add a Note'}
        </Typography>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold text-xs shrink-0">
          {isGuest ? 'Guest' : 'Host'}
        </span>
        {editingNote && (
          <span className="w-full sm:w-auto sm:ml-auto text-xs text-amber-600 font-medium" aria-live="polite">
            Editing a previous note
          </span>
        )}
      </Box>

      <Box>
        <RichEditor
          control={control}
          registerName="message"
          label="Type your message here…"
          required={true}
          errors={errors.message}
          disabled={isSubmitting}
        />
        <div className="flex justify-end px-1 mt-1">
          <Typography
            id="compose-hint"
            variant="caption"
            className={`font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}
          >
            {plainText.length} / 3,000
          </Typography>
        </div>
        <Typography variant="caption" className="text-gray-500 mt-2 block ml-1 font-medium">
          {isGuest
            ? 'Please note that the host and Tashus Admin can see your notes.'
            : 'Please note that the guest and Tashus Admin can see your notes.'}
        </Typography>
      </Box>

      <Box className="flex gap-3 flex-wrap">
        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          disabled={isSubmitting || isEmpty || isOverLimit}
          aria-busy={isSubmitting}
          className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:bg-gray-300"
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" aria-hidden="true" className="mr-2" />
              <span className="sr-only">Saving…</span>
              Saving…
            </>
          ) : editingNote ? (
            'Update Note'
          ) : (
            'Post Note'
          )}
        </Button>
        {editingNote && (
          <Button
            variant="text"
            onClick={onCancel}
            aria-label="Cancel editing"
            className="text-gray-500 font-bold hover:bg-gray-200/50 rounded-xl px-6"
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NoteEditor;
