import {ProfileDetails, ProfileHeader, ProfileName, ProfilePicture, LeftSection as LeftSectionStyle} from "Styles/index/profiles/styles";
import React from "react";

export default function LeftSection() {
  return (
    <LeftSectionStyle>
      <ProfileHeader>
        <ProfilePicture/>
        <ProfileName>Guest</ProfileName>
      </ProfileHeader>
      <ProfileDetails>
      </ProfileDetails>
    </LeftSectionStyle>
  );
}