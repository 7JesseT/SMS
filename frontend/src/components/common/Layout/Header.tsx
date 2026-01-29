import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { useSidebar } from '../../../context/SidebarContext';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const { toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery('(max-width:960px)');
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotif(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - 260px)` },
        ml: { md: '260px' },
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {roleLabel} Portal
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={handleOpenNotifications}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {getInitials(user.name)}
            </Avatar>
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          sx={{ mt: '45px' }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          sx={{ mt: '45px' }}
          anchorEl={anchorElNotif}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElNotif)}
          onClose={handleCloseNotifications}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  opacity: notification.read ? 0.6 : 1,
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
