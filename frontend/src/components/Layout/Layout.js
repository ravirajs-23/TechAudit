import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Badge,
  Tooltip,
  Collapse,
  Chip,
  Fade,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  QuestionAnswer as QuestionIcon,
  ViewList as SectionIcon,
  Build as BuildIcon,
  Computer as TechnologyIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Assignment as AssignmentIcon,
  ExpandLess,
  ExpandMore,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  FolderOpen as FolderIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    management: true,
    audit: true,
  });
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationSections = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          path: '/dashboard',
          badge: null,
          description: 'Overview and analytics'
        },
      ]
    },
    {
      id: 'management',
      title: 'Content Management',
      items: [
        {
          text: 'Questions',
          icon: <QuestionIcon />,
          path: '/questions',
          badge: null,
          description: 'Manage audit questions'
        },
        {
          text: 'Sections',
          icon: <SectionIcon />,
          path: '/sections',
          badge: null,
          description: 'Organize question sections'
        },
        {
          text: 'Questionnaires',
          icon: <AssignmentIcon />,
          path: '/questionnaires',
          badge: null,
          description: 'Build questionnaires'
        },
        {
          text: 'Technologies',
          icon: <TechnologyIcon />,
          path: '/technologies',
          badge: null,
          description: 'Technology stack management'
        },
      ]
    },
    {
      id: 'audit',
      title: 'Audit Operations',
      items: [
        {
          text: 'Audits',
          icon: <AssessmentIcon />,
          path: '/audits',
          badge: '3',
          description: 'Manage audit processes'
        },
        {
          text: 'Reports',
          icon: <AnalyticsIcon />,
          path: '/reports',
          badge: null,
          description: 'View audit reports'
        },
      ]
    }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 80,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              Tech Audit
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Security Assessment Platform
            </Typography>
          </Box>
        </Box>
        <Chip
          label="v2.0"
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      {/* Navigation Sections */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {navigationSections.map((section) => (
          <Box key={section.id}>
            <ListItemButton
              onClick={() => handleSectionToggle(section.id)}
              sx={{
                px: 2,
                py: 1.5,
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem'
                }}
              >
                {section.title}
              </Typography>
              {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
              <List disablePadding>
                {section.items.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{
                        mx: 1,
                        mb: 0.5,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          transform: 'translateX(4px)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                            transform: 'translateX(6px)',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                          '& .MuiListItemText-primary': {
                            fontWeight: 'bold',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          transform: 'translateX(2px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        secondary={item.description}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          sx: {
                            opacity: location.pathname === item.path ? 0.8 : 0.6,
                            fontSize: '0.7rem'
                          }
                        }}
                      />
                      {item.badge && (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.7rem',
                              height: 18,
                              minWidth: 18,
                            }
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </Box>

      {/* User Section - Simplified */}
      <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isAdmin ? 'Administrator' : 'Auditor'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Page Title */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {navigationSections
                .flatMap(section => section.items)
                .find(item => item.path === location.pathname)?.text || 'Tech Audit'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {navigationSections
                .flatMap(section => section.items)
                .find(item => item.path === location.pathname)?.description || 'Security Assessment Platform'}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Button */}
            <Tooltip title="Profile">
              <IconButton
                onClick={() => navigate('/profile')}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>

            {/* Settings Button */}
            <Tooltip title="Settings">
              <IconButton
                onClick={() => navigate('/settings')}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Box sx={{ textAlign: 'right', mr: 2, display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {isAdmin ? 'Administrator' : 'Auditor'}
                </Typography>
              </Box>
              <Tooltip title="Account menu">
                <IconButton
                  onClick={handleUserMenuOpen}
                  size="small"
                  sx={{
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }
                  }}
                  aria-controls={userMenuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen ? 'true' : undefined}
                >
                  <Avatar sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={userMenuOpen}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                },
              },
            }}
          >
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0 0 24px rgba(0,0,0,0.08)',
              background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <Fade in timeout={300}>
            <Box>
              {children}
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
