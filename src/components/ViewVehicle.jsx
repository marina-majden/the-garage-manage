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
    Grid2 
} from '@mui/material';
import { Edit, Delete, Close, Favorite, FavoriteBorder } from '@mui/icons-material';
import { vehicleModelStore } from '../stores/VehicleModelStore';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';

const ViewVehicle = observer(({ open, vehicle, onClose }) => {
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [makeDetails, setMakeDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (open && vehicle) {
                // Fetch fresh model data
                const freshModel = await vehicleModelStore.getModelById(vehicle.id);
                setCurrentVehicle(freshModel);

                // Fetch make details using the model's makeId
                if (freshModel?.makeId) {
                    const make = vehicleMakeStore.makes.find(m => m.id === freshModel.makeId);
                    setMakeDetails(make);
                }
            }
        };
        fetchData();
    }, [open, vehicle]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            await vehicleModelStore.deleteModel(vehicle.id);
            onClose();
        }
    };

    if (!currentVehicle) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>
                <Typography variant='h5'>Vehicle Details</Typography>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid2 container spacing={3}>
                    <Grid2 item xs={12} md={6}>
                        <Typography variant="subtitle1" color="primary">Make</Typography>
                        <Typography variant="body1">
                            {makeDetails?.name || 'Unknown Make'}
                        </Typography>
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                        <Typography variant="subtitle1" color="primary">Model</Typography>
                        <Typography variant="body1">{currentVehicle.name}</Typography>
                    </Grid2>
                    <Grid2 item xs={6} md={4}>
                        <Typography variant="subtitle1" color="primary">Abbreviation</Typography>
                        <Typography variant="body1">{currentVehicle.abrv}</Typography>
                    </Grid2>
                    <Grid2 item xs={6} md={4}>
                        <Typography variant="subtitle1" color="primary">Year</Typography>
                        <Typography variant="body1">{currentVehicle.year || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 item xs={6} md={4}>
                        <Typography variant="subtitle1" color="primary">Color</Typography>
                        <div style={{
                            backgroundColor: currentVehicle.color,
                            width: '50px',
                            height: '25px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }} />
                    </Grid2>
                    <Grid2 item xs={6} md={4}>
                        <Typography variant="subtitle1" color="primary">Favorite</Typography>
                        <Typography variant="body1">
                            {currentVehicle.favorite ? (
                                <Favorite color="error" />
                            ) : (
                                <FavoriteBorder color="disabled" />
                            )}
                        </Typography>
                    </Grid2>
                </Grid2>
            </DialogContent>

            <DialogActions>
                <IconButton onClick={handleEdit}>
                    <Edit color="primary" />
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <Delete color="error" />
                </IconButton>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default ViewVehicle;