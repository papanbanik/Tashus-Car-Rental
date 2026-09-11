import { Button } from '@mui/material';
import moment from 'moment';
import { ToolbarProps, View } from 'react-big-calendar';

const RBCCustomToolbar = (props: ToolbarProps) => {
  const { date, onNavigate, label, views, view, onView } = props;

  const goToBack = () => {
    try {
      if (moment(date).isAfter(moment(), view === 'week' ? 'week' : 'month')) {
        onNavigate('PREV');
      }
    } catch (error) {
      console.error('goToBack error', error);
    }
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToToday = () => {
    onNavigate('TODAY');
  };

  const shouldDisableBackButton = () => {
    try {
      return moment(props.date).isSameOrBefore(moment(), view === 'week' ? 'week' : 'month');
    } catch (error) {
      console.error('shouldDisableBackButton error', error);
    }
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <Button type="button" className="normal-case" onClick={goToToday}>
          Today
        </Button>
        <Button type="button" className="normal-case" onClick={goToBack} disabled={shouldDisableBackButton()}>
          Back
        </Button>
        <Button type="button" className="normal-case" onClick={goToNext}>
          Next
        </Button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className="rbc-btn-group">
        {Array.isArray(views) &&
          views.map((viewOption: View) => (
            <button type="button" key={viewOption} className={view === viewOption ? 'rbc-active' : ''} onClick={() => onView(viewOption)}>
              {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
            </button>
          ))}
      </span>
    </div>
  );
};

export default RBCCustomToolbar;
