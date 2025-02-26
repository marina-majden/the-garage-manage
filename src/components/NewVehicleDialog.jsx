import { observer } from 'mobx-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    FormControlLabel,
    Checkbox,
    Stack,
    Typography
} from '@mui/material';
import { CompactPicker } from 'react-color';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';
import { vehicleModelStore } from '../stores/VehicleModelStore';


const NewVehicleDialog = observer(({ open, onClose }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            newMakeName: '',
            newMakeAbrv: '',
            modelName: '',
            modelAbrv: '',
            year: '',
            color: '#ffffff',
            favorite: false
        }
    });
    const getContrastColor = (hexColor) => {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    };
    const [showColorPicker, setShowColorPicker] = useState(false);
   

    const onSubmit = async (data) => {
        try {
            let makeId = await createNewMake(data);
            await createNewModel(makeId, data);
            onClose(true);
            reset();
        } catch (error) {
            console.error('Submission failed:', error);
        }
    };

    const createNewMake = async (data) => {
        const make = await vehicleMakeStore.createMake({
            name: data.newMakeName,
            abrv: data.newMakeAbrv
        });
        return make.id;
    };

    const createNewModel = async (makeId, data) => {
        await vehicleModelStore.createModel({
            name: data.modelName,
            abrv: data.modelAbrv,
            makeId,
            year: data.year ? parseInt(data.year) : null,
            color: data.color,
            favorite: data.favorite
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" sx={{ height: "600px" }} >
            <DialogTitle>
                <Typography variant="h4" sx={{ mt: 1, mb: 0  }}>  Add New Vehicle</Typography>
              </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                       <Stack display='flex' fullWidth direction="row" sx={{ justifyContent: "space-around", flexWrap: 'wrap'}} >
                            <Controller
                                name="newMakeName"
                                control={control}
                                rules={{
                                    required: "Vehicle make(brand) name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters" },
                                    maxLength: { value: 50, message: "Maximum 50 characters" }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        sx={{ m: 1, width: "50ch", maxWidth: "70ch" }}
                                        margin="normal"
                                        label="Make Name"
                                        error={!!errors.newMakeName}
                                        helperText={errors.newMakeName?.message}
                                    />
                                )}
                            />

                            <Controller
                           
                                name="newMakeAbrv"
                                control={control}
                                rules={{
                                    required: "Abbreviation is required",
                                    minLength: { value: 2, message: "Minimum 2 characters" },
                                    maxLength: { value: 10, message: "Maximum 10 characters" }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        sx={{ m: 1, width: "20ch" }}
                                        margin="normal"
                                        label="Make Abbreviation"
                                        error={!!errors.newMakeAbrv}
                                        helperText={errors.newMakeAbrv?.message}
                                    />
                                )}
                            />
               </Stack>
                    <Stack display='flex' fullWidth direction="row" sx={{ justifyContent: "space-around", flexWrap: 'wrap' }} >
                    <Controller
                        name="modelName"
                        control={control}
                        rules={{
                            required: "Model name is required",
                            minLength: { value: 2, message: "Minimum 2 characters" },
                            maxLength: { value: 50, message: "Maximum 50 characters" }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ m: 1, width: "50ch", maxWidth: "70ch" }}
                                margin="normal"
                                label="Model Name"
                                error={!!errors.modelName}
                                helperText={errors.modelName?.message}
                            />
                        )}
                    />

                    <Controller
                        name="modelAbrv"
                        control={control}
                        rules={{
                            required: "Model abbreviation is required",
                            minLength: { value: 2, message: "Minimum 2 characters" },
                            maxLength: { value: 10, message: "Maximum 10 characters" }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ m: 1, width: "20ch" }}
                                margin="normal"
                                label="Model Abbreviation"
                                error={!!errors.modelAbrv}
                                helperText={errors.modelAbrv?.message}
                            />
                        )}
                    />
                      </Stack>
                    <Stack display='flex' fullWidth direction="row" sx={{ justifyContent: "space-evenly", alignItems: "center", flexWrap: 'wrap' }} >
                    <Controller
                        name="year"
                        control={control}
                        rules={{
                            min: { value: 1900, message: "Minimum year is 1900" },
                            max: { value: new Date().getFullYear(), message: "Maximum year is current year" }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                sx={{ width: "20ch" }}
                                margin="normal"
                                label="Year"
                                type="number"
                                error={!!errors.year}
                                helperText={errors.year?.message}
                            />
                        )}
                    />

                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <FormControl 
                             >
                                <Button
                                    sx={{ width: "10ch", height: "5ch" }}
                                    variant="outlined"
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    style={{
                                        backgroundColor: field.value,
                                        color: getContrastColor(field.value)
                                    }}
                                >
                                    {field.value || 'Select Color'}
                                </Button>
                                {showColorPicker && (
                                    <CompactPicker
                                       
                                        color={field.value}
                                        onChange={(color) => field.onChange(color.hex)}
                                        onChangeComplete={() => setShowColorPicker(!showColorPicker)}
                                    />
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="favorite"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        icon={<FavoriteBorder />}
                                        checkedIcon={<Favorite color="primary" />}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Mark as Favorite"
                            />
                        )}
                    />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Add Vehicle
                    </Button>
                </DialogActions>
            </form>
           
        </Dialog>
    );
});

export default NewVehicleDialog;