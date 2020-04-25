import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//CLIENT
import SignIn from "../client/components/sign-in/signIn";
import Cohorts from "../client/components/cohorts/cohorts";
import Queue from "../client/components/student-queue/main";
import Settings from "../client/components/common-components/settings/settings";
import ChatPage from "../client/components/chat-page/ChatPage";

//ADMIN
import AdminSignIn from "../admin/components/sign-in/signIn";
import MentorKeys from "../admin/components/mentor-keys/mentorKeys";
import Mentor from "../admin/components/mentors/mentor";
import AdminCohorts from "../admin/components/cohorts/cohort";
import ChangePassword from "../admin/components/change_password/changePassword";
import ChangeDefaultPassword from "../admin/components/change_password/defaultPassword";

//NOT FOUND
import NotFound from "../404";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        {/* CLIENT */}
        {window.location.pathname === "/"
          ? (window.location.href = "/sign-in")
          : null}
        <Route path="/sign-in" component={SignIn} />
        <Route exact path="/cohorts" component={Cohorts} />
        <Route exact path="/chat/:chatmateSub" component={ChatPage} />
        <Route path="/queue/:cid" component={Queue} />
        <Route path="/settings/:cid" component={Settings} />
        {/* ADMIN */}
        <Route path="/admin/keys" component={MentorKeys} />
        <Route path="/admin/mentors" component={Mentor} />
        <Route path="/admin/cohorts" component={AdminCohorts} />
        <Route path="/admin/sign-in" component={AdminSignIn} />
        <Route path="/admin/password" component={ChangePassword} />
        <Route path="/admin/default" component={ChangeDefaultPassword} />

        {/* NOT FOUND */}
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
