import React, { useState } from 'react';
import { SaveGame } from 'main/sentient-sims/models/SaveGame';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { useWebsocket } from './providers/WebsocketProvider';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface GlobalMemory {
  id: string;
  key: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function GlobalMemoryPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMemory, setEditingMemory] = useState<GlobalMemory | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
  });
  const queryClient = useQueryClient();
  const { status } = useWebsocket();

  const { data: saveGames } = useQuery({
    queryKey: ['saveGames'],
    queryFn: async () => {
      const response = await api.get('/db/list');
      return response.data as SaveGame[];
    },
  });

  const { data: memories, isLoading } = useQuery({
    queryKey: ['globalMemories', saveGames?.[0]],
    queryFn: async () => {
      if (!saveGames?.[0]) return [];
      const response = await api.get('/global-memory', {
        params: {
          saveGameId: saveGames[0].name,
          saveGameType: saveGames[0].type,
        },
      });
      return response.data;
    },
    enabled: !!saveGames?.[0],
  });

  const createMutation = useMutation({
    mutationFn: async (newMemory: Omit<GlobalMemory, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/global-memory', {
        ...newMemory,
        saveGameId: saveGames?.[0]?.name,
        saveGameType: saveGames?.[0]?.type,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMemories'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedMemory: GlobalMemory) => {
      const response = await api.put(`/global-memory/${updatedMemory.id}`, {
        ...updatedMemory,
        saveGameId: saveGames?.[0]?.name,
        saveGameType: saveGames?.[0]?.type,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMemories'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/global-memory/${id}`, {
        params: {
          saveGameId: saveGames?.[0]?.name,
          saveGameType: saveGames?.[0]?.type,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMemories'] });
    },
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMemory(null);
    setFormData({ key: '', value: '', description: '' });
  };

  const handleOpenDialog = (memory?: GlobalMemory) => {
    if (memory) {
      setEditingMemory(memory);
      setFormData({
        key: memory.key,
        value: memory.value,
        description: memory.description || '',
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMemory) {
      updateMutation.mutate({
        ...editingMemory,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!status.mod) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Not connected to The Sims 4
        </Typography>
        <Typography>
          Please ensure The Sims 4 is running and the mod is properly installed.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Global Memories</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add New Memory
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memories?.map((memory: GlobalMemory) => (
              <TableRow key={memory.id}>
                <TableCell>{memory.key}</TableCell>
                <TableCell>{memory.value}</TableCell>
                <TableCell>{memory.description}</TableCell>
                <TableCell>{new Date(memory.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(memory)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(memory.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingMemory ? 'Edit Memory' : 'Add New Memory'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingMemory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
