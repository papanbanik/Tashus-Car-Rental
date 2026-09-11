'use client';

import React, { useState, useCallback } from 'react';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { GrNext, GrPowerReset, GrPrevious } from 'react-icons/gr';
import Modal from 'react-modal';
import './ZoomInOut.css';
import CustomToolTip from './CustomToolTip';

interface UpdatedCommonZoomInOutModalProps {
  open: boolean;
  handleClose: () => void;
  modalImageSrc: string;
  imageList?: string[];
  currentIndex?: number;
  setCurrentIndex?: (index: number | ((prevIndex: number) => number)) => void;
}

const UpdatedCommonImgZoomInOutModal: React.FC<UpdatedCommonZoomInOutModalProps> = ({
  open,
  handleClose,
  modalImageSrc,
  imageList = [],
  currentIndex = 0,
  setCurrentIndex,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAtDefaultZoom, setIsAtDefaultZoom] = useState<boolean>(true);
  const [isMaxZoomReached, setIsMaxZoomReached] = useState<boolean>(false);
  const [transformWrapperKey, setTransformWrapperKey] = useState(Date.now());
  const [rotation, setRotation] = useState(0);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const nextImage = useCallback(() => {
    if (setCurrentIndex) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === imageList.length - 1 ? 0 : prevIndex + 1;
        setTransformWrapperKey(Date.now());
        setZoomLevel(1);
        setIsAtDefaultZoom(true);
        setIsMaxZoomReached(false);
        setRotation(0);
        return newIndex;
      });
    }
  }, [setCurrentIndex, imageList.length]);

  const prevImage = useCallback(() => {
    if (setCurrentIndex) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? imageList.length - 1 : prevIndex - 1;
        setTransformWrapperKey(Date.now());
        setZoomLevel(1);
        setIsAtDefaultZoom(true);
        setIsMaxZoomReached(false);
        setRotation(0);
        return newIndex;
      });
    }
  }, [setCurrentIndex, imageList.length]);

  const style = {
    content: {
      backgroundColor: 'transparent',
      border: 'none',
      inset: '0px',
      padding: '0',
      zIndex: 9999,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, .88)',
      zIndex: 9999,
    },
  };

  const handleZoomChange = (newZoomLevel: number) => {
    setZoomLevel(newZoomLevel);
    setIsAtDefaultZoom(newZoomLevel === 1);
    setIsMaxZoomReached(newZoomLevel >= 5);
  };

  const handleRotateClockwise = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prevRotation) => prevRotation - 90);
  };

  return (
    <Modal isOpen={open} onRequestClose={handleClose} style={style}>
      <div className="flex justify-between items-center absolute top-0 left-0 w-full p-4">
        <div className="text-white font-bold">{imageList?.length > 0 && `${currentIndex + 1} / ${imageList?.length}`}</div>
        <div
          onClick={() => {
            handleClose();
            setZoomLevel(1);
            setIsAtDefaultZoom(true);
            setIsMaxZoomReached(false);
            setRotation(0);
            setTransformWrapperKey(Date.now());
          }}
          className="w-[70px] p-2 rounded-lg relative cursor-pointer"
          aria-label="Close modal"
        >
          <Image width={50} height={50} src="/icons/system-solid-29-cross.gif" alt="Close" />
        </div>
      </div>
      <div className="flex justify-between items-center h-full max-w-[1200px] mx-auto">
        {imageList?.length > 1 && (
          <button onClick={prevImage} aria-label="Previous image" className="text-white mr-4 bg-transparent cursor-pointer p-0">
            <GrPrevious size={25} style={{ color: '#d308d3' }} />
          </button>
        )}
        <div className={`max-w-full mx-auto overflow-hidden relative ${isSmall ? 'w-[400px] h-[300px]' : 'w-[800px] h-[600px]'}`}>
          <TransformWrapper
            key={transformWrapperKey}
            initialScale={1}
            minScale={1}
            maxScale={5}
            onZoomStop={({ state: { scale } }: { state: { scale: number } }) => handleZoomChange(scale)}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent>
                  <Image
                    src={modalImageSrc}
                    alt={`Image ${currentIndex + 1}`}
                    width={isSmall ? '400' : '800'}
                    height={isSmall ? '300' : '600'}
                    className={`rounded-lg object-contain transition-transform duration-300 ease-in-out ${
                      isSmall ? 'max-h-[300px]' : 'max-h-[700px]'
                    }`}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                </TransformComponent>
                <div className="text-center mt-1 ml-1 absolute bottom-[10px] flex flex-col">
                  <CustomToolTip title="Zoom in" arrow={true} placement="right">
                    <Button
                      onClick={() => {
                        zoomIn();
                        handleZoomChange(zoomLevel + 0.5);
                      }}
                      variant="contained"
                      color="primary"
                      disabled={isMaxZoomReached}
                      className={`w-9 min-w-[20px] p-0 ${isMaxZoomReached ? 'bg-gray-500' : ''}`}
                    >
                      +
                    </Button>
                  </CustomToolTip>
                  <CustomToolTip title="Zoom out" arrow={true} placement="right">
                    <Button
                      onClick={() => {
                        zoomOut();
                        handleZoomChange(zoomLevel - 0.5);
                      }}
                      variant="contained"
                      color="primary"
                      disabled={isAtDefaultZoom || zoomLevel <= 1}
                      className={`w-9 min-w-[20px] my-1 p-0 ${isAtDefaultZoom || zoomLevel <= 1 ? 'bg-gray-500' : ''}`}
                    >
                      -
                    </Button>
                  </CustomToolTip>
                  <CustomToolTip title="Reset zoom" arrow={true} placement="right">
                    <Button
                      onClick={() => {
                        resetTransform();
                        handleZoomChange(1);
                        setRotation(0);
                      }}
                      variant="contained"
                      color="primary"
                      disabled={isAtDefaultZoom}
                      className={`w-9 min-w-[20px] p-1 ${isAtDefaultZoom ? 'bg-gray-500' : ''}`}
                    >
                      <GrPowerReset size={13} />
                    </Button>
                  </CustomToolTip>
                  <CustomToolTip title="Clockwise rotation" arrow={true} placement="right">
                    <Button onClick={handleRotateClockwise} variant="contained" color="primary" className="w-9 min-w-[20px] mt-1 p-0">
                      ↻
                    </Button>
                  </CustomToolTip>

                  <CustomToolTip title="Anti-clockwise rotation" arrow={true} placement="right">
                    <Button onClick={handleRotateCounterClockwise} variant="contained" color="primary" className="w-9 min-w-[20px] mt-1 p-0">
                      ↺
                    </Button>
                  </CustomToolTip>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
        {imageList?.length > 1 && (
          <button onClick={nextImage} aria-label="Next image" className="text-white ml-4 bg-transparent p-0 cursor-pointer">
            <GrNext size={25} style={{ color: '#d308d3' }} />
          </button>
        )}
      </div>
    </Modal>
  );
};

export default UpdatedCommonImgZoomInOutModal;
