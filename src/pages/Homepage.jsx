import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { AppToolbar } from '../components/AppToolbar';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Fab,
    IconButton,
    Button,
} from '@mui/material';
import { Edit, Delete, Add, Favorite, FavoriteBorder } from '@mui/icons-material';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';
import { vehicleModelStore } from '../stores/VehicleModelStore';
import ViewVehicle from '../components/ViewVehicle';
import NewVehicleDialog from '../components/NewVehicleDialog';
import EditVehicleDialog from '../components/EditVehicleDialog';


const Homepage = observer(() => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState(null);
 
    const handleRowClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setViewDialogOpen(true);
    };

    const handleEditVehicle = (vehicle) => {
        setSelectedVehicleForEdit(vehicle);
        setViewDialogOpen(false);
        setEditDialogOpen(true);
    };

    useEffect(() => {
        vehicleMakeStore.loadMakes();
        vehicleModelStore.loadModels();
    }, []);

    const getMakeName = (makeId) => {
        return vehicleMakeStore.makes.find(make => make.id === makeId)?.name || 'Unknown';
    };

    const handleToggleFavorite = async (modelId, isFavorite) => {
        await vehicleModelStore.updateModel(modelId, { favorite: isFavorite });
    };
    const handleEdit = async (modelId) => {
        await vehicleModelStore.updateModel(modelId);
    };
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            await vehicleModelStore.deleteModel(vehicle.id);
            onClose();
        }
    };

    return (
        <Container maxWidth="xl">
          <AppToolbar />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow color="primary">
                            <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Make</TableCell>
                            <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Model</TableCell>
                            <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Year</TableCell>
                            <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Color</TableCell>
                            <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Favorite</TableCell>
                            <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Edit / Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {vehicleModelStore.models.map((model) => (
                            <TableRow key={model.id} hover
                                onClick={() => handleRowClick(model)}
                                style={{ cursor: 'pointer' }}>
                                <TableCell>{getMakeName(model.makeId)}</TableCell>
                                <TableCell>{model.name}</TableCell>
                                <TableCell>{model.year || 'N/A'}</TableCell>
                                <TableCell>
                                    <div style={{
                                        backgroundColor: model.color || '#fff',
                                        width: 45,
                                        height: 25,
                                        borderRadius: '10%',
                                        border: '1px solid #ddd'
                                    }} />
                                </TableCell>
                                <TableCell>

                                    <IconButton onClick={() => handleToggleFavorite(model.id, !model.favorite)}>
                                        {model.favorite ? (
                                            <Favorite color="error" />
                                        ) : (
                                            <FavoriteBorder />
                                        )}
                                    </IconButton>

                                </TableCell>
                                <TableCell>
                                   
                                    <IconButton onClick={() => handleEditVehicle(model.id)}>
                                      
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(model.id)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>   
                            </TableRow>))}
                     
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" aria-label="add-new" onClick={() => setDialogOpen(true)}
                sx={{ display: { xs: 'none', md: 'block' }, my: 2, mx:'auto' }}
            >
                Add New Vehicle </Button>
            <Fab
                color="primary"
                aria-label="add-new"
                sx={{ position: 'fixed', bottom: 32, right: 32, display: { xs: 'block', md: 'none' } }}
                onClick={() => setDialogOpen(true)}
            >
                <Add />
            </Fab>
            <ViewVehicle
                open={viewDialogOpen}
                vehicle={selectedVehicle}
                onClose={() => setViewDialogOpen(false)}
                onEdit={handleEditVehicle} 
            />
            <NewVehicleDialog
                open={dialogOpen}
                onClose={(success) => {
                    setDialogOpen(false);
                    if (success) {
                        vehicleModelStore.loadModels();
                        vehicleMakeStore.loadMakes();
                    }
                }}
            />
            <EditVehicleDialog
                open={editDialogOpen}
                vehicle={selectedVehicleForEdit}
                onClose={() => setEditDialogOpen(false)}
                onSuccess={() => {
                    vehicleModelStore.loadModels();
                    vehicleMakeStore.loadMakes();
                }}
            />
        </Container>

    );
});

export default Homepage;
