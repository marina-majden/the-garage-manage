import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Grid
} from '@mui/material';
import { Edit, Delete, Close, Favorite, FavoriteBorder } from '@mui/icons-material';
import { VehicleDetailsService } from '../services/VehicleDetailService';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';
import { useSnackbar } from 'notistack';

const ViewVehicle = observer(({ open, modelId, onClose, onEdit }) => {
    const [modelDetails, setModelDetails] = useState(null);
    const [makeDetails, setMakeDetails] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const loadData = async () => {
            if (open && modelId) {
                try {
                    // Get model details through service
                    const model = await VehicleDetailsService.getModelById(modelId);
                    setModelDetails(model);

                    // Get make details if needed (separate from service)
                    if (model.makeId) {
                        const make = vehicleMakeStore.makes.find(m => m.id === model.makeId);
                        setMakeDetails(make || null);
                    }
                } catch (error) {
                    enqueueSnackbar(error.message, { variant: 'error' });
                    onClose();
                }
            }
        };

        loadData();
    }, [open, modelId, onClose, enqueueSnackbar]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await VehicleDetailsService.deleteModel(modelId);
                onClose();
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        }
    };

    if (!modelDetails) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Vehicle Details
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color="primary">Make</Typography>
                        <Typography variant="body1">{makeDetails?.name || 'Unknown Make'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color="primary">Model</Typography>
                        <Typography variant="body1">{modelDetails.name}</Typography>
                    </Grid>
                    {/* Keep other grid items similar */}
                </Grid>
            </DialogContent>

            <DialogActions>
                <IconButton onClick={() => onEdit(modelDetails)}>
                    <Edit color="primary" />
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <Delete color="error" />
                </IconButton>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
});

export default ViewVehicle;