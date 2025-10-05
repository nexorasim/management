"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const client_1 = require("@apollo/client");
const react_redux_1 = require("react-redux");
const react_hot_toast_1 = require("react-hot-toast");
const apollo_1 = require("./utils/apollo");
const store_1 = require("./store");
const AuthContext_1 = require("./contexts/AuthContext");
const Layout_1 = require("./components/Layout");
const Dashboard_1 = require("./pages/Dashboard");
const Profiles_1 = require("./pages/Profiles");
const Analytics_1 = require("./pages/Analytics");
const AuditLogs_1 = require("./pages/AuditLogs");
const Login_1 = require("./pages/Login");
require("./i18n");
function App() {
    return (<react_redux_1.Provider store={store_1.store}>
      <client_1.ApolloProvider client={apollo_1.apolloClient}>
        <AuthContext_1.AuthProvider>
          <react_router_dom_1.BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <react_router_dom_1.Routes>
                <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
                <react_router_dom_1.Route path="/" element={<Layout_1.default />}>
                  <react_router_dom_1.Route index element={<Dashboard_1.default />}/>
                  <react_router_dom_1.Route path="profiles" element={<Profiles_1.default />}/>
                  <react_router_dom_1.Route path="analytics" element={<Analytics_1.default />}/>
                  <react_router_dom_1.Route path="audit" element={<AuditLogs_1.default />}/>
                </react_router_dom_1.Route>
              </react_router_dom_1.Routes>
              <react_hot_toast_1.Toaster position="top-right"/>
            </div>
          </react_router_dom_1.BrowserRouter>
        </AuthContext_1.AuthProvider>
      </client_1.ApolloProvider>
    </react_redux_1.Provider>);
}
exports.default = App;
//# sourceMappingURL=App.js.map