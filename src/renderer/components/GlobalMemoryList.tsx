import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface GlobalMemory {
  id: number;
  content: string;
  importance: number;
  createdAt: string;
  updatedAt: string;
}

const GlobalMemoryList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMemory, setEditingMemory] = useState<GlobalMemory | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    importance: 0,
  });

  const queryClient = useQueryClient();

  const { data: memories, isLoading } = useQuery<GlobalMemory[]>({
    queryKey: ['globalMemories'],
    queryFn: async () => {
      const response = await axios.get('/api/global-memories');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMemory: Omit<GlobalMemory, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post('/api/global-memories', newMemory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMemories'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: GlobalMemory) => {
      const response = await axios.put(`/api/global-memories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMemories'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/global-memories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalMemories'] });
    },
  });

  const handleOpenDialog = (memory?: GlobalMemory) => {
    if (memory) {
      setEditingMemory(memory);
      setFormData({
        content: memory.content,
        importance: memory.importance,
      });
    } else {
      setEditingMemory(null);
      setFormData({
        content: '',
        importance: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMemory(null);
    setFormData({
      content: '',
      importance: 0,
    });
  };

  const handleSubmit = () => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Global Memories</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Memory
        </Button>
      </Box>

      <Grid container spacing={3}>
        {memories?.map((memory) => (
          <Grid item xs={12} sm={6} md={4} key={memory.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {memory.content}
                </Typography>
                <Typography color="textSecondary">
                  Importance: {memory.importance}
                </Typography>
                <Typography variant="caption" display="block">
                  Last updated: {new Date(memory.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(memory)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteMutation.mutate(memory.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMemory ? 'Edit Memory' : 'Add Memory'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Importance"
            type="number"
            fullWidth
            value={formData.importance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, importance: parseInt(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMemory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GlobalMemoryList;
