import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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


const Homepage = observer(() => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const handleRowClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setViewDialogOpen(true);
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

    const handleDelete = async (modelId) => {
        await vehicleModelStore.deleteModel(modelId);
    };

    return (
        <Container maxWidth="xl">
          <AppToolbar />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                            <TableRow
                               
                            >
                            <TableCell>Make</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Favorite</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {vehicleModelStore.models.map((model) => (
                            <TableRow hover
                                onClick={() => handleRowClick(model)}
                                style={{ cursor: 'pointer' }} key={model.id}>
                                <TableCell>{getMakeName(model.makeId)}</TableCell>
                                <TableCell>{model.name} ({model.abrv})</TableCell>
                                <TableCell>{model.year || 'N/A'}</TableCell>
                                <TableCell>
                                    <div style={{
                                        backgroundColor: model.color || '#fff',
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
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
                                    <IconButton onClick={() => navigate(`/vehicle-models/${model.id}/edit`)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(model.id)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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
        </Container>

    );
});

export default Homepage;
