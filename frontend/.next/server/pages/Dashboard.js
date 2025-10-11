"use strict";(()=>{var e={};e.id=156,e.ids=[156,660],e.modules={1323:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},6904:(e,t,r)=>{r.r(t),r.d(t,{config:()=>O,default:()=>g,getServerSideProps:()=>b,getStaticPaths:()=>x,getStaticProps:()=>p,reportWebVitals:()=>v,routeModule:()=>S,unstable_getServerProps:()=>_,unstable_getServerSideProps:()=>E,unstable_getStaticParams:()=>N,unstable_getStaticPaths:()=>P,unstable_getStaticProps:()=>j});var a={};r.r(a),r.d(a,{default:()=>m});var i=r(7093),o=r(5244),s=r(1323),n=r(1682),d=r.n(n),l=r(8141),c=r.n(l),u=r(997);r(6689);let f=require("@apollo/client");(0,f.gql)`
  query GetProfiles($carrier: String) {
    profiles(carrier: $carrier) {
      id
      iccid
      eid
      status
      carrier
      msisdn
      isActive
      createdAt
      updatedAt
      lastActivatedAt
    }
  }
`,(0,f.gql)`
  query GetProfile($id: String!) {
    profile(id: $id) {
      id
      iccid
      eid
      status
      carrier
      msisdn
      imsi
      isActive
      createdAt
      updatedAt
      lastActivatedAt
    }
  }
`;let h=(0,f.gql)`
  query GetProfileAnalytics($carrier: String) {
    profileAnalytics(carrier: $carrier)
  }
`;(0,f.gql)`
  mutation ActivateProfile($id: String!) {
    activateProfile(id: $id) {
      id
      status
      lastActivatedAt
    }
  }
`,(0,f.gql)`
  mutation DeactivateProfile($id: String!) {
    deactivateProfile(id: $id) {
      id
      status
    }
  }
`,function(){var e=Error("Cannot find module 'react-i18next'");throw e.code="MODULE_NOT_FOUND",e}(),function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}(),function(){var e=Error("Cannot find module 'react-chartjs-2'");throw e.code="MODULE_NOT_FOUND",e}(),Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()).register(Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()),Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()),Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()),Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()),Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()),Object(function(){var e=Error("Cannot find module 'chart.js'");throw e.code="MODULE_NOT_FOUND",e}()));let m=()=>{let{t:e}=Object(function(){var e=Error("Cannot find module 'react-i18next'");throw e.code="MODULE_NOT_FOUND",e}())(),{data:t,loading:r}=(0,f.useQuery)(h),a=t?JSON.parse(t.profileAnalytics):null,i={labels:[e("active"),e("inactive")],datasets:[{data:a?[a.active,a.inactive]:[0,0],backgroundColor:["#10B981","#EF4444"]}]},o={labels:["MPT","ATOM","Ooredoo","Mytel"],datasets:[{label:e("profiles"),data:[45,32,28,35],backgroundColor:"#3B82F6"}]};return r?u.jsx("div",{className:"p-6",children:e("loading")}):(0,u.jsxs)("div",{className:"p-6",children:[u.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-8",children:e("dashboard")}),(0,u.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6 mb-8",children:[(0,u.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow",children:[u.jsx("h3",{className:"text-sm font-medium text-gray-500",children:e("totalProfiles")}),u.jsx("p",{className:"text-3xl font-bold text-gray-900",children:a?.total||0})]}),(0,u.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow",children:[u.jsx("h3",{className:"text-sm font-medium text-gray-500",children:e("activeProfiles")}),u.jsx("p",{className:"text-3xl font-bold text-green-600",children:a?.active||0})]}),(0,u.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow",children:[u.jsx("h3",{className:"text-sm font-medium text-gray-500",children:e("inactiveProfiles")}),u.jsx("p",{className:"text-3xl font-bold text-red-600",children:a?.inactive||0})]}),(0,u.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow",children:[u.jsx("h3",{className:"text-sm font-medium text-gray-500",children:e("carriers")}),u.jsx("p",{className:"text-3xl font-bold text-blue-600",children:"4"})]})]}),(0,u.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[(0,u.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow",children:[u.jsx("h2",{className:"text-xl font-semibold mb-4",children:e("profileStatus")}),u.jsx("div",{className:"w-64 mx-auto",children:u.jsx(Object(function(){var e=Error("Cannot find module 'react-chartjs-2'");throw e.code="MODULE_NOT_FOUND",e}()),{data:i})})]}),(0,u.jsxs)("div",{className:"bg-white p-6 rounded-lg shadow",children:[u.jsx("h2",{className:"text-xl font-semibold mb-4",children:e("carrierDistribution")}),u.jsx(Object(function(){var e=Error("Cannot find module 'react-chartjs-2'");throw e.code="MODULE_NOT_FOUND",e}()),{data:o})]})]})]})},g=(0,s.l)(a,"default"),p=(0,s.l)(a,"getStaticProps"),x=(0,s.l)(a,"getStaticPaths"),b=(0,s.l)(a,"getServerSideProps"),O=(0,s.l)(a,"config"),v=(0,s.l)(a,"reportWebVitals"),j=(0,s.l)(a,"unstable_getStaticProps"),P=(0,s.l)(a,"unstable_getStaticPaths"),N=(0,s.l)(a,"unstable_getStaticParams"),_=(0,s.l)(a,"unstable_getServerProps"),E=(0,s.l)(a,"unstable_getServerSideProps"),S=new i.PagesRouteModule({definition:{kind:o.x.PAGES,page:"/Dashboard",pathname:"/Dashboard",bundlePath:"",filename:""},components:{App:c(),Document:d()},userland:a})},8141:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return d}});let a=r(167),i=r(997),o=a._(r(6689)),s=r(5782);async function n(e){let{Component:t,ctx:r}=e;return{pageProps:await (0,s.loadGetInitialProps)(t,r)}}class d extends o.default.Component{render(){let{Component:e,pageProps:t}=this.props;return(0,i.jsx)(e,{...t})}}d.origGetInitialProps=n,d.getInitialProps=n,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5244:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},2785:e=>{e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{e.exports=require("react")},997:e=>{e.exports=require("react/jsx-runtime")},5315:e=>{e.exports=require("path")}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[682],()=>r(6904));module.exports=a})();