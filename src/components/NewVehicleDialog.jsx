import { observer } from 'mobx-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio
} from '@mui/material';
import { ChromePicker } from 'react-color';
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
            makeType: 'existing',
            existingMakeId: '',
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
    const makeType = watch('makeType');

    const onSubmit = async (data) => {
        try {
            let makeId = data.makeType === 'existing'
                ? data.existingMakeId
                : await createNewMake(data);

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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Controller
                        name="makeType"
                        control={control}
                        render={({ field }) => (
                            <FormControl component="fieldset" fullWidth margin="normal">
                                <RadioGroup {...field}>
                                    <FormControlLabel
                                        value="existing"
                                        control={<Radio />}
                                        label="Select Existing Make"
                                    />
                                    <FormControlLabel
                                        value="new"
                                        control={<Radio />}
                                        label="Create New Make"
                                    />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />

                    {makeType === 'existing' ? (
                        <Controller
                            name="existingMakeId"
                            control={control}
                            rules={{ required: "Please select a make" }}
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal" error={!!errors.existingMakeId}>
                                    <InputLabel>Select Make</InputLabel>
                                    <Select {...field} label="Select Make">
                                        {vehicleMakeStore.makes.map(make => (
                                            <MenuItem key={make.id} value={make.id}>
                                                {make.name} ({make.abrv})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.existingMakeId && (
                                        <Typography color="error" variant="caption">
                                            {errors.existingMakeId.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />
                    ) : (
                        <>
                            <Controller
                                name="newMakeName"
                                control={control}
                                rules={{
                                    required: "Make name is required",
                                    minLength: { value: 2, message: "Minimum 2 characters" },
                                    maxLength: { value: 50, message: "Maximum 50 characters" }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
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
                                        fullWidth
                                        margin="normal"
                                        label="Make Abbreviation"
                                        error={!!errors.newMakeAbrv}
                                        helperText={errors.newMakeAbrv?.message}
                                    />
                                )}
                            />
                        </>
                    )}

                    {/* Repeat similar Controller pattern for other fields */}
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
                                fullWidth
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
                                fullWidth
                                margin="normal"
                                label="Model Abbreviation"
                                error={!!errors.modelAbrv}
                                helperText={errors.modelAbrv?.message}
                            />
                        )}
                    />

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
                                fullWidth
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
                            <FormControl fullWidth margin="normal">
                                <Button
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
                                    <ChromePicker
                                        color={field.value}
                                        onChangeComplete={(color) => field.onChange(color.hex)}
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
                                        checkedIcon={<Favorite color="error" />}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label="Mark as Favorite"
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Create Vehicle
                    </Button>
                </DialogActions>
            </form>
            <DevTool control={control} /> {/* Optional dev tools */}
        </Dialog>
    );
});

export default NewVehicleDialog;