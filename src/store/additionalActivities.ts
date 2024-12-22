import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { AdditionalActivity } from '../types/additionalActivity';

interface AdditionalActivitiesState {
  activities: AdditionalActivity[];
  addActivity: (description: string) => void;
  clearTodaysActivities: () => void;
}

type AdditionalActivitiesStore = AdditionalActivitiesState;

const persistConfig: PersistOptions<AdditionalActivitiesState> = {
  name: 'additional-activities-storage',
  getStorage: () => localStorage,
};

export const useAdditionalActivitiesStore = create<
  AdditionalActivitiesStore,
  [["zustand/persist", AdditionalActivitiesStore]]
>(
  persist(
    (set) => ({
      activities: [],
      addActivity: (description: string) => 
        set((state) => ({
          activities: [
            ...state.activities, 
            { 
              id: Date.now().toString(), 
              description, 
              createdAt: new Date().toLocaleDateString('en-CA')
            }
          ]
        })),
      clearTodaysActivities: () => 
        set((state) => ({
          activities: state.activities.filter(activity => {
            const activityDate = new Date(activity.createdAt + 'T12:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            activityDate.setHours(0, 0, 0, 0);
            return activityDate.getTime() !== today.getTime();
          })
        }))
    }),
    persistConfig
  )
);
