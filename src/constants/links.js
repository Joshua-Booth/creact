/**
 * Action types for reducers.
 *
 * @file links.js
 * @module constants - Link objects
 * @author Joshua Booth
 * @see https://github.com/joshua-booth/creact
 */

import React from "react";

// Assets
import {
  UserIcon,
  QuestionCircleIcon,
  BarsIcon,
  SignInAltIcon,
  TachometerAltIcon,
  CogIcon,
  FacebookFIcon,
  InstagramIcon,
  TwitterIcon,
} from "assets/icons";

// Constants
import { SocialUrls } from "constants/urls";

/** Link objects for the more component. */
export const MORE_LINKS = [
  { path: "profile", label: "Profile", icon: <UserIcon /> },
  { path: "help", label: "Help", icon: <QuestionCircleIcon /> },
];

/** Link objects for the side navigation component. */
export const SIDE_LINKS = [
  { path: "dashboard", label: "Dashboard", icon: <TachometerAltIcon /> },
  { path: "profile", label: "Profile", icon: <UserIcon /> },
  { path: "settings", label: "Settings", icon: <CogIcon /> },
  { path: "help", label: "Help", icon: <QuestionCircleIcon /> },
];

/** Link objects for the bottom navigation component for non-authorised users. */
export const BOTTOM_PUBLIC_LINKS = [
  { path: "login", label: "Login", icon: <SignInAltIcon /> },
];

/** Link objects for the bottom navigation component for authorised users. */
export const BOTTOM_LINKS = [
  { path: "dashboard", label: "Dashboard", icon: <TachometerAltIcon /> },
  { path: "profile", label: "Profile", icon: <UserIcon /> },
  { path: "settings", label: "Settings", icon: <CogIcon /> },
  { path: "more", label: "More", icon: <BarsIcon /> },
];

const { FACEBOOK, TWITTER, INSTAGRAM } = SocialUrls;

/** Link objects for the footer component. */
export const SOCIAL_LINKS = [
  { path: FACEBOOK, label: "Facebook", icon: <FacebookFIcon /> },
  { path: TWITTER, label: "Twitter", icon: <TwitterIcon /> },
  { path: INSTAGRAM, label: "Instagram", icon: <InstagramIcon /> },
];
