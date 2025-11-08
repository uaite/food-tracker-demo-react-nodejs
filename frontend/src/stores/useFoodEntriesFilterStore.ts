import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { endOfDay, formatISO } from 'date-fns';

export interface FoodEntriesFilters {
  fromDate?: Date;
  toDate?: Date;
}

type State = {
  filters: FoodEntriesFilters;
};

type Actions = {
  setFromDate: (date: Date | undefined) => void;
  setToDate: (date: Date | undefined) => void;
  setDateRange: (fromDate: Date | undefined, toDate: Date | undefined) => void;
  clearFilters: () => void;
  getQueryParams: () => { from?: string; to?: string };
};

export const useFoodEntriesFilterStore = create<State & Actions>()(
  immer((set, get) => ({
    filters: {},

    setFromDate: (date: Date | undefined) => {
      set((state) => {
        state.filters.fromDate = date;
      });
    },

    setToDate: (date: Date | undefined) => {
      set((state) => {
        state.filters.toDate = date;
      });
    },

    setDateRange: (fromDate: Date | undefined, toDate: Date | undefined) => {
      set((state) => {
        state.filters.fromDate = fromDate;
        state.filters.toDate = toDate;
      });
    },

    clearFilters: () => {
      set((state) => {
        state.filters = {};
      });
    },

    getQueryParams: () => {
      const { filters } = get();
      const params: { from?: string; to?: string } = {};

      if (filters.fromDate) {
        params.from = formatISO(filters.fromDate);
      }

      if (filters.toDate) {
        params.to = formatISO(endOfDay(filters.toDate));
      }

      return params;
    },
  }))
);
