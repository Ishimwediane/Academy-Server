import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../../utils/api';

const UserTable = ({ roleFilter, title }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState(true);

  const { data: usersData, isLoading, error } = useQuery(
    ['admin-users', { role: roleFilter, isActive: filterActive, search }],
    async () => {
      const params = {
        search,
        isActive: filterActive,
      };
      if (roleFilter) {
        params.role = roleFilter;
      }
      const response = await api.get('/admin/users', { params });
      return response.data.data;
    },
    {
      keepPreviousData: true,
    }
  );

  const updateUserStatus = useMutation(
    ({ id, isActive }) => api.put(`/users/${id}/status`, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
      },
    }
  );

  const handleStatusChange = (id, isActive) => {
    updateUserStatus.mutate({ id, isActive: !isActive });
  };

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={params.row.avatar} sx={{ width: 40, height: 40 }}>
              {params.row.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="600">
                {params.row.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 120,
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              textTransform: 'capitalize',
              fontWeight: 500,
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Joined Date',
        width: 180,
        renderCell: (params) => new Date(params.value).toLocaleDateString(),
      },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
          <Tooltip title={params.value ? 'Deactivate' : 'Activate'}>
            <Switch
              checked={params.value}
              onChange={() => handleStatusChange(params.id, params.value)}
              color="secondary"
            />
          </Tooltip>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <Box>
            <Tooltip title="Edit User">
              <IconButton onClick={() => console.log('Edit', params.id)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton onClick={() => console.log('Delete', params.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Search Users"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: '300px' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={filterActive}
                onChange={(e) => setFilterActive(e.target.checked)}
              />
            }
            label="Show Active Only"
          />
          <Button variant="contained" startIcon={<Add />}>
            Add {title}
          </Button>
        </Box>
      </Box>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to fetch users.</Alert>}
      {usersData && (
        <Box sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={usersData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row._id}
            loading={isLoading}
            rowHeight={70}
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserTable;