import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard,
  People,
  School,
  Class,
  MenuBook,
  Announcement,
  Feedback,
  EventNote,
  Person,
  Grade,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { useSidebar } from '../../../context/SidebarContext';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  roles: string[];
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard />, roles: ['admin'] },
  { label: 'Students', path: '/admin/students', icon: <People />, roles: ['admin'] },
  { label: 'Teachers', path: '/admin/teachers', icon: <School />, roles: ['admin'] },
  { label: 'Classes', path: '/admin/classes', icon: <Class />, roles: ['admin'] },
  { label: 'Subjects', path: '/admin/subjects', icon: <MenuBook />, roles: ['admin'] },
  { label: 'Notices', path: '/admin/notices', icon: <Announcement />, roles: ['admin'] },
  { label: 'Complaints', path: '/admin/complaints', icon: <Feedback />, roles: ['admin'] },
  
  { label: 'Dashboard', path: '/teacher/dashboard', icon: <Dashboard />, roles: ['teacher'] },
  { label: 'My Classes', path: '/teacher/classes', icon: <Class />, roles: ['teacher'] },
  { label: 'Attendance', path: '/teacher/attendance', icon: <EventNote />, roles: ['teacher'] },
  { label: 'Grades', path: '/teacher/grades', icon: <Grade />, roles: ['teacher'] },
  { label: 'Profile', path: '/teacher/profile', icon: <Person />, roles: ['teacher'] },
  
  { label: 'Dashboard', path: '/student/dashboard', icon: <Dashboard />, roles: ['student'] },
  { label: 'My Grades', path: '/student/grades', icon: <Grade />, roles: ['student'] },
  { label: 'Attendance', path: '/student/attendance', icon: <EventNote />, roles: ['student'] },
  { label: 'My Subjects', path: '/student/subjects', icon: <MenuBook />, roles: ['student'] },
  { label: 'Notices', path: '/student/notices', icon: <Announcement />, roles: ['student'] },
  { label: 'Complaints', path: '/student/complaints', icon: <Feedback />, roles: ['student'] },
  { label: 'Profile', path: '/student/profile', icon: <Person />, roles: ['student'] },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();
  const isMobile = useMediaQuery('(max-width:960px)');

  if (!user) return null;

  const userNavItems = navigationItems.filter(item => item.roles.includes(user.role));

  const drawer = (
    <>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <School color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" noWrap component="div" fontWeight={600}>
            SchoolMS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 2 }}>
        {userNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) toggleSidebar();
                }}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={toggleSidebar}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
