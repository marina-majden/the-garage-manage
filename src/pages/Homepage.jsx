import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';

import { AppToolbar } from '../components/AppToolbar';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Fab,
    IconButton,
    Button,
} from '@mui/material';
import { Add, Favorite, FavoriteBorder } from '@mui/icons-material';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';
import { vehicleModelStore } from '../stores/VehicleModelStore';
import ViewVehicle from '../components/ViewVehicle';
import EditVehicleDialog from '../components/EditVehicleDialog';
import NewVehicleDialog from '../components/NewVehicleDialog';



const Homepage = observer(() => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await vehicleMakeStore.loadMakes();
                await vehicleModelStore.loadModels();
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [page, rowsPerPage]);



    const handleViewDetailsClick = (modelId) => {
        setSelectedVehicle(modelId);
        setViewDialogOpen(true);
    };


    const getMakeName = (makeId) => {
        return vehicleMakeStore.makes.find(make => make.id === makeId)?.name || 'Unknown';
    };

    const handleToggleFavorite = async (modelId, isFavorite) => {
        try {
            await vehicleModelStore.updateModel(modelId, { favorite: isFavorite });
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };
    const handleEditVehicle = (vehicle) => {
        setSelectedVehicleForEdit(vehicle);
        setViewDialogOpen(false); // Close view dialog
        setEditDialogOpen(true); // Open edit dialog
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        vehicleModelStore.loadModels([], 0, newRowsPerPage);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" color='primary'>
                <AppToolbar />
                <TableContainer component={Paper}
                    sx={{ bgcolor: 'primary.bg', mt: 2 }}>
                    <Table>
                        <TableHead sx={{ borderBottom: "2px solid black", borderBottomColor: 'primary.light' }}>
                            <TableRow>
                                <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Make</TableCell>
                                <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Model</TableCell>
                                <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Year</TableCell>
                                <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Color</TableCell>
                                <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}>Favorite</TableCell>
                                <TableCell style={{ fontSize: 16, fontWeight: 'bold' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vehicleModelStore.models.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No vehicles found
                                    </TableCell>
                                </TableRow>
                            )}


                            {vehicleModelStore.models.map((model) => (
                                <TableRow key={model.id}>
                                    <TableCell>{getMakeName(model.makeId)}</TableCell>
                                    <TableCell>{model.name}</TableCell>
                                    <TableCell>{model.year || 'N/A'}</TableCell>
                                    <TableCell>
                                        <div style={{
                                            backgroundColor: model.color || '#fff',
                                            width: 45,
                                            height: 25,
                                            borderRadius: '4px',
                                            border: '1px solid #ddd'
                                        }} />
                                    </TableCell>
                                    <TableCell>

                                        <IconButton
                                            onClick={() => handleToggleFavorite(model.id, !model.favorite)}
                                            aria-label={model.favorite ? 'Unfavorite' : 'Favorite'}
                                        >
                                            {model.favorite ? <Favorite color="primary" /> : <FavoriteBorder />}
                                        </IconButton>


                                    </TableCell>
                                    <TableCell>

                                        <Button
                                            variant='outlined'
                                            onClick={() => handleViewDetailsClick(model.id)}
                                            aria-label={`View details for ${model.name}`}
                                        >
                                            View Details
                                        </Button>


                                    </TableCell>
                                </TableRow>))}

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    labelRowsPerPage="Rows per page:"
                    labelDisplayedRows={({ from, to, count }) =>
                        loading ? 'Loading...' : `${from}-${to} of ${count}`
                    }
                    rowsPerPageOptions={[5, 10, 25]}
                    count={vehicleModelStore.totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />


                <Button variant="contained" aria-label="add-new" onClick={() => setDialogOpen(true)}
                    sx={{ display: { xs: 'none', md: 'block' }, my: 2, mx: 'auto' }}
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
                    modelId={selectedVehicle}
                    onClose={() => {
                        setViewDialogOpen(false);
                        setSelectedVehicle(null);
                    }}
                    onEdit={handleEditVehicle}
                />
                <EditVehicleDialog
                    open={editDialogOpen}
                    vehicle={selectedVehicleForEdit}
                    onClose={() => setEditDialogOpen(false)}
                    onSuccess={() => {
                        vehicleModelStore.loadModels();
                        vehicleMakeStore.loadMakes();
                        setEditDialogOpen(false);
                    }}
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
        </ThemeProvider>
    );
});

export default Homepage;
