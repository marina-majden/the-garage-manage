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
import { Edit, Delete, Favorite, FavoriteBorder } from '@mui/icons-material';
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
       // Close view dialog
        // You'll need to open the edit dialog here (modify Homepage state)
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth>
            <DialogTitle>
                <Typography variant='h5'>  Vehicle Details</Typography>
              
                
            </DialogTitle>

            <DialogContent dividers>
                <Grid2 container spacing={6}>
                    <Grid2 item xs={10}>
                        <Typography variant="button" color="primary">Make</Typography>
                        <Typography variant="body1">{getMakeName(vehicle.makeId)}</Typography>
                    </Grid2>
                    <Grid2 item xs={10}>
                        <Typography variant="button" color="primary">Model</Typography>
                        <Typography variant="body1">{vehicle.name}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="button" color="primary">Abbreviation</Typography>
                        <Typography variant="body1">{vehicle.abrv}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="button" color="primary">Year</Typography>
                        <Typography variant="body1">{vehicle.year || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <Typography variant="button" color="primary">Color</Typography>
                        <div style={{
                            backgroundColor: vehicle.color,
                            width: '50px',
                            height: '25px',
                            borderRadius: '10%',
                            border: '1px solid #ddd'
                        }} />
                    </Grid2>
                    <Grid2 item xs={4}>
                        <Typography variant="button" color="primary">{" "}</Typography>
                        <Typography variant="h4">
                            {vehicle.favorite ? (<Favorite color="primary" />) : (<FavoriteBorder />)}
                           
                                                             
                                                                        
                        </Typography>
                    </Grid2>
                </Grid2>
            </DialogContent>

            <DialogActions>
                <IconButton onClick={handleEdit} sx={{ float: 'right' }} >
                    <Edit color="textPrimary" />
                </IconButton>
                <IconButton onClick={handleDelete} sx={{ float: 'right' }} >
                    <Delete color="warning" />
                </IconButton>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default ViewVehicle;