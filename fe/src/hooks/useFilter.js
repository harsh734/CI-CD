import { useDispatch, useSelector } from 'react-redux';
import {
  setStatusFilter, setCategoryFilter,
  setPriorityFilter, setSearchQuery, resetFilters,
} from '../redux/filterSlice';

export function useFilter() {
  const dispatch = useDispatch();
  const filter   = useSelector((s) => s.filter);

  return {
    ...filter,
    setStatus:   (v) => dispatch(setStatusFilter(v)),
    setCategory: (v) => dispatch(setCategoryFilter(v)),
    setPriority: (v) => dispatch(setPriorityFilter(v)),
    setSearch:   (v) => dispatch(setSearchQuery(v)),
    reset:       ()  => dispatch(resetFilters()),
  };
}
