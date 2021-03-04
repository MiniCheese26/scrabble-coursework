import styled from "styled-components";
import image from "Resources/blank-avatar.png";
import {Panel} from "Styles/index/styles";

export const LeftSection = styled(Panel)`
  flex: 1 2;
  margin-left: 0.5rem;
  display: flex;
  flex-direction: column;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-end;
  border-bottom: #162127 2px solid;
  padding-bottom: 0.3rem;
`;

export const ProfilePicture = styled.div`
  background-image: url(${image});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 64px;
  height: 64px;
`;

export const ProfileName = styled.h3`
  flex: 3;
  font-size: 1.8rem;
  margin-left: 0.5rem;
`;

export const ProfileDetails = styled.div`
  flex: 5;
  display: flex;
`;