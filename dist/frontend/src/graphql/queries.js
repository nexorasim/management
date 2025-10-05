"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEACTIVATE_PROFILE = exports.ACTIVATE_PROFILE = exports.GET_PROFILE_ANALYTICS = exports.GET_PROFILE = exports.GET_PROFILES = void 0;
const client_1 = require("@apollo/client");
exports.GET_PROFILES = (0, client_1.gql) `
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
`;
exports.GET_PROFILE = (0, client_1.gql) `
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
`;
exports.GET_PROFILE_ANALYTICS = (0, client_1.gql) `
  query GetProfileAnalytics($carrier: String) {
    profileAnalytics(carrier: $carrier)
  }
`;
exports.ACTIVATE_PROFILE = (0, client_1.gql) `
  mutation ActivateProfile($id: String!) {
    activateProfile(id: $id) {
      id
      status
      lastActivatedAt
    }
  }
`;
exports.DEACTIVATE_PROFILE = (0, client_1.gql) `
  mutation DeactivateProfile($id: String!) {
    deactivateProfile(id: $id) {
      id
      status
    }
  }
`;
//# sourceMappingURL=queries.js.map