import "./App.css";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth, useSessionContext } from "supertokens-auth-react/recipe/session";
import { Routes, BrowserRouter as Router, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import { PreBuiltUIList, SuperTokensConfig, ComponentWrapper } from "./config";

SuperTokens.init(SuperTokensConfig);



const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
};


function Resume() {


    const sessionContext = useSessionContext();
    const location = useLocation();


    if (sessionContext.loading === true) {
        return null;
    }


    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get('url');
    if (paramValue) {
        const resumeUrl = decodeURIComponent(paramValue);
        window.location.href = resumeUrl;

    }

    return <Loader />

}



function App() {
    return (
        <SuperTokensWrapper>
            <ComponentWrapper>
                <div className="App app-container">
                    <Router>
                        <div className="fill">
                            <Routes>
                                {/* This shows the login UI on "/auth" route */}
                                {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"), PreBuiltUIList)}
                                <Route
                                    path="/"
                                    element={
                                        /* This protects the "/" route so that it shows
                                    <Home /> only if the user is logged in.
                                    Else it redirects the user to "/auth" */
                                        <SessionAuth>
                                            <Home />
                                        </SessionAuth>
                                    }
                                />
                                <Route
                                    path="/resume"
                                    element={
                                        <Resume />
                                    }
                                />
                            </Routes>
                        </div>
                    </Router>
                </div>
            </ComponentWrapper>
        </SuperTokensWrapper>
    );
}

export default App;
