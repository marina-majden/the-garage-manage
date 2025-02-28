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
import { vehicleMakeStore } from '../stores/VehicleMakeStore';
import { VehicleDetailService } from '../services/VehicleDetailService';

const ViewVehicle = observer(({ open, modelId, onClose, onEdit }) => {
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [makeDetails, setMakeDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (open && modelId) {
                setLoading(true);
                try {
                    
                    const model = await VehicleDetailService.getModelById(modelId);
                    setCurrentVehicle(model);

                    if (model?.makeId) {
                        const make = vehicleMakeStore.makes.find(m => m.id === model.makeId);
                        setMakeDetails(make || null);
                    }
                } catch (error) {
                    console.error("Error loading vehicle details:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [open, modelId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await VehicleDetailService.deleteModel(modelId);
                onClose();
            } catch (error) {
                console.error("Error deleting vehicle:", error);
            }
        }
    };

    if (loading) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '20px' 
                    }}>
                        <Typography variant="body1">Loading vehicle details...</Typography>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!currentVehicle) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Vehicle Details
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
                                <Favorite color="primary" />
                            ) : (
                                <FavoriteBorder color="disabled" />
                            )}
                        </Typography>
                    </Grid2>
                </Grid2>
            </DialogContent>

            <DialogActions>
                <IconButton onClick={() => onEdit(currentVehicle)}>
                    <Edit color="primary" />
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <Delete color="secondary" />
                </IconButton>
                <Button onClick={onClose} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
});

export default ViewVehicle;