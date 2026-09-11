import CommonTextIcon from '@/components/Common/CommonTextIcon';
import { Autocomplete, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { BiTrip } from 'react-icons/bi';
import { CgPlayList, CgPlayListCheck, CgPlayListRemove } from 'react-icons/cg';
import { FaList } from 'react-icons/fa';
import { IoGrid } from 'react-icons/io5';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from 'react-icons/tb';

interface VehicleSortFilterProps {
  sortCriteria: string;
  listingStatus: string | null;
  isSmallScreen: boolean;
  showGrid: boolean;
  handleToggleLayout: () => void;
  itemsFound: number;
  handleSortCriteriaChange: (event: SelectChangeEvent) => void;
  handleListingStatusChange: (event: SelectChangeEvent) => void;
  listingSelect: string | null;
  listingInputValue: string | null;
  vehicleListingID: string[];
  handleListingInputChange: (event: React.ChangeEvent<{}>, value: string) => void;
  setListingSelect: (value: string) => void;
}

const VehicleSortFilter = ({
  sortCriteria,
  listingStatus,
  isSmallScreen,
  showGrid,
  handleToggleLayout,
  itemsFound,
  handleSortCriteriaChange,
  handleListingStatusChange,
  listingSelect,
  listingInputValue,
  vehicleListingID,
  handleListingInputChange,
  setListingSelect,
}: VehicleSortFilterProps) => {
  return (
    <div className="flex flex-row justify-between ">
      <div className="flex justify-start items-end">
        {/* Grid and List */}
        {!isSmallScreen && (
          <div className="flex items-center justify-end">
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
              <Button onClick={handleToggleLayout} className={`${showGrid ? 'bg-green-100' : 'bg-neutral'}`}>
                <IoGrid className={`${showGrid ? 'text-success' : 'text-primary'} text-md `} />
              </Button>
              <Button onClick={handleToggleLayout} className={`${!showGrid ? 'bg-green-100' : 'bg-neutral'}`}>
                <FaList className={`${!showGrid ? 'text-success' : 'text-primary'} text-md `} />
              </Button>
            </ButtonGroup>
          </div>
        )}
        {itemsFound ? (
          <span className="text-primary font-bold lg:ml-2">{`${itemsFound ?? 0} ${itemsFound > 1 ? 'Vehicles' : 'Vehicle'} Found`}</span>
        ) : (
          <span className="text-error font-bold lg:ml-2">{`No Vehicle Found`}</span>
        )}
      </div>
      <div className=" flex justify-start md:justify-end">
        {/* Sort By */}
        <FormControl variant="standard" sx={{ minWidth: 120 }} className="md:mr-2">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select className="text-sm md:text-md" labelId="sort-label" label="Sort By" value={sortCriteria} onChange={handleSortCriteriaChange}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="ascListingId">
              <CommonTextIcon text="Listing ID (Asc)" startIcon={<RiSortAsc className="text-primary text-md mr-2" />} />
            </MenuItem>
            <MenuItem value="descListingId">
              <CommonTextIcon text="Listing ID (Desc)" startIcon={<RiSortDesc className="text-primary text-md mr-2" />} />
            </MenuItem>
            <MenuItem value="ascTrip">
              <CommonTextIcon text="Trip (Asc)" startIcon={<BiTrip className="text-primary text-md mr-2" />} />
            </MenuItem>
            <MenuItem value="descTrip">
              <CommonTextIcon text="Trip (Desc)" startIcon={<BiTrip className="text-primary text-md mr-2" />} />
            </MenuItem>
            <MenuItem value="ascReview">
              <CommonTextIcon text="Rating (Asc)" startIcon={<TbSortAscendingNumbers className="text-primary text-md mr-2" />} />
            </MenuItem>
            <MenuItem value="descReview">
              <CommonTextIcon text="Rating (Desc)" startIcon={<TbSortDescendingNumbers className="text-primary text-md mr-2" />} />
            </MenuItem>
          </Select>
        </FormControl>
        {!isSmallScreen && (
          <>
            {/* Listing Status */}
            <FormControl variant="standard" sx={{ minWidth: 120 }} className="md:ml-2">
              <InputLabel id="listing-status-label">Status</InputLabel>
              <Select labelId="listing-status-label" id="listing-status" value={listingStatus ?? ''} onChange={handleListingStatusChange}>
                <MenuItem value={''}>All</MenuItem>
                <MenuItem value="listed">
                  <CommonTextIcon text="Listed" startIcon={<CgPlayListCheck className="text-primary text-md mr-2" />} />
                </MenuItem>
                <MenuItem value="pending">
                  <CommonTextIcon text="Pending" startIcon={<CgPlayList className="text-primary text-md mr-2" />} />
                </MenuItem>
                <MenuItem value="unlisted">
                  <CommonTextIcon text="Unlisted" startIcon={<CgPlayListRemove className="text-primary text-md mr-2" />} />
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ minWidth: 250 }} className="md:ml-2">
              <Autocomplete
                value={listingSelect}
                inputValue={listingInputValue || ''}
                onInputChange={handleListingInputChange}
                options={vehicleListingID}
                getOptionLabel={(option: any) => option.toString()}
                renderInput={(params) => <TextField {...params} label={listingInputValue === '' ? 'All Vehicles' : 'Vehicle'} variant="standard" />}
                onChange={(event, value) => {
                  setListingSelect(value as string);
                }}
              />
            </FormControl>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleSortFilter;
