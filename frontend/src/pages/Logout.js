import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';

const Logout = () => {
    const currentUser = useSelector(state => state.user.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <LogoutContainer>
            <h1>{currentUser.name}</h1>
            <LogoutMessage>Are you sure you want to log out?</LogoutMessage>
            <LogoutButtonLogout onClick={handleLogout}>Log Out</LogoutButtonLogout>
            <LogoutButtonCancel onClick={handleCancel}>Cancel</LogoutButtonCancel>
        </LogoutContainer>
    );
};

export default Logout;

const LogoutContainer = styled.div`
  border: 2px solid #D4AF37;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 15px rgba(212, 175, 55, 0.2);
  background-color: #FFFFFF;
  color: #111111;
`;

const LogoutMessage = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
  color: #111111;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12);
  }
`;

const LogoutButtonLogout = styled(LogoutButton)`
  background-color: #D4AF37;
  color: #FFFFFF;
  border: 1px solid #B88F2A;

  &:hover {
    background-color: #FFFFFF;
    color: #D4AF37;
    border-color: #D4AF37;
  }
`;

const LogoutButtonCancel = styled(LogoutButton)`
  background-color: #F7F6F4;
  color: #111111;
  border: 1px solid #D4AF37;

  &:hover {
    background-color: #D4AF37;
    color: #FFFFFF;
    border-color: #B88F2A;
  }
`;
