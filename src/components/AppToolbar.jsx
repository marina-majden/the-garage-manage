import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { styled, alpha } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    Autocomplete,
    TextField,
    Paper,
    ListItem,
    ListItemText
} from '@mui/material';
import { TwoWheeler } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { vehicleModelStore } from '../stores/VehicleModelStore';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';

export const AppToolbar = observer(() => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Search handler
    useEffect(() => {
        const searchVehicles = async () => {
            if (searchTerm.length > 1) {
                const models = vehicleModelStore.models.filter(model =>
                    model.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const makes = vehicleMakeStore.makes.filter(make =>
                    make.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const results = [
                    ...makes.map(make => ({
                        type: 'make',
                        id: make.id,
                        name: make.name,
                        abrv: make.abrv
                    })),
                    ...models.map(model => ({
                        type: 'model',
                        id: model.id,
                        name: model.name,
                        abrv: model.abrv,
                        makeId: model.makeId
                    }))
                ];

                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchVehicles();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSearchChange = (event, value) => {
        setSearchTerm(value);
    };

    const handleSearchSelect = (event, value) => {
        if (value) {
            // Handle selection (e.g., navigate to vehicle detail)
            console.log('Selected:', value);
            setSearchTerm('');
        }
    };

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    return (
        <AppBar position="static" color='primary' sx={{ width: "100%" }}>
            <Toolbar display="flex">
                <TwoWheeler
                sx={{ color: 'primary.light', fontSize: 76, flexGrow: 1, display: { xs: 'none', md: 'inline' }, mr: 1 }} />
                <Typography variant="h3"
                    noWrap
                    sx={{ flexGrow: 1, display: { xs: 'inline' }, mx: 'auto', my: 2 }}>
                    Manage The Garage
                </Typography>
            </Toolbar>
            <Toolbar display="flex">
                <Typography variant="h6" color='primary.light'
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                    Vehicle Management App
                </Typography>
                <Search sx={{ borderRadius: 1, minWidth: 300 }}>
                    <Autocomplete
                        freeSolo
                        options={searchResults}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : `${option.name} (${option.abrv})`
                        }
                        inputValue={searchTerm}
                        onInputChange={handleSearchChange}
                        onChange={handleSearchSelect}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search vehicles..."
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                       
                                            <SearchIcon />
                                       
                                    ),
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: 'inherit',
                                        paddingLeft: '40px'
                                    }
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <ListItem {...props} key={option.id}>
                                <ListItemText
                                    primary={`${option.name} (${option.abrv})`}
                                    secondary={option.type === 'model' ? 'Model' : 'Make'}
                                />
                            </ListItem>
                        )}
                        PaperComponent={({ children }) => (
                            <Paper sx={{
                                backgroundColor: 'background.paper',
                                color: 'text.primary',
                                mt: 1
                            }}>
                                {children}
                            </Paper>
                        )}
                    />
                </Search>
            </Toolbar>
        </AppBar>
    );
});