import { observer } from 'mobx-react';
import { useEffect } from 'react';
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
import { Edit, Delete } from '@mui/icons-material';
import { vehicleModelStore } from '../stores/VehicleModelStore';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';


const ViewVehicle = observer(({ open, vehicle, onClose }) => {

    const getMakeName = (makeId) => {
        return vehicleMakeStore.makes.find(make => make.id === makeId)?.name || 'Unknown';
    };
    useEffect(() => {
       
        const fetchData = async () => {
            if (open && vehicle) {
                const freshData = await vehicleModelStore.getModelById(vehicle.id);
                setSelectedVehicle(freshData);
              
            }
        };
        fetchData();
    }, [open]); 
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            await vehicleModelStore.deleteModel(vehicle.id);
            onClose();
        }
    };

    const handleEdit = () => {
        onClose(); // Close view dialog
        // You'll need to open the edit dialog here (modify Homepage state)
    };

    if (!vehicle) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Vehicle Details
                <IconButton onClick={handleEdit} sx={{ float: 'right' }}>
                    <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} sx={{ float: 'right' }}>
                    <Delete color="error" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle1">Make:</Typography>
                        <Typography variant="body1">{getMakeName(vehicle.makeId)}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle1">Model:</Typography>
                        <Typography variant="body1">{vehicle.name}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle1">Abbreviation:</Typography>
                        <Typography variant="body1">{vehicle.abrv}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle1">Year:</Typography>
                        <Typography variant="body1">{vehicle.year || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle1">Color:</Typography>
                        <div style={{
                            backgroundColor: vehicle.color,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            border: '1px solid #ddd'
                        }} />
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="subtitle1">Favorite:</Typography>
                        <Typography variant="body1">
                            {vehicle.favorite ? 'Yes' : 'No'}
                        </Typography>
                    </Grid2>
                </Grid2>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default ViewVehicle;