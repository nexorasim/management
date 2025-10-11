import { gql } from '@apollo/client';

export const GET_PROFILES = gql`
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

export const GET_PROFILE = gql`
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

export const GET_PROFILE_ANALYTICS = gql`
  query GetProfileAnalytics($carrier: String) {
    profileAnalytics(carrier: $carrier)
  }
`;

export const ACTIVATE_PROFILE = gql`
  mutation ActivateProfile($id: String!) {
    activateProfile(id: $id) {
      id
      status
      lastActivatedAt
    }
  }
`;

export const DEACTIVATE_PROFILE = gql`
  mutation DeactivateProfile($id: String!) {
    deactivateProfile(id: $id) {
      id
      status
    }
  }
`;