'use client';
import { useEffect, useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus, FaRedo, FaSyncAlt, FaUndoAlt } from 'react-icons/fa';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

interface CommonZoomModalProps {
  open: boolean;
  onClose: () => void;
  images: string[]; // ekta hole [singleSrc] pathao
  currentIndex?: number; // default 0, single image hole lagbe na
  onNext?: () => void; // dile prev/next arrow show hobe
  onPrev?: () => void;
}

const CommonZoomModal = ({ open, onClose, images, currentIndex = 0, onNext, onPrev }: CommonZoomModalProps) => {
  const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const imageContainerRef = useCallback((node: HTMLDivElement | null) => setContainerNode(node), []);

  const clampPosition = useCallback(
    (x: number, y: number, zoom: number) => {
      if (!containerNode) return { x, y };
      const { width, height } = containerNode.getBoundingClientRect();
      const maxOffsetX = (width * (zoom - 1)) / 2;
      const maxOffsetY = (height * (zoom - 1)) / 2;
      return {
        x: Math.min(Math.max(x, -maxOffsetX), maxOffsetX),
        y: Math.min(Math.max(y, -maxOffsetY), maxOffsetY),
      };
    },
    [containerNode]
  );

  const resetZoom = useCallback(() => {
    setZoomLevel(MIN_ZOOM);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setIsDragging(false);
  }, []);

  // image change hole (next/prev) ba modal open hole zoom reset
  useEffect(() => {
    if (open) resetZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentIndex]);

  const zoomIn = () => {
    setZoomLevel((prev) => {
      const capped = Math.min(prev + ZOOM_STEP, MAX_ZOOM);
      setPosition((p) => clampPosition(p.x, p.y, capped));
      return capped;
    });
  };

  const zoomOut = () => {
    setZoomLevel((prev) => {
      const capped = Math.max(prev - ZOOM_STEP, MIN_ZOOM);
      setPosition((p) => clampPosition(p.x, p.y, capped));
      return capped;
    });
  };

  const rotateLeft = () => setRotation((prev) => prev - 90);
  const rotateRight = () => setRotation((prev) => prev + 90);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel <= MIN_ZOOM) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // drag-to-pan
  useEffect(() => {
    if (!isDragging) return;
    const handleWindowMouseMove = (e: MouseEvent) => {
      setPosition(clampPosition(e.clientX - dragStart.x, e.clientY - dragStart.y, zoomLevel));
    };
    const handleWindowMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, dragStart, zoomLevel, clampPosition]);

  // mouse-wheel zoom, cursor-centered
  useEffect(() => {
    if (!containerNode || !open) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = containerNode.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;

      setZoomLevel((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom + delta, MIN_ZOOM), MAX_ZOOM);
        setPosition((prevPos) => {
          const px = (mx - prevPos.x) / prevZoom;
          const py = (my - prevPos.y) / prevZoom;
          return clampPosition(mx - newZoom * px, my - newZoom * py, newZoom);
        });
        return newZoom;
      });
    };

    containerNode.addEventListener('wheel', onWheel, { passive: false });
    return () => containerNode.removeEventListener('wheel', onWheel);
  }, [containerNode, open, clampPosition]);

  const handleClose = () => {
    onClose();
    resetZoom();
  };

  const showNav = images?.length > 1 && onNext && onPrev;
  const currentSrc = images?.[currentIndex] ?? '';

  return (
    <Dialog open={open} maxWidth={'md'}>
      <DialogContent className="max-h-screen w-full overflow-y-hidden">
        <div className="flex justify-between items-center absolute top-0 left-0 w-full p-4 z-10">
          {images?.length > 1 && (
            <div className="font-bold">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          <IconButton onClick={handleClose} className="text-error ml-auto">
            <AiOutlineClose size={22} />
          </IconButton>
        </div>

        <div className="flex justify-between items-center h-full mx-auto">
          {showNav && (
            <IconButton
              onClick={onPrev}
              className="hover:text-white hover:bg-slate-400 text-gray-400 text-xl md:text-2xl flex items-center justify-center"
            >
              <FaChevronLeft size={26} />
            </IconButton>
          )}

          <div
            ref={imageContainerRef}
            className="max-w-full md:w-[800px] w-[400px] h-[300px] md:h-[600px] mx-auto overflow-hidden relative flex justify-center items-center"
          >
            <div
              className={`relative w-full h-full flex justify-center items-center ${
                zoomLevel > MIN_ZOOM ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
              } ${isDragging ? '' : 'transition-transform duration-200 ease-out'}`}
              onMouseDown={handleMouseDown}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
              }}
            >
              <Image
                objectFit="contain"
                fill
                src={currentSrc}
                alt="zoomable image"
                className="w-full h-full rounded-sm pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </div>

          {showNav && (
            <IconButton
              onClick={onNext}
              className="hover:text-white hover:bg-slate-400 text-gray-400 text-xl md:text-2xl flex items-center justify-center"
            >
              <FaChevronRight size={26} />
            </IconButton>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full hidden md:flex  justify-center items-center gap-0 py-3">
          <Button
            variant="text"
            onClick={zoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            className="flex flex-col items-center text-white bg-transparent border-none h-auto disabled:opacity-40"
          >
            <FaSearchMinus size={18} />
            <span className="text-xs pt-1">Zoom Out</span>
          </Button>

          <Button
            variant="text"
            onClick={zoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            className="flex flex-col items-center text-white bg-transparent border-none h-auto disabled:opacity-40"
          >
            <FaSearchPlus size={18} />
            <span className="text-xs pt-1">Zoom In</span>
          </Button>

          <Button variant="text" onClick={rotateLeft} className="flex flex-col items-center text-white bg-transparent border-none h-auto">
            <FaUndoAlt size={18} />
            <span className="text-xs pt-1">Rotate Left</span>
          </Button>

          <Button variant="text" onClick={rotateRight} className="flex flex-col items-center text-white bg-transparent border-none h-auto">
            <FaSyncAlt size={18} />
            <span className="text-xs pt-1">Rotate Right</span>
          </Button>

          <Button
            variant="text"
            onClick={resetZoom}
            disabled={zoomLevel === MIN_ZOOM && rotation === 0}
            className="flex flex-col items-center text-white bg-transparent border-none h-auto disabled:opacity-40"
          >
            <FaRedo size={18} />
            <span className="text-xs pt-1">Reset</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommonZoomModal;
