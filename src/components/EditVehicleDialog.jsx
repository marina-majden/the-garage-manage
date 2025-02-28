import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
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
   IconButton
} from '@mui/material';
import { CompactPicker } from 'react-color';
import { Favorite, FavoriteBorder, Close } from '@mui/icons-material';
import { vehicleMakeStore } from '../stores/VehicleMakeStore';
import { vehicleModelStore } from '../stores/VehicleModelStore';

const EditVehicleDialog = observer(({ open, make, vehicle, onClose, onSuccess }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeDetails = vehicleMakeStore.makes.find(make => make.id === vehicle?.makeId);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();
  useEffect(() => {
    if (vehicle && makeDetails) {
      reset({
        newMakeName: makeDetails.name,
        newMakeAbrv: makeDetails.abrv,
        modelName: vehicle.name,
        modelAbrv: vehicle.abrv,
        year: vehicle.year,
        color: vehicle.color,
        favorite: vehicle.favorite
      });
    }
  }, [vehicle?.id, makeDetails?.id, reset]); // Only reset when IDs change

  const handleUpdate = async (data) => {
    setIsSubmitting(true);
    try {
      // Update or create make
      const makeId = await handleMakeUpdate(data);

      // Update model
      await vehicleModelStore.updateModel(vehicle.id, {
        name: data.modelName,
        abrv: data.modelAbrv,
        makeId,
        year: data.year ? parseInt(data.year) : null,
        color: data.color,
        favorite: data.favorite
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakeUpdate = async (data) => {
    if (makeDetails) {
      await vehicleMakeStore.updateMake(makeDetails.id, {
        name: data.newMakeName,
        abrv: data.newMakeAbrv
      });
      return makeDetails.id;
    }
    const newMake = await vehicleMakeStore.createMake({
      name: data.newMakeName,
      abrv: data.newMakeAbrv
    });
    return newMake.id;
  };


  const getContrastColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0,2), 16);
    const g = parseInt(hex.substr(2,2), 16);
    const b = parseInt(hex.substr(4,2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Vehicle
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleUpdate)}>
        <DialogContent>
        
            <>
            <Controller
              name="newMakeName"
              control={control}
              rules={{ required: "Make name is required" }}
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
                rules={{ required: "Make abbreviation is required" }}
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
          

        
          <Controller
            name="modelName"
            control={control}
            rules={{ required: "Model name is required" }}
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
            rules={{ required: "Model abbreviation is required" }}
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
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Year"
                type="number"
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
                  <CompactPicker
                    color={field.value}
                    onChange={(color) => field.onChange(color.hex)}
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
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

export default EditVehicleDialog;