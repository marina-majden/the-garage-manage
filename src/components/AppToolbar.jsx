import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase
} from '@mui/material';
import { TwoWheeler } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';



export const AppToolbar = () => {
    const [searchTerm, setSearchTerm] = useState('');

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

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'black',
        width: '100%',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

return (

    <AppBar position="static" top="0" color="primary">
        <Toolbar>
            <TwoWheeler sx={{ fontSize: 48, flexGrow: 1, display: { xs: 'none', md: 'inline' }, mr: 1 }} />
            <Typography variant="h3"
                noWrap
                sx={{ flexGrow: 1, display: { xs: 'inline' }, mx: 'auto' }}>
                All The Wheels
            </Typography>
        </Toolbar>
        <Toolbar>
            <Typography variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                Vehicle Management App
            </Typography>
            <Search sx={{

                borderRadius: 1,
                minWidth: 300
            }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search vehicles..."
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search>
        </Toolbar>
    </AppBar>
)


}

