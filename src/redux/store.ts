import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlide';
import filmReducer from './slice/filmSlide';
import userReducer from './slice/userSlide';
import cinemaReducer from './slice/cinemaSlide';
import promotionReducer from './slice/promotionSlide';
import roomReducer from './slice/roomSlide';
import ticketReducer from './slice/ticketSlide';
import permissionReducer from './slice/permissionSlide';
import roleReducer from './slice/roleSlide';
import showtimeReducer from './slice/showtimeSlide';
import snackReducer from './slice/snackSlide';
import discountReducer from './slice/discountSlide';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    film: filmReducer,
    user: userReducer,
    cinema: cinemaReducer,
    promotion: promotionReducer,
    snack: snackReducer,
    room: roomReducer,
    discount: discountReducer,
    showtime: showtimeReducer,
    ticket: ticketReducer,
    permission: permissionReducer,
    role: roleReducer,
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;