import { Validator } from "mobx-react-form";


export const vehicleMakeForm = () =>
  new Validator({
    fields: {
      name: {
        rules: "required|string",
        label: "Name",
      },
      abrv: {
        rules: "required|string",
        label: "Abbreviation",
      },
    },
  });
export const vehicleModelForm = () =>
  new Validator({
    fields: {
      name: {
        rules: "required|string|between:2,50",
        label: "Name",
      },
      abrv: {
        rules: "required|string|between:2,10",
        label: "Abbreviation",
      },
      makeId: {
        rules: "required|string",
        label: "Vehicle Make",
      },
      year: {
        rules: "required|integer|between:1900,2024",
        label: "Year",
      },
      color: {
        rules: "required|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/",
        label: "Color",
      },
      favorite: {
        rules: "boolean",
        label: "Favorite",
      },
    },
  });
