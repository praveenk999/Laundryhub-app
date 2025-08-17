import moment from 'moment';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set) => ({
      order: {
        items: [],
        orderTotal: 0,
        pickupDate: '',
        deliveryDate: '-- -- --',
        pickupTime: '',
        deliveryTime: '',
        pickupAddress: '',
        deliveryAddress: '',
        launderer: '',
      },

      updateItems: (newItems) => {
        set((state) => {
          const updatedItems = [...state.order.items];

          newItems.forEach((newItem) => {
            const existingItemIndex = updatedItems.findIndex(
              (item) =>
                item.name === newItem.name && item.washType === newItem.washType
            );

            if (existingItemIndex > -1) {
              updatedItems[existingItemIndex].quantity += newItem.quantity;
            } else {
              updatedItems.push(newItem);
            }
          });
          const updatedOrderTotal = updatedItems.reduce(
            (acc, item) => acc + item.quantity * item.pricePerItem,
            0
          );
          return {
            order: {
              ...state.order,
              items: updatedItems,
              orderTotal: updatedOrderTotal,
            },
          };
        });
      },

      clearItems: () => {
        set((state) => {
          return {
            order: {
              ...state.order,
              items: [],
              orderTotal: 0,
            },
          };
        });
      },

      setPickupDate: (value) => {
        set((state) => {
          let newPickupDate;
          let newDeliveryDate;

          if (value === '') {
            newPickupDate = '';
            newDeliveryDate = '-- -- --';
          } else if (value === moment().format('ddd, D MMM YYYY')) {
            newPickupDate = moment().format('ddd, D MMM YYYY');
            newDeliveryDate = moment().add(2, 'days').format('ddd, D MMM YYYY');
          } else if (
            value === moment().add(1, 'days').format('ddd, D MMM YYYY')
          ) {
            newPickupDate = moment().add(1, 'days').format('ddd, D MMM YYYY');
            newDeliveryDate = moment().add(3, 'days').format('ddd, D MMM YYYY');
          } else {
            newPickupDate = moment().add(2, 'days').format('ddd, D MMM YYYY');
            newDeliveryDate = moment().add(4, 'days').format('ddd, D MMM YYYY');
          }

          return {
            ...state,
            order: {
              ...state.order,
              pickupDate: String(newPickupDate),
              deliveryDate: String(newDeliveryDate),
            },
          };
        });
      },
      setPickupTime: (value) => {
        set((state) => {
          return {
            ...state,
            order: {
              ...state.order,
              pickupTime: value,
            },
          };
        });
      },

      setDeliveryTime: (value) => {
        set((state) => {
          return {
            ...state,
            order: {
              ...state.order,
              deliveryTime: value,
            },
          };
        });
      },

      setPickupAddress: (value) => {
        set((state) => {
          return {
            ...state,
            order: {
              ...state.order,
              pickupAddress: value,
            },
          };
        });
      },

      setDeliveryAddress: (value) => {
        set((state) => {
          return {
            ...state,
            order: {
              ...state.order,
              deliveryAddress: value,
            },
          };
        });
      },

      setLaunderer: (value) => {
        set((state) => {
          return {
            ...state,
            order: {
              ...state.order,
              launderer: value,
            },
          };
        });
      },

      clearSchedule: () => {
        set((state) => {
          return {
            ...state,
            order: {
              ...state.order,
              pickupDate: '',
              deliveryDate: '-- -- --',
              pickupTime: '',
              deliveryTime: '',
              pickupAddress: '',
              deliveryAddress: '',
              launderer: '',
            },
          };
        });
      },
    }),
    {
      name: 'order-store',
      getStorage: () => sessionStorage,
    }
  )
);
export default useOrderStore;
