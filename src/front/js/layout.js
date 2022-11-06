import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { SideBar } from "./component/sidebar";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import SignUp from "./pages/signup";
import Login from "./pages/home";
import UserHome from "./pages/userHome";
import { ShowPost } from "./component/post/showPosts";
import NewEvent from "./component/Events/newEvent.jsx";
import EditEvent from "./component/Events/editEvent.jsx";
import ShowEvent from "./component/Events/showEvent.jsx";
import { Noticias } from "./component/noticias";
import AllEvents from "./pages/Events/allEvents.jsx";
import UserProfile from "./component/profile/userProfile";
import Images from "./component/images/images.jsx";
import AllPublicEvents from "./pages/Events/allPublicEvents.jsx";
import SearchEvents from "./pages/Events/searchEvents.jsx";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Routes>
            <Route element={<Login />} path="/" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<Single />} path="/single/:theid" />
            <Route element={<h1>Not found!</h1>} />
            <Route element={<UserHome />} path="/userHome" />
            <Route element={<ShowPost />} path="/userHome/post" />
            <Route element={<EditEvent />} path="/editevent/:eventId" />
            <Route element={<ShowEvent />} path="/showevent/:eventId" />
            <Route
              element={<AllEvents noNavBar={false} />}
              path="/allevents/:page/:per_page"
            />
            <Route
              element={<AllPublicEvents />}
              path="/allpublicevents/:page/:per_page"
            />
            <Route element={<NewEvent />} path="/newevent" />
            <Route element={<SearchEvents />} path="/searchevents" />
            <Route element={<UserProfile />} path="/userprofile" />
            <Route element={<Noticias />} path="/noticias" />
            <Route element={<Images />} path="/images" />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
