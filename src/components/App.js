import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCart, getCart } from "../_actions/cart_actions";
import { setIndex } from "../_actions/playlist_actions";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadBeatPage from "./views/UploadBeatPage/UploadBeatPage";
import OrdersPage from "./views/OrdersPage/OrdersPage";
import CartPage from "./views/CartPage/CartPage";
import BeatPage from "./views/BeatPage/BeatPage";
import BeatPlayer from "./views/BeatPlayer/BeatPlayer";
import DownloadPage from "./views/DownloadPage/DownloadPage";
import ErrorNotFoundPage from "./views/ErrorNotFoundPage/ErrorNotFoundPage";
import { AudioContextProvider } from "./utils/AudioContext";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

// Auth(SpecificComponent, option, adminRoute)
// option:
const PUBLIC_PAGE = 0;
const LOGGED_IN_ONLY = 1;
const PUBLIC_ONLY = 2;
// adminRoute:
// true for Admin only
// false for all users

function App() {
  const dispatch = useDispatch();

  const newCart = () => {
    dispatch(createCart())
      .then(response => {
        if (response.payload.success) {
          window.localStorage.setItem("cartId", response.payload.cartId);
        } else {
          console.log(response)
        }
      });
  }

  const getCartInfo = (cartId) => {
    dispatch(getCart(cartId));
  }

  const createIndex = () => {
    dispatch(setIndex(0));
  }

  if (!window.localStorage.getItem("cartId")) {
    newCart();
    createIndex();
  } else {
    getCartInfo(window.localStorage.getItem("cartId"));
    createIndex();
  }

  return (
    <ThemeProvider>
      <CSSReset />
      <Suspense fallback={(<div>Loading...</div>)}>
       <AudioContextProvider>
        <NavBar>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, PUBLIC_PAGE, false)} />
            <Route exact path="/login" component={Auth(LoginPage, PUBLIC_ONLY, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, PUBLIC_ONLY, false)} />
            <Route exact path="/upload" component={Auth(UploadBeatPage, PUBLIC_PAGE, true)} />
            <Route exact path="/beat/:beatUrl" component={Auth(BeatPage, PUBLIC_PAGE, false)} />
            <Route exact path="/cart" component={Auth(CartPage, PUBLIC_PAGE, false)} />
            <Route exact path="/orders" component={Auth(OrdersPage, PUBLIC_PAGE, false)} />
            <Route exact path="/download" component={Auth(DownloadPage, PUBLIC_PAGE, false)} />
            <Route component={Auth(ErrorNotFoundPage, PUBLIC_PAGE, false)} />
          </Switch>
        </NavBar>
        <Footer />
        <BeatPlayer />
       </AudioContextProvider>
      </Suspense>
    </ThemeProvider>
  );
}

{/* <Route exact path="/register" component={Auth(RegisterPage, PUBLIC_ONLY, false)} />
<Route exact path="/upload" component={Auth(UploadBeatPage, LOGGED_IN_ONLY, true)} />
<Route exact path="/beat/:beatUrl" component={Auth(BeatPage, PUBLIC_PAGE, false)} />
<Route exact path="/cart" component={Auth(CartPage, PUBLIC_PAGE, false)} />
<Route exact path="/orders" component={Auth(OrdersPage, LOGGED_IN_ONLY, false)} />
<Route exact path="/download" component={Auth(DownloadPage, PUBLIC_PAGE, false)} /> */}

export default App;
